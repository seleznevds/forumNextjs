const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');

router.post('/', async (req, res) => {
  if (!req.user || !req.user.id) {
    res.status(400).send('unauthorized user');
  }
  
  if (!req.body.elementId || !(req.body.voteType || req.body.removeVoteType)) {
    res.status(400).send('invalid params1');
    return;
  }

  if (req.body.voteType &&
    (req.body.voteType !== 'like' && req.body.voteType !== 'dislike')) {
    res.status(400).send('invalid params2');
    return;
  }

  if (req.body.removeVoteType &&
    (req.body.removeVoteType !== 'like' && req.body.removeVoteType !== 'dislike')) {
    res.status(400).send('invalid params2');
    return;
  }

  if (!req.body.moduleName || !['Post', 'Comment'].includes(req.body.moduleName)) {
    res.status(400).send('invalid params4   undefined  module');
    return;
  }

  const Model = (() => {
    switch (req.body.moduleName) {
      case 'Post':
        return Post;
      case 'Comment':
        return Comment;
      default:
        return null;
    }
  })();

  if (!Model) {
    res.status(400).send('invalid params5   undefined  module');
    return;
  }
  let element;

  try {
    element = await Model.findById(req.body.elementId);
  } catch (err) {
    res.status(400).send('invalid params3');
    return;
  }

  let votes = Object.assign({
    likes: 0,
    dislikes: 0
  }, element.votes);

  let promises = [];
  if (req.body.removeVoteType) {

    promises.push(Vote.removeVote(req.body.moduleName, req.body.elementId, req.user.id, req.body.removeVoteType));

    if (req.body.removeVoteType === 'like') {
      votes.likes = votes.likes > 0 ? votes.likes - 1 : 0;
    } else {
      votes.dislikes = votes.dislikes > 0 ? votes.dislikes - 1 : 0;
    }
  }


  if (req.body.voteType) {
    promises.push(Vote.add(req.body.moduleName, req.body.elementId, req.user.id, req.body.voteType));

    if (req.body.voteType === 'like') {
      votes.likes = votes.likes + 1;
    } else {
      votes.dislikes = votes.dislikes + 1;
    }
  }


  promises.push(Model.updateOne({ _id: req.body.elementId }, { votes }));

  Promise.all(promises).then(() => {
    res.send({
      status: true
    }
    );
  }).catch((err) => {
    res.send({
      status: false
    }
    );
  });

});


module.exports = router;