const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production';

let DB_URI = 'mongodb://localhost/bololog';

if(process.env.MONGODB_URI) {
    DB_URI = process.env.MONGODB_URI;
}

console.log('DB', DB_URI);

const app = express();
mongoose.connect('mongodb://localhost/bololog');
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if(!isProduction) {
  app.use(errorHandler());
}

app.use(express.static(path.join(__dirname, 'app', 'dist')));

mongoose.connect(DB_URI);
mongoose.set('debug', true);

// Add models
require('./models/User');
require('./models/Blog');
require('./models/Post');

app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname, 'app', 'dist', 'index.html'));
});

app.use('/api', require('./routes'));

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, 'app', 'dist', 'index.html'));
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

var port = process.env.PORT || 8080;
app.listen(port);
