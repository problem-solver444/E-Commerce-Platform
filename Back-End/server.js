const path = require('path');

const express = require('express');
const morgan = require('morgan');
const dbConnect = require('./config/database.js');
const app = express();
const ApiError = require('./utils/api-error.js');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const compress = require('compression');
const rateLimit = require("express-rate-limit");
const xss = require('xss-clean');
dotenv.config({ path: 'config.env' });

//routers
const { mountRouter } = require('./routes');
const{webHookCheckOut} = require('./controllers/order.controller');


//Database Connection
dbConnect();


//Middleware
app.use(cors());
app.use(compress());
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webHookCheckOut,
);
// To remove data using these defaults:
app.use(mongoSanitize());
app.use(xss());
const globalError = require('./middlewares/error.middleware.js');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '10kb' }));
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
app.set('query parser', 'extended');

const limiter=rateLimit({
  max:10,
  windowMs:15*60*1000,
  message:"Too many requests, try later"
});
app.use("/api/v1/auth/forgotPassword'",limiter);
app.use("/api/v1/auth/login",limiter);


//Mount Routes
mountRouter(app);

//Handle unhandled routes
app.use((req, res, next) => {
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 400));
});

//global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Handle unhandled promise rejections like mongoDB connect --> outside express
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Errors: ${err.name} | ${err.message}`);
  server.close((err) => {
    console.error('Shutting down ......');
    process.exit(1);
  });
});
