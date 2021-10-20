const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// routers imported!
const userRouter = require('./api/routes/user');
const reviewRouter = require('./api/routes/reviews');
const searchRouter = require('./api/routes/search');

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
app.use(express.urlencoded({extended: false}));

// routes!
app.use('/user',userRouter);
app.use('/reviews',reviewRouter);
app.use('/search',searchRouter);

// listening at port 5000!
app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
})

