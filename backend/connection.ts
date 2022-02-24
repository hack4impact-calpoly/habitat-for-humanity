const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

function makeNewConnection(url : string) {
    const connection = mongoose.createConnection(url)

    connection.on('connected', function () {
        console.log(`MongoDB :: connected`);
    });

    connection.on('disconnected', function () {
        console.log(`MongoDB :: disconnected`);
    });

    //still needs error checking

    return connection;
}

const userConnection = makeNewConnection(process.env.userDB!)

export { userConnection };