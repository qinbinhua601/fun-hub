"use strict";
var express = require('express');
var router = express.Router();
var Index = require('../models/index');
var Video = require('../models/video');
var request = require('superagent');

var requestUrls = [
  'http://api.bilibili.com/x/tag/ranking/archives',
  'http://api.bilibili.com/archive_rank/getarchiverankbypartion'
]

function getQueryParams(id, cate) {
  const queryParams = [
    {
      jsonp: 'jsonp',
      tag_id: '5608',
      rid: '15',
      ps: '20',
      pn: id,
      callback: 'jQuery1720759488614610792_1492071066822',
      _: '1492071067856'
    },
    {
      type: 'jsonp',
      tid: '32',
      pn: id,
      callback: 'jQuery1720759488614610792_1492071066822',
      _: '1492441646955'
    }
  ]
  return queryParams[cate]
}

function getTvResources(url) {
}

function jQuery1720759488614610792_1492071066822(data) {
  return data;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/index/:id', function (req, res) {
  Video
    .find({})
    .where('page', +req.params.id)
    .where('cate', +req.query.cate)
    .exec(function(err, data) {
      if (data.length) {
        console.log('found');
        res.send(data);
      } else {
        console.log('not found');
        request
          .get(requestUrls[req.query.cate])
          .query(getQueryParams(+req.params.id, req.query.cate))
          .end((response) => {
            response = response.rawResponse;
            let data = eval(response).data;
            // res.json(data);
            let result = [];
            result = data.archives.map(function(item) {
              return {
                aid: item.aid,
                title: item.title,
                img: item.pic,
                desc: item.desc,
                page: +req.params.id,
                cate: +req.query.cate
              };
            });

            Video.insertMany(result, (err, docs) => {
              res.json(result)
            });
          });
      }
    })
});

module.exports = router;
