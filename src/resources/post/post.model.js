var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdBy: {
      type: Object,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('post', Post);
