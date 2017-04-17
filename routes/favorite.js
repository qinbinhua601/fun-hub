var express = require('express');
var router = express.Router();
var Video = require('../models/video');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('favorite');
});

router.get('/list', function(req, res, next) {
  let { query } = req;
  console.log(query)
  Video
    .find({
      aid: {
        $in: req.query.favoriteList
      }
    })
    .exec(function(err, data) {
      res.json(data);
    });
});

module.exports = router;
