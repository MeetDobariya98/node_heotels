const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
require('dotenv').config();
const passport=require('./auth')
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

//middleware
const logRequest=(req,res,next)=>{
    console.log(`${new Date().toLocaleString()} request made to : ${req.originalUrl}`);
    next();
}
app.use(logRequest);

app.use(passport.initialize());
const localAutMiddaleware=passport.authenticate('local',{session:false})

// Root route
app.get('/',logRequest, (req, res) => {
    res.send(' Welcome to my hotel ');
});

//import the router files
const personRouter = require('./routs/personrouts');
const menuItemRouts= require('./routs/menuItemRouts')

//use the routers
app.use('/person',localAutMiddaleware, personRouter);
app.use('/menu',menuItemRouts);

// Start the server
app.listen(3000, () => {
    console.log('Server is live on port 3000');
});
