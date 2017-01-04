var express = require('express');
var db = require('../models');
var router = express.Router();

// Find all tags
router.get('/', function(req, res) {
	db.tag.findAll().then(function(tags) {
		res.render('tags/all', {tags: tags});
	});
});

router.get('/:id', function(req, res) {
	db.tag.find({
		where: {id: req.params.id},
		include: [db.post]
	}).then(function(tag) {
		res.render('tags/show', {tag: tag});
	});
});

module.exports = router;