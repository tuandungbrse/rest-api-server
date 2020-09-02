// node native
var path = require('path');

// third-party
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cors = require('cors');
var { v4: uuidv4 } = require('uuid');

var app = express();

var fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'images'));
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
  }
});

var filter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var postRoute = require('./resources/post/post.route');

// middlewares
app.use(cors());
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: filter }).single('image'));

//
app.use('/api/posts', postRoute);

// handle / route
app.get('/', async (req, res) => {
  res.json({ title: 'Express' });
});

// error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json(message);
});

module.exports = app;
