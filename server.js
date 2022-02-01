const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
require('dotenv').config();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'));

// user route
const authRoute = require('./routes/authRoute');

//middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

//routes middleware
app.use('/api/auth', authRoute);

// connect to PORT
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
