import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Flight from './Flight';

const Flights = () => {
    const [alert, setAlert] = useState({show: false, msg:'', variant:''});
    const [flights, setFlights] = useState([]);
    const getFlights = async() => {
        try {
            const res = await axios.get('http://localhost:5000/api/flights');
            setFlights(res.data);
        } catch(err) {
            setAlert({...alert, show: true, msg: err.response.data.msg, variant: 'danger'})
        }
    }
    useEffect(() => {
        getFlights();
    }, [])
    return (
        <React.Fragment>
            {alert.show && (
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, show: false})} dismissible>
                <Alert.Heading>{alert.msg}</Alert.Heading>
            </Alert>
            )}
            <h1 className="display-4 text-center">Flights</h1>
            {flights.map(flight =>
                <Flight key={flight._id} id={flight._id} locationCity={flight.locationCity} locationAir={flight.locationAir} destinationAir={flight.destinationAir}
                    destinationCity={flight.destinationCity} date={flight.date} time={flight.time}
                />
            )
            }
        </React.Fragment>

    )
}

export default Flights
