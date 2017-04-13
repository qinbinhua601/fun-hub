"use strict";
var express = require('express');
var router = express.Router();
var Index = require('../models/index');
var request = require('superagent');
// var jsonp = require('superagent-jsonp');

function getTvResources(url) {
}

function jQuery1720759488614610792_1492071066822(data) {
  return data;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'index page' });
});

router.get('/:id', function (req, res) {
  request
    .get('http://api.bilibili.com/x/tag/ranking/archives')
    .query({
      jsonp: 'jsonp',
      tag_id: '5608',
      rid: '15',
      ps: '20',
      pn: req.params.id,
      callback: 'jQuery1720759488614610792_1492071066822',
      _: '1492071067856'
    })
    // .use(jsonp)
    .end((response) => {
      response = response.rawResponse;
      let data = eval(response).data;
      res.json(data);
    });
});

module.exports = router;
