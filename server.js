const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Root route
app.get('/', (req, res) => {
    res.send(' Welcome to my hotel ');
});

//import the router files
const personRouter = require('./routs/personrouts');
const menuItemRouts= require('./routs/menuItemRouts')

//use the routers
app.use('/person', personRouter);
app.use('/menu',menuItemRouts);

// Start the server
app.listen(3000, () => {
    console.log('Server is live on port 3000');
});
