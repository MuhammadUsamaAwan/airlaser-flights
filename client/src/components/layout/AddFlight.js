import React, {useState} from 'react'
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';

const AddFlight = () => {
    const [formData, setFormData] = useState({locationCity: '', locationAir: '', destinationCity: '', destinationAir: '', date: '', time: '', seats: ''});
    const [alert, setAlert] = useState({show: false, msg:'', variant:''});
    const {locationCity, locationAir, destinationCity, destinationAir, date, time, seats} = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const addFlight = async(e) => {
        e.preventDefault();
        const config = {
            headers: {
              'Content-Type': 'application/json',
            },
        };
        const body = JSON.stringify({ locationCity, locationAir, destinationCity, destinationAir, date, time, seats });
        try {
            await axios.post('http://localhost:5000/api/flights', body, config);
            setAlert({...alert, show: true, msg: "Flight Added", variant: 'success'});
            setFormData({...formData, locationCity: '', locationAir: '', destinationCity: '', destinationAir: '', date: '', time: '', seats: ''});
        } catch(err) {
            const errors = err.response.data.errors;
            if (errors) {
                errors.forEach(error => setAlert({...alert, show: true, msg: error.msg, variant: 'danger'}));
            }
        }
    }
    return (
        <form className="signup" onSubmit={addFlight}>
            {alert.show && (
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, show: false})} dismissible>
                <Alert.Heading>{alert.msg}</Alert.Heading>
            </Alert>
            )}
            <h1>Add Flight</h1>
            <input type='text' name='locationCity' placeholder='Location City' value={locationCity} onChange={onChange} required />
            <input type='text' name='locationAir' placeholder='Location Airport' value={locationAir} onChange={onChange} required />
            <input type='text' name='destinationCity' placeholder='Destination City' value={destinationCity} onChange={onChange} required />
            <input type='text' name='destinationAir' placeholder='Destination Airport' value={destinationAir} onChange={onChange} required />
            <input type='text' name='date' placeholder='Date' value={date} onChange={onChange} required />
            <input type='text' name='time' placeholder='Time' value={time} onChange={onChange} required />
            <input type='text' name='seats' placeholder='Seats' value={seats} onChange={onChange} required />
            <input type='submit' value='Add flight'/>
        </form>
    )
}

export default AddFlight
