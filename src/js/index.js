Vue.component('vue-infinite-loading', VueInfiniteLoading.default);
let vm = new Vue({
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
    filteredList: function() {
      var result = [];
      var _this = this;
      _this.list.forEach(function(item, index) {
        if ( _this.list[index].title.indexOf(_this.searchingText) !== -1 ) {
          result.push(item);
        }
      })
      return result;
    }
  },
  methods: {
    getMore() {
      this.currentId = this.currentId + 1;
      // var _this = this;
      axios.get('/index/' + this.currentId)
        .then(({ status, data }) => {
          console.log(data);
          if(data.length) {
            this.list = this.list.concat(data.map((item) => { item.isFavorite = this.favoriteList.includes(item.aid); return item }));
          }
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
        })
    },
    onCardClick: function(aid) {
      var redirectUrl = 'http://www.bilibili.com/video/av' + aid;
      console.log(redirectUrl);
      // this.openUrl(redirectUrl);
    },
    addToFavorite: function(item) {
      item.isFavorite = !item.isFavorite
      if (item.isFavorite) {
        this.favoriteList.push(item.aid)
      } else {
        var index = this.favoriteList.findIndex(function(i) {
          return i === item.aid
        })
        this.favoriteList.splice(index, 1)
      }
        localStorage.setItem('favoriteList', JSON.stringify(this.favoriteList))
    },
    openUrl: function(url) {
      var a = document.createElement('a');
      a.setAttribute('target', '_blank');
      a.setAttribute('href', url);
      a.click();
    }
  },
  mounted: function() {
    // this.getMore();
    // this.getMore();
    // this.getMore();
    // this.getMore();
    // this.getMore();
  }
});
