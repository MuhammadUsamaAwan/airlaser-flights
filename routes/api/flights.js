const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const Flight = require('../../models/flight');
const auth = require('../../middlewave/auth');

// @route    POST api/flights
// @desc     New flight
// @access   Private
router.post(
  '/',
  auth,
  [
    check('locationCity', 'Location City must be between 3 and 20 characters').isLength({
      min: 3,
      max: 20,
    }),
    check('locationAir', 'Location Airport must be between 3 and 60 characters').isLength({
      min: 3,
      max: 60,
    }),
    check('destinationCity', 'Location City must be between 3 and 20 characters').isLength({
      min: 3,
      max: 20,
    }),
    check('destinationAir', 'Destination Airport must be between 3 and 60 characters').isLength({
      min: 3,
      max: 60,
    }),
    check('time', 'Time must exists').exists(),
    check('date', 'Date must exist').exists(),
    check('seats', 'Available seats must exist').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { locationCity, locationAir, destinationCity, destinationAir, time, date, seats } = req.body;

    try {
      flight = new Flight({
        locationCity, locationAir, destinationCity, destinationAir, time, date, seats
      });
      await flight.save();
      res.send('Flight Created')
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
    }
);

// @route    DELETE api/flights/:flightid/
// @desc     Delete flight
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(400).json({ msg: 'flight not found' });
    delete flight;
    await flight.save();
    res.json("Flight Deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    GET api/flights
// @desc     Get all flights
// @access   Public
router.get('/', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/flights/:id
// @desc     Get flight by flight ID
// @access   Public
router.get('/:id', async (req, res) => {
    try {
      const flight = await Flight.findById(req.params.id);
      if (!flight) return res.status(400).json({ msg: 'flight not found' });
  
      res.json(flight);
    } catch (err) {
      console.error(err.message);
      if (err.kind == 'ObjectId') {
        return res.status(400).json({ msg: 'flight not found' });
      }
      res.status(500).send('Server Error');
    }
});


// @route    POST api/flights/:flightid/:seat
// @desc     Book seat
// @access   Private
router.post('/:id/:seat', auth, async (req, res) => {
    try {
      const flight = await Flight.findById(req.params.id);
      if (!flight) return res.status(400).json({ msg: 'flight not found' });
      const arr = flight.seats.split(',');
      if (!arr.includes(req.params.seat)) return res.status(400).json({ msg: 'seat not available' });
      const user = await User.findById(req.user.id).select('id');
      const newSeat = {
        user: req.user.id,
        number: req.params.seat
      };
      
      flight.seatBooked.push(newSeat);
      arr.splice(arr.indexOf(req.params.seat), 1);
      flight.seats = arr.toString()
      await flight.save();
      res.json("Seat booked");
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route    DELETE api/flights/:flightid/:seat
// @desc     Cancel seat
// @access   Private
router.delete('/:id/:seat', auth, async (req, res) => {
    try {
      const flight = await Flight.findById(req.params.id);
      if (!flight) return res.status(400).json({ msg: 'flight not found' });
      const seat = flight.seatBooked.find(
        seat => seat.id === req.params.seat
      );
      if (!seat) {
        return res.status(404).json({ msg: 'Seat does not exist' });
      }
      if (seat.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      // flight.seats = flight.seats.concat(`,${seat.number}`);
      flight.seatBooked = flight.seatBooked.filter(
        ({ id }) => id !== req.params.seat
      );
      await flight.save();
      res.json("Seat Canceled");
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

module.exports = router;