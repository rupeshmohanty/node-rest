const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// routers imported!
const userRouter = require('./api/routes/user');
const reviewRouter = require('./api/routes/reviews');

// get the uri for db connect!
const uri = require('./config');

const app = express();
const port = process.env.port || 5000;

// mongoose connection checking!
mongoose.connect(uri, () => {
    console.log('Connected to the database!');
})

// middleware!
app.use(cors());
app.use(express.json());

// routes!
app.use('/user',userRouter);
app.use('/reviews',reviewRouter);

// listening at port 5000!
app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
})

