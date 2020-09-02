var express = require('express');
var { body } = require('express-validator');

var controller = require('./post.controller');
var router = express.Router();
var { protect } = require('../../middlewares/auth/auth.controller');

router
  .route('/')
  .get(protect, controller.getManyPost)
  .post(
    [
      body('title').trim().isLength({ min: 5 }),
      body('content').trim().isLength({ min: 5 })
    ],
    protect,
    controller.createOnePost
  );

router
  .route('/:id')
  .get(protect, controller.getOnePost)
  .post((req, res, next) => req.status(403).end())
  .put(
    [
      body('title').trim().isLength({ min: 5 }),
      body('content').trim().isLength({ min: 5 })
    ],
    protect,
    controller.updateOnePost
  )
  .delete(protect, controller.deleteOnePost);

module.exports = router;
