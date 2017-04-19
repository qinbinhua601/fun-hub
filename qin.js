"use strict";
var request = require("superagent");
var cheerio = require("cheerio");
var qs = require("qs");

function getCreate(url, cb) {
  request.get(url).end((err, req) => {
    let $ = cheerio.load(req.text);
    let time = $("#content-container .content-box .pl").eq(0).parent().text();
    time = time.split("\n");
    time = time.filter(item => {
      return /\d{4}-\d{2}-\d{2}/.test(item);
    });
    time = time.pop();
    cb && cb(time);
  });
}

function getData() {
  request
    .get("http://v.qq.com/x/list/tv")
    .query({
      iyear: 2017,
      iarea: -1,
      offset: 0
    })
    .end((err, res) => {
      let data = res.text;
      let $ = cheerio.load(data);
      $("li.list_item").each((index, item) => {
        let link = $(item).find('.figure_title_score a').attr('href');
        let title = $(item).find('.figure_title_score a').attr('title');
        let img = $(item).find('> a > img').attr('r-lazyload');
        let desc = $(item).find('.figure_desc').text().replace(/\t/g, '').replace(/\n{2,3}/g, '\n').split('\n').join(' ').trim();
        let aid = link.match(/https:\/\/v.qq.com\/x\/cover\/(\w+).html/)[1];
        console.log([title, img, link, desc, aid])
      });
    });
}
getData();
