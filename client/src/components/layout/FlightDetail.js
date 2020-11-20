import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import setAuthToken from '../../ultis/setAuthToken';

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const FlightDetail = ({match}) => {
    const [alert, setAlert] = useState({show: false, msg:'', variant:''});
    const [flight, setFlight] = useState({seats: "", seatBooked: []});
    const history = useHistory();
    const getFlight = async() => {
        try {
            const res = await axios.get(`http://localhost:5000/api/flights/${match.params.id}`);
            setFlight(res.data);
        } catch(err) {
            const errors = err.response.data.errors;
            if (errors) {
                errors.forEach(error => setAlert({...alert, show: true, msg: error.msg, variant: 'danger'}));
            }
        }
    }
    const bookSeat = async(seat) => {
        const config = {
            headers: {
              'Content-Type': 'application/json',
            },
        };
        try {
            console.log(config)
            await axios.post(`http://localhost:5000/api/flights/${match.params.id}/${seat}`, config);
            setAlert({...alert, show: true, msg: "Seat Booked", variant: 'success'});
            setTimeout(()=>history.go(0), 500);
        } catch(err) {
            setAlert({...alert, show: true, msg: err.response.data.msg, variant: 'danger'})
        }
    }
    const cancelSeat = async(id) => {
        const config = {
            headers: {
              'Content-Type': 'application/json',
            },
        };
        try {
            console.log(config)
            await axios.delete(`http://localhost:5000/api/flights/${match.params.id}/${id}`, config);
            setAlert({...alert, show: true, msg: "Seat Canceled", variant: 'success'});
            setTimeout(()=>history.go(0), 500);
        } catch(err) {
            setAlert({...alert, show: true, msg: err.response.data.msg, variant: 'danger'})
        }
    }
    useEffect(() => {
        getFlight();
    }, [])
    return (
        <React.Fragment>
            {alert.show && (
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, show: false})} dismissible>
                <Alert.Heading>{alert.msg}</Alert.Heading>
            </Alert>
            )}
            <h1 className="display-4 text-center">Flight Detail</h1>
            <div className="card">
            <div className="card-body bg-dark text-light">
                <h5 className="card-title">{flight.locationCity} to {flight.destinationCity}</h5>
                <p className="card-text">{flight.locationAir} to {flight.destinationAir}</p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">{flight.date}</li>
                <li className="list-group-item">{flight.time}</li>
            </ul>
            <div className="card-body">
                <h5>Available Seats</h5>
                {flight.seats.split(',').map(seat =>
                    <li className="list-group-item" key={seat}>Seat #{seat}<span className="float-right text-success" onClick={() => bookSeat(seat)}>Book Now</span></li>
                )}
            </div>
            <div className="card-body">
                <h5>Seats You Booked</h5>
                {flight.seatBooked.map(seat =>
                    localStorage.getItem('id') === seat.user && (
                    <li className="list-group-item" key={seat._id}>Seat #{seat.number}<span className="float-right text-danger" onClick={() => cancelSeat(seat._id)}>Cancel Seat</span></li>
                    )
                )}
            </div>
        </div>
        </React.Fragment>
    )
}

export default FlightDetail
