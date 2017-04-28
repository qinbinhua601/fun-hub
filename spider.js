var qs = require("qs");
var Video = require("./models/video");
var request = require("superagent");
var cheerio = require("cheerio");
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/fun-hub');

const argv = process.argv.slice(2)
if (!argv.length) {
  console.log(`you should put your cate id`)
  process.exit()
}

var {
  getQueryParams,
  jQuery1720759488614610792_1492071066822,
  getCreate,
  getResultDataFromFixsub,
  getResultDataFromQQ,
  getResultDataFromRec,
  getRequestUrls,
  getResultDataFromYouku
} = require("./src/util/");

var cate = argv[0];
var currentPage = 1;
var maxPage = 1;
var stack = [];
var finishedStack = [];
var timer = null;

function getData() {
  if(!stack.length) {
    console.log(`already end of the task list`)
    return
  }
  let [page, cate] = stack.pop();
  let req = {
    params: {
      id: page
    },
    query: {
      cate: cate
    }
  }
  request
    .get(getRequestUrls(+cate, +page))
    .query(getQueryParams(+page, cate))
    .end((response, q) => {
      let result = [];
      if (+cate === 5) {
        let $ = cheerio.load(q.text);
        let totalCount = +$('#total_videonum').text();
        (page === 1) && (maxPage = Math.ceil(totalCount / 30));
        result = getResultDataFromYouku($, req)
        Video.insertMany(result, (err) => {
          console.log(`page ${page} / ${maxPage} is done`)
          finishedStack.push(page)
          if (err) {
            console.log(`error at page ${page}`);
          }
        });
      } else if (+cate === 4) {
        maxPage = 1;
        if (+page > 1) {
          // res.json([])
        } else {
          result = getResultDataFromRec(q.text, req);
          Video.insertMany(result, (err) => {
            console.log(`page ${page} / ${maxPage} is done`)
            finishedStack.push(page)
            if (err) {
              console.log(`error at page ${page}`);
            }
          });
        }
      } else if (+cate === 3) {
        let $ = cheerio.load(q.text);
        maxPage = +$('.filter_option .option_txt').eq(-1).text().split('/')[1];
        result = getResultDataFromQQ($, req);
        Video.insertMany(result, (err) => {
          console.log(`page ${page} / ${maxPage} is done`)
          finishedStack.push(page)
          if (err) {
            console.log(`error at page ${page}`);
          }
        });
      } else if (+cate === 2) {
        let $ = cheerio.load(JSON.parse(q.text).items);
        result = getResultDataFromFixsub($, req);
        console.log(`page ${page} is done`)
        // console.log(result);
      } else {
        let data = eval(response.rawResponse).data;
        (page === 1) && (maxPage = Math.ceil(data.page.count / data.page.size));
        result = [];
        result = data.archives.map(function (item) {
          return {
            aid: item.aid,
            title: item.title,
            img: item.pic,
            desc: item.desc,
            page: +page,
            cate: +cate,
            created: new Date(
              item.ctime ? item.ctime * 1000 : item.create
            ),
            updated: new Date(
              item.pubdate ? item.pubdate * 1000 : item.create
            ),
            url: `http://www.bilibili.com/video/av${item.aid}`,
            view: isNaN(item.stat.view) ? 0 : item.stat.view
          };
        });
        Video.insertMany(result, (err) => {
          console.log(`page ${page} / ${maxPage} is done`)
          finishedStack.push(page)
          if (err) {
            console.log(`error at page ${page}`);
          }
        });
      }
    });
}

Video.remove({cate}, function(err) {
  console.log(new Date())
  timer = setInterval(() => {
      if(finishedStack.length >= maxPage) {
        clearInterval(timer)
        console.log(new Date())
        process.exit()
        return
      }
      stack.push([currentPage, cate]);
      currentPage++;
      getData();
  }, 1000)
})