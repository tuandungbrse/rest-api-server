var User = require('../../resources/user/user.model');
var { validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('../../utils/jwt');

exports.signup = async function signup(req, res, next) {
  try {
    var errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      let error = new Error('Validation failed!');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 12);
    const name = req.body.name;
    const user = await User.create({
      email,
      password,
      name
    });
    res.status(201).json({ data: user });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.signin = async function signin(req, res, next) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User does not exist!');
      error.statusCode = 401;
      throw error;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = await jwt.generateToken({ id: user.id });
    res.status(200).json({ data: { token, id: user.id } });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.protect = async function protect(req, res, next) {
  try {
    console.log(bearer);
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith('Bearer ')) {
      var error = new Error('Not authenticated!');
      error.statusCode = 401;
      throw error;
    }
    const token = bearer.split('Bearer ')[1].trim();
    const payload = await jwt.verifyToken(token);
    if (!payload) {
      var error = new Error('Token is not valid!');
      error.statusCode = 401;
      throw error;
    }
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).end();
    req.user = user;
    return next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.protectGraphQL = async function protect(req, res, next) {
  try {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith('Bearer ')) {
      req.isAuth = false;
      return next();
    }
    const token = bearer.split('Bearer ')[1].trim();
    const payload = await jwt.verifyToken(token);
    if (!payload) {
      req.isAuth = false;
      return next();
    }
    const user = await User.findById(payload.id);
    if (!user) {
      req.isAuth = false;
      return next();
    }
    req.user = user;
    req.isAuth = true;
    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
