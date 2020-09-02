var express = require('express');
var router = express.Router();
var { body } = require('express-validator');
var User = require('../../resources/user/user.model');
var controller = require('./auth.controller');

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email!')
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('Email address already existed!');
        }
        return Promise.resolve(true);
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 8 }),
    body('name').trim().not().isEmpty()
  ],
  controller.signup
);
router.post('/signin', controller.signin);

module.exports = router;
