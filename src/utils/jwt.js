var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.generateToken = function generateToken(data) {
  return new Promise((resolved, reject) => {
    jwt.sign(data, JWT_SECRET, (err, token) => {
      if (err) {
        reject(err);
      }
      resolved(token);
    });
  });
};

exports.verifyToken = function verifyToken(token) {
  return new Promise((resolved, reject) => {
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) return reject(err);
      resolved(payload);
    });
  });
};
