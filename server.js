const express = require('express');
const connectDB  = require('./config/db');
const cors = require('cors');

const app = express()

//connect db
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/flights', require('./routes/api/flights'));
app.use('/api/admin', require('./routes/api/admin'));

//listing to server
const PORT = 5000;

app.listen(PORT, () => console.log ("CORS Enabled Server Started at 5000"));