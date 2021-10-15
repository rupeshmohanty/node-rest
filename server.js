const express = require('express');
const cors = require('cors');

// routers imported!
const productRouter = require('./api/routes/products');
const orderRouter = require('./api/routes/orders');

const app = express();
const port = process.env.port || 5000;

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

