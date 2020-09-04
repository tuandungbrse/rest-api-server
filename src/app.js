// node native
var path = require('path');

// third-party
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cors = require('cors');
var { v4: uuidv4 } = require('uuid');
var fileUpload = require('../src/utils/file.upload');
var { graphqlHTTP } = require('express-graphql');
var schema = require('./graphql/schema');
var resolvers = require('./graphql/resolvers');
var auth = require('./middlewares/auth/auth.controller');
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

// var postRoute = require('./resources/post/post.route');
// var authRoute = require('./middlewares/auth/auth.route');

// middlewares
app.use(cors());
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: filter }).single('image'));
app.use(auth.protectGraphQL);
app.put('/post-image', (req, res, next) => {
  if (!req.file) {
    return res.status(200).json({ message: 'No image provided!' });
  }
  if (req.body.oldPath) {
    fileUpload.deletePhoto(req.body.oldPath);
  }
  return res
    .status(201)
    .json({ message: 'File stored!', path: req.file.filename });
});
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
    customFormatErrorFn(error) {
      if (!error.originalError) {
        return error;
      }
      const data = error.originalError.data;
      const message = error.message || 'An error occurred.';
      const code = error.originalError.code || 500;
      return { data, message, code };
    }
  })
);

// setting up routes
// app.use('/api/auth', authRoute);
// app.use('/api/posts', postRoute);

// handle index / route
app.get('/', async (req, res) => {
  res.json({ title: 'Express' });
});

// error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

module.exports = app;
