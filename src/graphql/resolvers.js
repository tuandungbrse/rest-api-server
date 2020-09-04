var User = require('../resources/user/user.model');
var Post = require('../resources/post/post.model');
var bcrypt = require('bcryptjs');
var validator = require('validator');
var jwt = require('../utils/jwt');
const { post } = require('../app');

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

  createPost: async function ({ postInput }, req) {
    if (!req.isAuth) {
      var error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    var errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: 'Title is invalid!' });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: 'Content is invalid!' });
    }
    if (errors.length > 0) {
      var invalidInput = new Error('Invalid input!');
      invalidInput.data = errors;
      invalidInput.code = 422;
      throw invalidInput;
    }
    const post = await Post.create({
      title: postInput.title,
      content: postInput.content,
      photo: postInput.photo,
      createdBy: req.user.id
    });
    req.user.posts.push(post);
    await req.user.save();
    return {
      ...post._doc,
      id: post.id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    };
  },

  login: async function ({ email, password }) {
    var user = await User.findOne({ email });
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
  },

  posts: async function ({ page }, req) {
    if (!req.isAuth) {
      var error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const CURRENT_PAGE = page || 1;
    const PAGE_SIZE = 2;

    const totalPosts = await Post.find({}).countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .populate('createdBy');
    return {
      posts: posts.map((post) => {
        return {
          ...post._doc,
          id: post.id.toString(),
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString()
        };
      }),
      totalPosts: totalPosts
    };
  }
};
