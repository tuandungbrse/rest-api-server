var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      default: true
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'post'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('user', User);
