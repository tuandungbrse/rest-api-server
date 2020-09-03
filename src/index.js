require('dotenv').config();
var mongoose = require('mongoose');
var app = require('./app');
var http = require('http');

const init = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    var server = http.createServer(app);
    server.listen(8080);
  } catch (error) {
    console.log(error);
  }
};

init();
