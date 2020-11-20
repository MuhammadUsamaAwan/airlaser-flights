const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlightSchema = new mongoose.Schema({
  locationCity: {
    type: String,
    required: true,
  },
  locationAir: {
    type: String,
    required: true,
  },
  destinationCity: {
    type: String,
    required: true,
  },
  destinationAir: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  seats: {
    type: String,
    required: true,
  },
  seatBooked: [
    {
        user: {
            type: Schema.Types.ObjectId,
        },
        number: {
            type: Number,
        },
    }
  ]
});

module.exports = Flight = mongoose.model('flight', FlightSchema);
