const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/database');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config/config.env') });

// Debugging: Verify that DB_LOCAL_URI is loaded correctly
console.log('DB_LOCAL_URI:', process.env.DB_LOCAL_URI);

// Connect to the database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`My Server is listening on Port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled rejection error`);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);
    server.close(() => {
        process.exit(1);
    });
});
