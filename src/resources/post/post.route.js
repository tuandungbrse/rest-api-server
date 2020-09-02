var express = require('express');
var { body } = require('express-validator');

var controller = require('./post.controller');
var router = express.Router();

router
  .route('/')
  .get(controller.getManyPost)
  .post(
    [
      body('title').trim().isLength({ min: 5 }),
      body('content').trim().isLength({ min: 5 })
    ],
    controller.createOnePost
  );

router
  .route('/:id')
  .get(controller.getOnePost)
  .post((req, res, next) => req.status(403).end())
  .put(
    [
      body('title').trim().isLength({ min: 5 }),
      body('content').trim().isLength({ min: 5 })
    ],
    controller.updateOnePost
  )
  .delete(controller.deleteOnePost);

module.exports = router;
