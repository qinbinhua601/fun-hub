var qs = require("qs");
var Video = require("../../models/video");
var request = require("superagent");
var cheerio = require("cheerio");

const requestUrls = [
  "http://api.bilibili.com/x/tag/ranking/archives", // B站 电视剧
  "http://api.bilibili.com/archive_rank/getarchiverankbypartion", // B站 完结动画
  "http://www.fixsub.com/wp-admin/admin-ajax.php", // fixsub字幕组
  "http://v.qq.com/x/list/tv" // 腾讯视频
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
    ),
    {
      iyear: 2017,
      iarea: -1,
      offset: (id - 1) * 30
    }
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

let getResultDataFromQQ = ($, req) => {
  let result = [];
  $("li.list_item").each((index, item) => {
    let url = $(item).find(".figure_title_score a").attr("href");
    let title = $(item).find(".figure_title_score a").attr("title");
    let img = $(item).find('> a > img').attr('r-lazyload');
    let desc = $(item)
      .find(".figure_desc")
      .text()
      .replace(/\t/g, "")
      .replace(/\n{2,3}/g, "\n")
      .split("\n")
      .join(" ")
      .trim();
    let aid = url.match(/https:\/\/v.qq.com\/x\/cover\/(\w+).html/)[1];
    console.log([title, img, url, desc, aid]);
    result.push({
      aid: aid,
      title: title,
      img: img,
      desc: desc,
      page: +req.params.id,
      cate: +req.query.cate,
      created: Date.now(),
      updated: Date.now(),
      url: url
    });
  });
  return result;
};

let getResultDataFromFixsub = ($, req) => {
  let result = [];
  $(".pg-item").each((index, item) => {
    let $node = $(item);
    let img = $node.find(".pg-img-wrapper img").attr("src");
    let title = $node.find(" > a").attr("title");
    let url = $node.find(" > a").attr("href");
    let id = $node.data("itemid");
    let desc = $node.find("span.pg-categories").text();

    getCreate("http://www.fixsub.com/portfolio/" + encodeURIComponent(title), {
      aid: id,
      title: title,
      img: img,
      desc: desc,
      page: +req.params.id,
      cate: +req.query.cate,
      url: url
    });

    result.push({
      aid: id,
      title: title,
      img: img,
      desc: desc,
      page: +req.params.id,
      cate: +req.query.cate,
      created: Date.now(),
      updated: Date.now(),
      url: url
    });
  });
  return result;
};

module.exports = {
  getQueryParams,
  jQuery1720759488614610792_1492071066822,
  requestUrls,
  getCreate,
  getResultDataFromFixsub,
  getResultDataFromQQ
};
