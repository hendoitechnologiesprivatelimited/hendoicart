const mongoose = require('mongoose');

const connectDatabase = () => {
    if (!process.env.DB_LOCAL_URI) {
        console.error('DB_LOCAL_URI is not defined in the environment variables.');
        process.exit(1);
    }

    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log(`MongoDB is connected to the host: ${con.connection.host}`);
    }).catch(err => {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    });
};

module.exports = connectDatabase;
