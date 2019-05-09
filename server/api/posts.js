let express = require('express');
let router = express.Router();
let Post = require('../models/Post');
let Vote = require('../models/Vote');

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

  try {
    vote = await Vote.findOne({
      moduleName: 'Post',
      elementId: req.params.id,
      authorId: 1
    });
    if(vote){
      vote = vote.toObject({ virtuals: true })
      post.votes = Object.assign({}, post.votes, { userVoteType: vote.voteType });
    }

  } catch (err) {
    console.log(err);
  }


  res.send({ post });
});


router.get('/', async (req, res) => {
  console.log(req.session.foo);
  try {
    let posts = await Post.list();
    
    const postIds = posts.map((post) => {
      return post.id;
    });

    let votes;
    try{
      votes = await Vote.getVotesByElementsIds('Post', 1, postIds)
    } catch (err){
      console.log(err);
      votes = new Map();
    }

           
    
    posts = posts.map((post) => {
      post = post.toObject({virtuals: true});
      post.votes =  Object.assign({}, post.votes, { userVoteType: votes.get(post.id) });
      return post;
    });
    

    res.json({posts});
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;