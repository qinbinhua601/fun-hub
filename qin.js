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

function convertNumber(input) {
  let n;
  if (input.indexOf('万') !== -1) {
    n = Number(input.replace(/万/g, '')) * 10000
  } else if (input.indexOf('亿') !== -1) {
    n = Number(input.replace(/亿/g, '')) * 100000000
  } else {
    n = Number(input.replace(/,/g, ''))
  }
  return n;
}

function getData() {
  request
    .get("http://list.youku.com/category/show/c_100_r_2017_u_2_s_1_d_1_p_1.html")
    .query({
      spm: 'a2h1n.8251845.0.0'
    })
    .end((err, res) => {
      let data = res.text;
      let $ = cheerio.load(data);
      $(".box-series li.yk-col4").each((index, item) => {
        let title = $(item).find('ul.info-list li.title a').text();
        let link = $(item).find('ul.info-list li.title a').attr('href');
        let img = $(item).find('img.quic').attr('_src');
        let desc = $(item).find('ul.info-list li.actor').text();
        let aid = link.match(/id_(.*).html/)[1];
        let len = $(item).find('ul.info-list li').length;
        let view = $(item).find('ul.info-list li').eq(len - 1).text().match(/(.*)次播放/)[1];
        view = convertNumber(view);
        console.log([title, img, link, desc, aid, view]);
      });
    });
}
getData();
