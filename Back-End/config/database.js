const mongoose = require('mongoose');

const dbConnect = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log(`Database connected successfully: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.log(`Database connection failed: ${err.message}`);
      process.exit(1);
    });
};

module.exports = dbConnect;


