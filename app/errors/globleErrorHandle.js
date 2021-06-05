import appError from "./appError";

// Development Error
const devError = (err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode)
        .json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            err
        });
};

// production Error
const prodError = (err, req, res, next) => {
    // Operation trusted error message : Send to client
    if (err.isOperational) {
        return res.status(err.statusCode)
            .json({
                status: err.status,
                message: err.message,
            });
    } else {
        console.log(err);

        return res.status(err.statusCode)
            .json({
                status: err.status,
                message: `Something went wrong.`,
            });
    }
};


// Error hub
const ErrorHandler = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';

    if (process.env.NODE_ENV === 'dev') {
        devError(err, req, res, next);
    } else if (process.env.NODE_ENV === 'prod') {
        prodError(err, req, res, next);
    }
};

export default ErrorHandler;


