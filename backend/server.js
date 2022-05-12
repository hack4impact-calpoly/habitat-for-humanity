// import { NextFunction, Request, Response } from 'express';

// import User from './models/userSchema';
// import cors from 'cors';
// import express from 'express';
const cors = require('cors')
const express = require("express")
// import userEndpoints from './routes/userRoutes.js';
// import itemEndpoints from './routes/itemRoutes.js';
// import eventEndpoints from './routes/eventRoutes.js';

const app = express() 
app.use(express.json())
app.use(cors())

const userEndpoints = require("./routes/userRoutes.js")
// const itemEndpoints = require("./routes/itemRoutes.js")
// const eventEndpoints = require("./routes/eventRoutes.js")

app.use("/api/users", userEndpoints)
// app.use("/api/items", itemEndpoints)
// app.use("/api/events", eventEndpoints)

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    next();
});


//testing middleware
function loggerMiddleware(request, response, next) {
    console.log(`${request.method} ${request.path}`);
    next();
}

//logs testing middleware to console
app.use(loggerMiddleware)


app.get('/', (req, res) => {
    res.status(200)
    res.send('Habitat For Humanity Root')
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;