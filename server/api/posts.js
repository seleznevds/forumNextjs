let express = require('express');
let router = express.Router();
let Post = require('../models/Post');
let Vote = require('../models/Vote');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const path = require('path');
const escape =  require('escape-html');
const fs = require('fs')
const config = require('../config.js');



let checkAuthMiddleware = (req, res, next) => {
  if (!req.user || !req.user.id) {
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized user.'
    });
    return;
  }

  next();
};

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(config.staticFolder, '/images/posts'));
  },
  filename: function (req, file, cb) {
    let extension = file.originalname.match(/\.[a-z]{1,4}$/i);
    cb(null, `${uuidv4()}${extension && extension.length ? extension[0] : ''}`);

  }
});


let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/pjpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(new Error('Wrong mime type'), false);
      return;
    }
    cb(null, true);
  },
  limits: {
    fields: 10,
    fileSize: 1024 * 512, // max filesize  in bytes
    fieldSize: 1024 * 512,
  }
}).single('image');

let createPostErrorMiddleware = (err, req, res, next) => {
  if (err) {
    console.log('post /create error');
    res.status(404).json({
      status: 'error',
      message: 'Некорректный файл. Используйте  изображения  в формате webp, png или  jpg, размером не более  512 kb'
    });

    return;
  }

  next();
}


router.post('/create', checkAuthMiddleware, upload, createPostErrorMiddleware, async (req, res) => {
  let title = req.body && req.body.title ? req.body.title.trim() : '';
  let content = req.body && req.body.content ? req.body.content.trim() : '';

  if (!title || !content) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {

      });
    }

    res.status(404).json({
      status: 'error',
      message: 'Необходимо  заполнить  обязательные поля'
    });

    return;
  }

  try {
    let post = await Post.add({
      title,
      preview: req.body.preview || '',
      text: req.body.content,
      image: req.file && req.file.filename ? `/images/posts/${req.file.filename}` : '',
      userId: req.user.id
    });

    if (post) {
      res.status(200).json({
        status: 'success',
        message: 'Пост  добавлен!',
        postId: post.id
      });
    }
  } catch (err) {
    console.log(err);
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => { });
    }

    res.status(404).json({
      status: 'error',
      message: 'Неизвестная  ошибка. Попробуйте повторить  через некоторое время.'
    });
  }
});


router.post('/edit', checkAuthMiddleware, upload, createPostErrorMiddleware, async (req, res) => {
  let title = req.body && req.body.title ? req.body.title.trim() : '';
  let content = req.body && req.body.content ? req.body.content.trim() : '';
  let id = req.body && req.body.id;

  if (!id || !title || !content) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {

      });
    }

    res.status(404).json({
      status: 'error',
      message: 'Необходимо  заполнить  обязательные поля.'
    });

    return;
  }

  let post;
  try {
    post = await Post.findOne({ _id: id, userId: req.user.id });
    if (!post) {
      res.status(400).json({ status: 'error', message: 'Пост не найден, либо  доступ запрещен' });
      return;
    }

    post = post.toObject();
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'Неизвестная ошибка. Попробуйте  поторить через некоторое время' });
    return;
  }

  const modifier = {
    title : escape(title),
    text: escape(content),
    preview: req.body.preview ? escape(req.body.preview.trim()) : ''
  };
  
  if (req.file && req.file.filename) {
    modifier.image = `/images/posts/${req.file.filename}`;
  }

  try {
    let updated = await Post.updateOne({ _id: id }, { $set: modifier });
    if (post.image && req.file && req.file.path) {  // если  все ок, то удаляем старое изображение
           
      fs.unlink(path.join(config.staticFolder,  post.image), () => {

      });  
    }
    
    res.status(200).json({ status: 'success', message: 'Пост обновлен!',
     image: req.file &&  req.file.filename?  `/images/posts/${req.file.filename}`: null });
    return;    
  } catch (err) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {//если не обновили, то удаляем новое  загруженное изображение

      });
      res.status(400).json({ status: 'error', message: 'Неизвестная ошибка. Попробуйте  поторить через некоторое время' });
      return;
    }
  }
});


router.get('/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: 'error', message: 'Идентификатор поста не указан' });
  }

  let post, vote;
  try {
    post = await Post.findById(req.params.id);
    if (!post) {
      res.status(400).json({ status: 'error', message: 'Пост не найден' });
    }
    post = post.toObject();
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'Пост не найден' });
    return;
  }

  if (req.user && req.user.id) {
    try {
      vote = await Vote.findOne({
        moduleName: 'Post',
        elementId: req.params.id,
        authorId: req.user.id
      });
      if (vote) {
        vote = vote.toObject()
        post.votes = Object.assign({}, post.votes, { userVoteType: vote.voteType });
      }

    } catch (err) {
      console.log(err);
    }
  }

  res.send({ post });
});


router.get('/ifauthor/:id', checkAuthMiddleware, async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ status: 'error', message: 'Идентификатор поста не указан' });
    return;
  }

  try {
    let post = await Post.findOne({ _id: req.params.id, userId: req.user.id });
    if (post) {
      res.send({ post: post.toObject() });
    } else {
      res.status(400).json({ status: 'error', message: 'Пост не найден' });
    }

  } catch (err) {
    res.status(400).json({ status: 'error', message: 'Пост не найден' });
    return;
  }
});


router.get('/', async (req, res) => {

  let limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  limit = isNaN(limit) ? 10 : limit;

  let offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
  offset = isNaN(offset) ? 0 : offset;


  try {
    let {posts, postsQuantity} = await Post.list({offset, limit});
    
    const postIds = posts.map((post) => {
      return post.id;
    });

    let votes = new Map();
    if (req.user && req.user.id) {
      console.log('post user', req.user )
      try {
        votes = await Vote.getVotesByElementsIds('Post', req.user.id, postIds)
      } catch (err) {
        console.log(err);
        votes = new Map();
      }
    }

    posts = posts.map((post) => {
      post = post.toObject();
      console.log('votes by post', votes.get(post.id), post.id);
      post.votes = Object.assign({}, post.votes, { userVoteType: votes.get(post.id) });
      return post;
    });


    res.json({ posts, postsQuantity });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;