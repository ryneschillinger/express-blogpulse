var express = require('express');
var db = require('../models');
var router = express.Router();


// GET - display individual comments
router.get('/:id', function(req, res) {
  db.comment.find({
    where: { id: req.params.id },
    include: [db.post]
  })
  .then(function(comment) {
    if (!comment) throw Error();
    res.render('comments/show', { comment: comment });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});


module.exports = router;
