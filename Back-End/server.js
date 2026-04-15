const path = require('path');

const express = require('express');
const morgan = require('morgan');
const dbConnect = require('./config/database.js');
const app = express();
const ApiError = require('./utils/api-error.js');
const dotenv = require('dotenv');
const cors = require('cors')
const compress = require('compression')
dotenv.config({ path: 'config.env' });

//routers
const {mountRouter} = require('./routes');

//Database Connection
dbConnect();

//Middleware
app.use(cors())
app.use(compress())
app.use(express.urlencoded({ extended: true }));
const globalError = require('./middlewares/error.middleware.js');
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
app.set('query parser', 'extended');

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
