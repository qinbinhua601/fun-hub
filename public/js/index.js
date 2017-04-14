Vue.component('vue-infinite-loading', VueInfiniteLoading.default);
var vm = new Vue({
  el: '#app',
  name: 'app',
  data: {
    list: [],
    currentId: 0,
    hasMore: true,
    favoriteList: [],
    searchingText: ''
  },
  computed: {
    filteredList: function() {
      var result = [];
      var _this = this;
      this.list.forEach(function(item, index) {
        if(_this.list[index].title.indexOf(_this.searchingText) !== -1) {
          result.push(item);
        }
      })
      return result;
    }
  },
  methods: {
    getMore: function() {
      var _this = this;
      _this.currentId = _this.currentId + 1;
      axios.get('/index/' + _this.currentId)
        .then(function ({ status, data }) {
          console.log(data.archives);
          _this.list = _this.list.concat(data.archives.map(function(item) { item.isFavorite = false; return item }));
          _this.hasMore = data.page.count > data.page.num * data.page.size;
          _this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
        })
    },
    onCardClick: function(aid) {
      var redirectUrl = 'http://www.bilibili.com/video/av' + aid;
      console.log(redirectUrl);
      // window.location.href = redirectUrl;
    },
    addToFavorite: function(id) {
      this.favoriteList.push(id)
    }
  },
  mounted: function() {
    this.getMore();
    this.getMore();
    this.getMore();
    this.getMore();
    this.getMore();
  }
});
