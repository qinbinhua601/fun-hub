'use strict';

Vue.component('vue-infinite-loading', VueInfiniteLoading.default);
var indexView = new Vue({
  el: '#app',
  name: 'app',
  data: {
    list: [],
    hasMore: true,
    favoriteList: localStorage.getItem('favoriteList') ? JSON.parse(localStorage.getItem('favoriteList')) : [],
    searchingText: '',
    categories: [{
      text: '日剧',
      value: 0,
      currentId: 0
    }, {
      text: '动漫',
      value: 1,
      currentId: 0
    }, {
      text: 'fixsub',
      value: 2,
      currentId: 0
    }],
    selected: localStorage.getItem('defaultCate') ? JSON.parse(localStorage.getItem('defaultCate')) : 0
  },
  computed: {
    filteredList: function filteredList() {
      var _this = this;

      var result = [];
      this.list.forEach(function (item, index) {
        if (_this.list[index].title.indexOf(_this.searchingText) !== -1) {
          result.push(item);
        }
      });
      return result;
    },
    currentId: function currentId() {
      return this.categories[+this.selected].currentId;
    }
  },
  methods: {
    getMore: function getMore() {
      var _this2 = this;

      this.categories[this.selected].currentId = this.categories[this.selected].currentId + 1;
      axios.get('/index/' + this.currentId, {
        params: {
          cate: this.selected
        }
      }).then(function (_ref) {
        var status = _ref.status,
            data = _ref.data;

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
      this.openUrl(redirectUrl);
    },
    addToFavorite: function addToFavorite(item) {
      this.favoriteList.push(item.aid);
      localStorage.setItem('favoriteList', JSON.stringify(this.favoriteList));
    },
    removeFromFavorite: function removeFromFavorite(item) {
      var index = this.favoriteList.findIndex(function (i) {
        return i === item.aid;
      });
      this.favoriteList.splice(index, 1);
      localStorage.setItem('favoriteList', JSON.stringify(this.favoriteList));
    },
    openUrl: function openUrl(url) {
      var a = document.createElement('a');
      a.setAttribute('target', '_blank');
      a.setAttribute('href', url);
      a.click();
    },
    resetCate: function resetCate() {
      this.list = [];
      this.getMore();
      localStorage.setItem('defaultCate', JSON.stringify(this.selected));
    }
  },
  mounted: function mounted() {}
});
//# sourceMappingURL=index.js.map
