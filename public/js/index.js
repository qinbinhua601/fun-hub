'use strict';

Vue.component('vue-infinite-loading', VueInfiniteLoading.default);
var vm = new Vue({
  el: '#app',
  name: 'app',
  data: {
    list: [],
    currentId: 0,
    hasMore: true,
    favoriteList: localStorage.getItem('favoriteList') ? JSON.parse(localStorage.getItem('favoriteList')) : [],
    searchingText: ''
  },
  computed: {
    filteredList: function filteredList() {
      var result = [];
      var _this = this;
      _this.list.forEach(function (item, index) {
        if (_this.list[index].title.indexOf(_this.searchingText) !== -1) {
          result.push(item);
        }
      });
      return result;
    }
  },
  methods: {
    getMore: function getMore() {
      var _this2 = this;

      this.currentId = this.currentId + 1;
      // var _this = this;
      axios.get('/index/' + this.currentId).then(function (_ref) {
        var status = _ref.status,
            data = _ref.data;

        console.log(data);
        if (data.length) {
          _this2.list = _this2.list.concat(data.map(function (item) {
            item.isFavorite = _this2.favoriteList.includes(item.aid);return item;
          }));
        }
        _this2.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
      });
    },

    onCardClick: function onCardClick(aid) {
      var redirectUrl = 'http://www.bilibili.com/video/av' + aid;
      console.log(redirectUrl);
      // this.openUrl(redirectUrl);
    },
    addToFavorite: function addToFavorite(item) {
      item.isFavorite = !item.isFavorite;
      if (item.isFavorite) {
        this.favoriteList.push(item.aid);
      } else {
        var index = this.favoriteList.findIndex(function (i) {
          return i === item.aid;
        });
        this.favoriteList.splice(index, 1);
      }
      localStorage.setItem('favoriteList', JSON.stringify(this.favoriteList));
    },
    openUrl: function openUrl(url) {
      var a = document.createElement('a');
      a.setAttribute('target', '_blank');
      a.setAttribute('href', url);
      a.click();
    }
  },
  mounted: function mounted() {
    // this.getMore();
    // this.getMore();
    // this.getMore();
    // this.getMore();
    // this.getMore();
  }
});
//# sourceMappingURL=index.js.map
