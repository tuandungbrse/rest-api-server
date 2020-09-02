var path = require('path');
var fs = require('fs');
var fileUpload = require('../../utils/file.upload');
var { validationResult } = require('express-validator');
var Post = require('./post.model');

exports.getOnePost = async function getOnePost(req, res, next) {
  try {
    const id = req.params.id;
    var post = await Post.findById(id);
    if (!post) {
      var error = new Error('Could not find post!');
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ data: post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getManyPost = async function getManyPost(req, res, next) {
  try {
    var posts = await Post.find({});
    if (!posts) {
      var error = new Error('Could not fetch posts!');
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({ data: posts });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createOnePost = async function createOnePost(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      const error = new Error('Validation failed, entered data is incorrect!');
      error.statusCode = 422;
      throw error;
    }
    if (!req.file) {
      var error = new Error('No image provied!');
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const photo = req.file.filename;

    const post = await Post.create({
      title,
      photo,
      content,
      createdBy: { name: ' Tuan Dung' }
    });

    res.status(201).json({
      message: 'Post created successfully!',
      post
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateOnePost = async function updateOnePost(req, res, next) {
  try {
    const id = req.params.id;
    const title = req.body.title;
    const content = req.body.content;
    let photo = req.body.image;
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      const error = new Error('Validation failed, entered data is incorrect!');
      error.statusCode = 422;
      throw error;
    }
    if (req.file) {
      photo = req.file.filename;
    }
    if (!photo) {
      var error = new Error('No file!');
      error.statusCode = 422;
      throw error;
    }
    var post = await Post.findById(id);
    if (post.photo !== photo) {
      fileUpload.deletePhoto(post.photo);
    }
    if (!post) {
      var error = new Error('Could not find post!');
      error.statusCode = 422;
      throw error;
    }
    post.title = title;
    post.photo = photo;
    post.content = content;
    var result = await post.save();
    res.status(200).json({ data: result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteOnePost = async function deleteOnePost(req, res, next) {
  try {
    const id = req.params.id;
    var post = await Post.findById(id);
    if (!post) {
      var error = new Error('Could not find post!');
      error.statusCode = 422;
      throw error;
    }
    fileUpload.deletePhoto(post.photo);
    var result = await Post.findByIdAndDelete(id);
    res.status(200).json({ data: result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
