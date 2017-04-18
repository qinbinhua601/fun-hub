"use strict";
var express = require("express");
var router = express.Router();
var Index = require("../models/index");
var Video = require("../models/video");
var request = require("superagent");
var cheerio = require("cheerio");

var {
  getQueryParams,
  jQuery1720759488614610792_1492071066822,
  requestUrls,
  getCreate
} = require("../src/util/");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

router.get("/index/:id", function(req, res) {
  Video.find({})
    .where("page", +req.params.id)
    .where("cate", +req.query.cate)
    .exec(function(err, data) {
      if (data.length) {
        console.log("found");
        res.send(data);
      } else {
        console.log("not found");
        request
          .get(requestUrls[req.query.cate])
          .query(getQueryParams(+req.params.id, req.query.cate))
          .end((response, q) => {
            let result = [];
            if (+req.query.cate === 2) {
              let $ = cheerio.load(JSON.parse(q.text).items);
              result = [];
              $(".pg-item").each((index, item) => {
                let $node = $(item);
                let img = $node.find(".pg-img-wrapper img").attr("src");
                let title = $node.find(" > a").attr("title");
                let id = $node.data("itemid");
                let desc = $node.find("span.pg-categories").text();


                getCreate(
                  "http://www.fixsub.com/portfolio/" + encodeURIComponent(title),
                  {
                    aid: id,
                    title: title,
                    img: img,
                    desc: desc,
                    page: +req.params.id,
                    cate: +req.query.cate
                  }
                );

                result.push({
                  aid: id,
                  title: title,
                  img: img,
                  desc: desc,
                  page: +req.params.id,
                  cate: +req.query.cate,
                  created: Date.now(),
                  updated: Date.now()
                });
              });
              res.json(result);
            } else {
              let data = eval(response.rawResponse).data;
              result = [];
              result = data.archives.map(function(item) {
                return {
                  aid: item.aid,
                  title: item.title,
                  img: item.pic,
                  desc: item.desc,
                  page: +req.params.id,
                  cate: +req.query.cate,
                  created: new Date(
                    item.ctime ? item.ctime * 1000 : item.create
                  ),
                  updated: new Date(
                    item.pubdate ? item.pubdate * 1000 : item.create
                  )
                };
              });
              Video.insertMany(result, (err) => {
                console.log(err)
                res.json(result);
              });
            }
          });
      }
    });
});

module.exports = router;
