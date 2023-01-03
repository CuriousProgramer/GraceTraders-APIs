const express = require('express');
const { get } = require('express/lib/response');
const fs = require('fs');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const productController = require('./controllers/productController');
const productRouter = require('./routes/productRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const userRouter = require('./routes/userRoutes');
const purchaseRouter = require('./routes/purchaseRoutes');
const supplierRouter = require('./routes/supplierRoutes');
const orderRouter = require('./routes/orderRoutes');
const globalErrorhandler = require('./controllers/errorController');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middle ware');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use('/api/v1/products', productRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/purchases', purchaseRouter);
app.use('/api/v1/suppliers', supplierRouter);
app.use('/api/v1/orders', orderRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cant find ${req.originalUrl} on this server!`,
  // });

  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorhandler);

module.exports = app;
