'use strict';

var weekList = function weekList() {
  return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
};

var favoriteView = new Vue({
  el: '#app',
  name: 'favorite',
  data: {
    list: [],
    favoriteList: localStorage.getItem('favoriteList') ? JSON.parse(localStorage.getItem('favoriteList')) : [],
    weekList: weekList(),
    weekDays: [[], [], [], [], [], [], []]
  },
  methods: {
    getData: function getData() {
      var _this = this;

      axios.get('/favorite/list', {
        params: {
          favoriteList: localStorage.getItem('favoriteList') ? JSON.parse(localStorage.getItem('favoriteList')) : []
        }
      }).then(function (_ref) {
        var status = _ref.status,
            data = _ref.data;

        console.log(data);
        var count = 0;
        if (data.length) {
          _this.list = _this.list.concat(data.map(function (item) {
            item.isFavorite = _this.favoriteList.includes(item.aid);
            _this.weekDays[count++ % 7].push(item);
            return item;
          }));
        }
      });
    },
    removeFromFavoriteList: function removeFromFavoriteList(item) {
      var index = this.favoriteList.findIndex(function (d) {
        return d.aid === item.aid;
      });

      this.favoriteList.splice(index, 1);
      localStorage.setItem('favoriteList', JSON.stringify(this.favoriteList));

      index = this.list.findIndex(function (d) {
        return d.aid === item.aid;
      });

      this.list.splice(index, 1);
    }
  },
  mounted: function mounted() {
    this.getData();
  }
});
//# sourceMappingURL=favorite.js.map
