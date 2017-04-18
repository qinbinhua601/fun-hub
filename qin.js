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
    .get("http://www.fixsub.com/wp-admin/admin-ajax.php")
    .set("Accept", "application/json")
    .query(
      qs.stringify(
        {
          page: 1,
          number: 8,
          imgheight: 240,
          columns: 4,
          page_url: "http://www.fixsub.com/%e6%88%91%e4%bb%ac%e7%9a%84%e4%bd%9c%e5%93%81",
          require_nav: false,
          orderby: "menu_order",
          order: "ASC",
          action: "pexeto_get_portfolio_items"
        },
        { arrayFormat: "brackets" }
      )
    )
    .end((err, res) => {
      let data = JSON.parse(res.text).items;
      let $ = cheerio.load(data);
      $(".pg-item").each((index, item) => {
        let $node = $(item);
        let img = $node.find(".pg-img-wrapper img").attr("src");
        let title = $node.find(" > a").attr("title");
        let id = $node.data("itemid");
        let desc = $node.find("span.pg-categories").text();
        getCreate(
          "http://www.fixsub.com/portfolio/" + encodeURIComponent(title),
          (time) => {
            console.log([img, title, id, desc, time]);
          }
        );
      });
    });
}
getData();
