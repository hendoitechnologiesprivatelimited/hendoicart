const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

app.use(cors());




// Body parser middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Import routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const payment = require ('./routes/payment');


// Use routes
app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);
app.use('/api/v1', payment);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res, next)=> {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

// Error middleware
app.use(errorMiddleware);

module.exports = app;  

