import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';

const Admin = () => {
    localStorage.clear();
    const [formData, setFormData] = useState({name: '', password: ''});
    const [alert, setAlert] = useState({show: false, msg:'', variant:''});
    const history = useHistory();
    const { name, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const login = async(e) => {
        e.preventDefault();
        const config = {
            headers: {
              'Content-Type': 'application/json',
            },
        };
        const body = JSON.stringify({ name, password });
        try {
            const res = await axios.post('http://localhost:5000/api/admin/auth', body, config);
            setAlert({...alert, show: true, msg: "Login Successful", variant: 'success'});
            localStorage.setItem('token', res.data.token);
            setTimeout(()=>history.push('/add'), 500);
        } catch(err) {
            const errors = err.response.data.errors;
            if (errors) {
                errors.forEach(error => setAlert({...alert, show: true, msg: error.msg, variant: 'danger'}));
            }
        }
    }
    return (
        <form className="login" onSubmit={login}>
            {alert.show && (
            <Alert variant={alert.variant} onClose={() => setAlert({...alert, show: false})} dismissible>
                <Alert.Heading>{alert.msg}</Alert.Heading>
            </Alert>
            )}
            <h1>Admin Login</h1>
            <input type="name" placeholder="Name" onChange={onChange} value={name} name="name" required/>
            <input type="password" placeholder="Password" onChange={onChange} value={password} name="password" minLength='6' maxLength='20' required/>
            <input type="submit" value="Login" />
        </form>
    )
}

export default Admin
