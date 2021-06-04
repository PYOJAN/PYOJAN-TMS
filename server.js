import app from './app';
import mongoose from "mongoose";


// Database connection
const URI = process.env.URI;
mongoose.connect(URI, { useUnifiedTopology: true }, () => {
    console.log(`Database connected...`);
});

// Server start
const PORT = (process.env.NODE_ENV === 'dev') ? process.env.PORT : 8000;
app.listen(PORT, () => {
    console.log(`Server Start on http://127.0.0.1:${PORT} with mode:- ${process.env.NODE_ENV}`);
});