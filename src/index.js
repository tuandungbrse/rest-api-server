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
    var io = require('./socket').init(server);
    io.on('connection', (socket) => {
      console.log('A client just connected', socket);
    });
  } catch (error) {
    console.log(error);
  }
};

init();
