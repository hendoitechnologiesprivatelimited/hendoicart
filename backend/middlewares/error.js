module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err
        });
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        // Handle specific Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message).join(', ');
            error = new Error(message);
            error.statusCode = 400;
        }

        // Handle Mongoose CastError
        if (err.name === 'CastError') {
            const message = `Resource not found: ${err.path}`;
            error = new Error(message);
            error.statusCode = 400;
        }

        // Handle Mongoose duplicate key error
        if (err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} value entered`;
            error = new Error(message);
            error.statusCode = 400;
        }

        // Handle JWT error
        if (err.name === 'JsonWebTokenError') {
            const message = 'JSON Web Token is invalid. Try again.';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Handle JWT expired error
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web Token has expired. Try again.';
            error = new Error(message);
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};
