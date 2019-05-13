let express = require('express');
let router = express.Router();
let Post = require('../models/Post');
let Vote = require('../models/Vote');
const uuidv4 = require('uuid/v4');


const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/static/images/posts')
  },
  filename: function (req, file, cb) {
    let extension = file.originalname.match(/\.[a-z]{1,4}$/i);
    cb(null, `${uuidv4()}${extension.length ? extension[0] : ''}`);
  }
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if(! req.user || ! req.user.id){
      cb(null, false);
      return;
    }

    if(! ['image/jpeg', 'image/pjpeg', 'image/png'].includes(file.mimetype)){
      console.log('Wrong  mimetype for Post image!');
      cb(new Error('Wrong  mimetype for Post image!'));
      return;
    }

    cb(null, true);   
  },
  limits: {
    fields: 10,
    fileSize: 1024 * 512, // max filesize  in bytes
    fieldSize: 1024 * 512, // max filesize  in bytes
  }
});

router.get('/create', async (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
    }

    // Everything went fine.
  })


});


router.get('/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400);
    res.send('id param is expected');
  }

  let post, vote;
  try {
    post = await Post.findById(req.params.id);
    post = post.toObject({ virtuals: true });
  } catch (err) {
    res.status(404).send('post not  found');
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
        vote = vote.toObject({ virtuals: true })
        post.votes = Object.assign({}, post.votes, { userVoteType: vote.voteType });
      }

    } catch (err) {
      console.log(err);
    }
  }

  res.send({ post });
});


router.get('/', async (req, res) => {

  try {
    let posts = await Post.list();

    const postIds = posts.map((post) => {
      return post.id;
    });

    let votes = new Map();
    if (req.user && req.user.id) {
      try {
        votes = await Vote.getVotesByElementsIds('Post', req.user.id, postIds)
      } catch (err) {
        console.log(err);
        votes = new Map();
      }
    }


    posts = posts.map((post) => {
      post = post.toObject({ virtuals: true });
      post.votes = Object.assign({}, post.votes, { userVoteType: votes.get(post.id) });
      return post;
    });


    res.json({ posts });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;