var fs = require('fs');
var path = require('path');

exports.deletePhoto = function deletePhoto(url) {
  url = path.join(__dirname, '..', '..', 'images', url);
  fs.unlink(url, (err) => console.log(err));
};
