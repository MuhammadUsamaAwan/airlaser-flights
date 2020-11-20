import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert'

const Signup = () => {
    const [formData, setFormData] = useState({email: '', name: '', password: '', password2: ''});
    const [alert, setAlert] = useState({show: false, msg:'', variant:''});
    const { email, name, password, password2 } = formData;
    const history = useHistory();
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const register = async(e) => {
        e.preventDefault();
        if (password === password2) {
            const config = {
                headers: {
                  'Content-Type': 'application/json',
                },
            };
            const body = JSON.stringify({ name, email, password });
            try {
                await axios.post('http://localhost:5000/api/users', body, config);
                setAlert({...alert, show: true, msg: "Signup Successful", variant: 'success'});
                setTimeout(()=>history.push('/login'), 500);
            } catch(err) {
                const errors = err.response.data.errors;
                if (errors) {
                    errors.forEach(error => setAlert({...alert, show: true, msg: error.msg, variant: 'danger'}));
                }
            }
        }
        else {
            setAlert({...alert, show: true, msg: "Passwords don't match", variant: 'danger'})
        }
    }
    return (
        <form className="signup" onSubmit={register}>
            {alert.show && (
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, show: false})} dismissible>
                <Alert.Heading>{alert.msg}</Alert.Heading>
            </Alert>
            )}
            <h1>Sign Up</h1>
            <input type="email" placeholder="Email" onChange={onChange} value={email} name="email" required/>
            <input type="text" placeholder="Name" onChange={onChange} value={name} name="name" minLength='6' maxLength='20' required/>
            <input type="password" placeholder="Password" onChange={onChange} value={password} name="password" minLength='6' maxLength='20' required/>
            <input type="password" placeholder="Confirm Password" onChange={onChange} value={password2} name="password2" minLength='6' maxLength='20' required/>
            <input type="submit" value="Sign Up" />
            <Link to='/login'>Already have an acoount?</Link>
        </form>
    )
}

export default Signup
