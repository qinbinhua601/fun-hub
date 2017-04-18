var qs = require("qs");
var Video = require("../../models/video");
var request = require("superagent");
var cheerio = require("cheerio");

const requestUrls = [
  "http://api.bilibili.com/x/tag/ranking/archives",
  "http://api.bilibili.com/archive_rank/getarchiverankbypartion",
  "http://www.fixsub.com/wp-admin/admin-ajax.php"
];

let getQueryParams = (id, cate) => {
  const queryParams = [
    {
      jsonp: "jsonp",
      tag_id: "5608",
      rid: "15",
      ps: "20",
      pn: id,
      callback: "jQuery1720759488614610792_1492071066822",
      _: "1492071067856"
    },
    {
      type: "jsonp",
      tid: "32",
      pn: id,
      callback: "jQuery1720759488614610792_1492071066822",
      _: "1492441646955"
    },
    qs.stringify(
      {
        page: id,
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
  ];
  return queryParams[cate];
};

let jQuery1720759488614610792_1492071066822 = data => {
  return data;
};

let getCreate = (url, data) => {
  request.get(url).end((err, req) => {
    let $ = cheerio.load(req.text);
    let time = $("#content-container .content-box .pl").eq(0).parent().text();
    time = time.split("\n");
    time = time.filter(item => {
      return /\d{4}-\d{2}-\d{2}/.test(item);
    });
    time = time.pop();
    data.created = new Date(time) != "Invalid Date"
      ? new Date(time)
      : new Date();
    data.updated = new Date(time) != "Invalid Date"
      ? new Date(time)
      : new Date();
    console.log(data);

    new Video(data).save(error => {
      if (error) {
        console.log(error);
      }
    });
  });
};

module.exports = {
  getQueryParams,
  jQuery1720759488614610792_1492071066822,
  requestUrls,
  getCreate
};
