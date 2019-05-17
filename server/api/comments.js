let express = require('express');
let router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');
const User = require('../models/User');


router.get('/', async (req, res) => {

  let postId = req.query.postId ? req.query.postId.trim() : '';
  if(! postId) {
    res.status(400).send('comments  retriev error');
  }

  let ancestorId = req.query.ancestorId || undefined;

  let limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  limit = isNaN(limit) ? 10 : limit;

  let offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
  offset = isNaN(offset) ? 0 : offset;

  let sort;

  if (!req.query.sort) {
    if (ancestorId) {
      sort = { createdAt: 1 };
    }
  }

  let commentsList = [];
  let commentsQuantity = 0;
  try {
    ({comments: commentsList, commentsQuantity } = await Comment.list(postId, offset, limit, ancestorId, sort));
  } catch (err) {
    console.log(err);
    res.status(400).send('comments  retriev error');
    return;
  }

  const commentsIds = commentsList.map((comment) => {
    return comment.id;
  });


  let votes = new Map();
  if (req.user && req.user.id) {
    try {
      votes = await Vote.getVotesByElementsIds('Comment', req.user.id, commentsIds)
    } catch (err) {
      console.log(err);
      votes = new Map();
    }
  }

  

  commentsList = commentsList.map((comment) => {
    comment = comment.toObject({ virtuals: true });
    comment.votes = Object.assign({}, comment.votes, { userVoteType: votes.get(comment.id) });
    return comment;
  });

  const userIdList = commentsList.map((comment) => {
    return comment.authorId.toString();
  });

  const authors = await User.getUsersByIds(userIdList);


  res.send({
    commentsList: {
      comments: commentsList,
      authors
    },
    
    commentsQuantity
  });
});


router.post('/', async (req, res) => {
  if (!req.body.postId) {
    res.status(400).send('expected postId ,voteType params');
  }

  if (!req.user || !req.user.id) {
    res.status(400).send('unauthorized user');
  }

  let post = await Post.findById(req.body.postId);


  if (!post) {
    res.status(404).send('post not  found');
  } else {

    let comment;
    try {
      comment = await Comment.add({
        postId: req.body.postId,
        text: req.body.text,
        authorId: req.user.id,
        parentId: req.body.parentId || null,
        ancestorId: req.body.ancestorId || null
      });      

    } catch (err) {
      comment = null;
      console.log(err);
    }

    if (!comment) {
      res.status(400).send('incorrect comment params');
      return;
    }

    res.send({
      status: true,
      comment,
      author: {
        id: req.user.id,
        displayName: req.user.displayName,
        avatarUrl: req.user.avatarUrl
      }
    });

  }

});


module.exports = router;