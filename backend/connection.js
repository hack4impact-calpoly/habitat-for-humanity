const dotenv = require('dotenv')
const mongoose = require("mongoose")

dotenv.config()

function makeNewConnection(url) {
    const connection = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true })
    const DBname = url.substring(url.lastIndexOf("net/") + 4, url.lastIndexOf("?"))

    connection.on('connected', function () {
        console.log(`MongoDB :: connected :: ${DBname}`);
    });

    connection.on('disconnected', function () {
        console.log(`MongoDB :: disconnected`);
    });

    //still needs error checking
    mongoose.connection.on('error', (err) => {
        console.log(err);
    });

    return connection;
}

// console.log(process.env.userDB)
const userConnection = makeNewConnection(process.env.userDB)
const itemConnection = makeNewConnection(process.env.itemDB)
const eventConnection = makeNewConnection(process.env.eventDB)
const imageConnection = makeNewConnection(process.env.imageDB)



module.exports = { userConnection, itemConnection, eventConnection, imageConnection };