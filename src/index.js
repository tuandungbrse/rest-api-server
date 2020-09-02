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
    var io = require('socket.io')(server);
    io.on('connection', (socket) => {
      console.log('A client just connected', socket);
    });
  } catch (error) {
    console.log(error);
  }
};

init();
