const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// routers imported!
const productRouter = require('./api/routes/products');
const orderRouter = require('./api/routes/orders');

// get the uri for db connect!
const uri = require('./config');

const app = express();
const port = process.env.port || 5000;

// mongoose connection!
mongoose.connect(uri, { useMongoClient: true })

// middleware!
app.use(cors());
app.use(express.json());

// routes!
app.use('/products',productRouter);
app.use('/orders', orderRouter);

// listening at port 5000!
app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
})

