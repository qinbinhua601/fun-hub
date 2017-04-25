var qs = require("qs");
var Video = require("../../models/video");
var request = require("superagent");
var cheerio = require("cheerio");

const requestUrls = [
  "http://api.bilibili.com/x/tag/ranking/archives", // B站 电视剧
  "http://api.bilibili.com/archive_rank/getarchiverankbypartion", // B站 完结动画
  "http://www.fixsub.com/wp-admin/admin-ajax.php", // fixsub字幕组
  "http://v.qq.com/x/list/tv", // 腾讯视频
  "http://m.bilibili.com/rank/all-3-0.json", // B站 推荐
  "http://list.youku.com/category/show/c_100_r_2017_u_2_s_1_d_1_p_1.html" // 优酷动漫2017，更新中
];

let getRequestUrls = (cate, page) => {
  if (cate === 5) {
    return `http://list.youku.com/category/show/c_100_r_2017_u_2_s_1_d_1_p_${page}.html`
  }
    return requestUrls[cate]
}

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
    },
    {},
    {
      spm: 'a2h1n.8251845.0.0'
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
    let view = $(item).find('.figure_count span.num').text().replace('万', '0000').replace('亿', '00000000');
    let desc = $(item)
      .find(".figure_desc")
      .text()
      .replace(/\t/g, "")
      .replace(/\n{2,3}/g, "\n")
      .split("\n")
      .join(" ")
      .trim();
    let aid = url.match(/https:\/\/v.qq.com\/x\/cover\/(\w+).html/)[1];
    result.push({
      aid: aid,
      title: title,
      img: img,
      desc: desc,
      page: +req.params.id,
      cate: +req.query.cate,
      created: Date.now(),
      updated: Date.now(),
      url: url,
      view: +view
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
      url: url,
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
      url: url,
      view: 0
    });
  });
  return result;
};

let getResultDataFromRec = (data, req) => {
  let result = [];
  data = JSON.parse(data);
  for(let item of data.rank.list) {
    result.push({
      aid: item.aid,
      title: item.title,
      img: item.pic,
      desc: '',
      page: +req.params.id,
      cate: +req.query.cate,
      created: Date.now(),
      updated: Date.now(),
      url: `http://www.bilibili.com/video/av${item.aid}`,
      view: item.video_review
    });
  }
  return result;
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

let getResultDataFromYouku = ($, req) => {
  let result = [];
  $(".box-series li.yk-col4").each((index, item) => {
    let title = $(item).find('ul.info-list li.title a').text();
    let link = $(item).find('ul.info-list li.title a').attr('href');
    let img = $(item).find('img.quic').attr('_src');
    let desc = $(item).find('ul.info-list li.actor').text();
    let aid = link.match(/id_(.*).html/)[1];
    let len = $(item).find('ul.info-list li').length;
    let view = $(item).find('ul.info-list li').eq(len - 1).text().match(/(.*)次播放/)[1];
    view = convertNumber(view);
    result.push({
      aid: aid,
      title: title,
      img: img,
      desc: desc,
      page: +req.params.id,
      cate: +req.query.cate,
      created: Date.now(),
      updated: Date.now(),
      url: link,
      view: +view
    });
  });
  return result;
}
module.exports = {
  getQueryParams,
  jQuery1720759488614610792_1492071066822,
  // requestUrls,
  getCreate,
  getResultDataFromFixsub,
  getResultDataFromQQ,
  getResultDataFromRec,
  getRequestUrls,
  getResultDataFromYouku
};
