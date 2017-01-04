var express = require('express');
var db = require('../models');
var async = require('async');
var router = express.Router();


// POST /posts - create a new post
router.post('/', function(req, res) {
  console.log("req.body is ", req.body);

  // Make a comma-separated list of tags into an array
  var tags = [];
  if(req.body.tags){
    tags = req.body.tags.split(",");
  }
  console.log("tags array", tags);

  // If there's no title or it's too short, send error
  if(!req.body.title || req.body.title.length < 2) {
    res.send("Error: Please include a title containing at least 3 letters")
  }

  if(!req.body.content) {
    res.send("Error: Please include a valid content section")
  }

  db.post.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  // Adding the tags
  .then(function(post) {
    if(tags.length > 0) {
      // This requires npm install --save async plus requiring dependency
      async.forEachSeries(tags, function(tag, callback) {
        db.tag.findOrCreate({
          where: {name:tag}
        })
        .spread(function(newTag, wasCreated){
          if(newTag){
            // Add the relationship in the third table, post_tag
            post.addTag(newTag); 
            // addTag ("Tag" being table name) is a sequelize helper function. If your table was called "Hastags", it would be addHashtags
          }
          callback(null);
        });
      }, function() {
        // This runs when everything is done
        res.redirect('/posts/' + post.id);
      }); // end of forEach
    } // end of if statement
    else {
      res.redirect('/posts/' + post.id);
    }
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});


// GET /posts/new - display form for creating new posts
router.get('/new', function(req, res) {
  db.author.findAll()
  .then(function(authors) {
    res.render('posts/new', { authors: authors });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});


// GET /posts/:id - display a specific post and its author
router.get('/:id', function(req, res) {
  db.post.find({
    where: { id: req.params.id },
    include: [db.author, db.comment, db.tag]
  })
  .then(function(post) {
    if (!post) throw Error();
    res.render('posts/show', { post: post });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

router.post('/:id/comments', function(req, res) {
  db.comment.create({
    name: req.body.name || 'Anonymous',
    comment: req.body.comment,
    postId: req.params.id
  })
  .then(function(author) {
    res.redirect('/posts/' + req.params.id);
  })
});



module.exports = router;
