import express from "express";
import { config } from "dotenv";
import appError from "./app/errors/appError";
import ErrorHandler from "./app/errors/globleErrorHandle";
import bookingRouter from './app/http/routers/booking.routers';
import morgan from "morgan";


// app initialize
const app = express();
config({ path: './app/config/config.env' });
app.use(express.json());
if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));



app.use('/api-v1/bookings', bookingRouter);



app.get('*', (req, res, next) => {
    next(new appError(`This * ${req.originalUrl} * URL not found.`, 404));
});
// Error handler
app.use(ErrorHandler);

export default app;