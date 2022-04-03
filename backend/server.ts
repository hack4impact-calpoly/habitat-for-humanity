import { NextFunction, Request, Response } from 'express';

// import User from './models/userSchema';
const cors = require('cors')
const express = require("express") 
const app = express() 
app.use(express.json())
app.use(cors())

const userEndpoints = require("./routes/userRoutes.ts")
const itemEndpoints = require("./routes/itemRoutes.ts")
const eventEndpoints = require("./routes/eventRoutes.ts")

app.use("/api/users", userEndpoints)
app.use("/api/items", itemEndpoints)
app.use("/api/events", eventEndpoints)

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    next();
});


//testing middleware
function loggerMiddleware(request: Request, response: Response, next: NextFunction) {
    console.log(`${request.method} ${request.path}`);
    next();
}

//logs testing middleware to console
app.use(loggerMiddleware)


app.get('/', (req: Request, res: Response) => {
    res.status(200)
    res.send('Habitat For Humanity Root')
})

app.listen(3001) 