import { NextFunction, Request, Response } from 'express';
import User from './models/user';
const express = require("express") 
const app = express() 

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
    next();
});

app.use(express.json())

//testing middleware
function loggerMiddleware(request: Request, response: Response, next: NextFunction) {
    console.log(`${request.method} ${request.path}`);
    next();
}

//logs testing middleware to console
app.use(loggerMiddleware)

//testing endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!')
})

//get all users
app.get("/api/users", async (req: Request, res: Response) => {
    const users = await User.find({})
    res.send(users)
})

//get all volunteers
app.get("/api/volunteers", async (req: Request, res: Response) => {
    const volunteers = await User.find({userType: "Volunteer"})
    res.send(volunteers)
})

//get all donators
app.get("/api/donators", async (req: Request, res: Response) => {
    const donators = await User.find({userType: "Donator"})
    res.send(donators)
})

//get all admins
app.get("/api/admins", async (req: Request, res: Response) => {
    const admins = await User.find({userType: "Admin"})
    res.send(admins)
})


app.listen(3001) 