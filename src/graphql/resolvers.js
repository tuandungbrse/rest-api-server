var User = require('../resources/user/user.model');
var bcrypt = require('bcryptjs');
var validator = require('validator');
var jwt = require('../utils/jwt');
module.exports = {
  createUser: async function ({ userInput }, req) {
    // const email = args.userInput.email;
    var errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push('Email is invalid!');
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push('Password too short!');
    }
    if (errors.length > 0) {
      var invalidInput = new Error('Invalid input!');
      invalidInput.data = errors;
      invalidInput.code = 422;
      throw invalidInput;
    }
    const email = userInput.email;
    const user = await User.findOne({ email });
    if (user) {
      var error = new Error('User already exists!');
      throw error;
    }
    const password = await bcrypt.hash(userInput.password, 12);
    const createdUser = await User.create({
      email,
      password,
      name: userInput.name
    });
    return {
      ...createdUser._doc,
      _id: createdUser._id.toString()
    };
  },

  login: async function ({ email, password }) {
    var user = await User.findOne(email);
    if (!user) {
      var error = new Error('User not found!');
      error.code = 401;
      throw error;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      var error = new Error('Password is incorrect!');
      error.code = 401;
      throw error;
    }
    const token = await jwt.generateToken({ id: user.id.toString() });
    return { token, id: user.id.toString() };
  }
};
