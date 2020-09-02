require('dotenv').config();
var mongoose = require('mongoose');

var app = require('./app');

mongoose
  .connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    app.listen(8080);
  })
  .catch((error) => console.log(error));
