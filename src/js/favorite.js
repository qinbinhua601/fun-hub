var vm = new Vue({
  el: '#app',
  data: {
    list: [],
    favoriteList: localStorage.getItem('favoriteList') ? JSON.parse(localStorage.getItem('favoriteList')) : [],
  },
  methods: {
    getData: function() {
      var _this = this;
      axios.get('/favorite/list', {
          params: {
            favoriteList: localStorage.getItem('favoriteList') ? JSON.parse(localStorage.getItem('favoriteList')) : []
          }
        })
        .then(function ({ status, data }) {
          console.log(data);
          if (data.length) {
            _this.list = _this.list.concat(data.map(function(item) { item.isFavorite = _this.favoriteList.includes(item.aid); return item }));
          }
        })
    },
    removeFromFavoriteList: function(item) {
      let index = this.favoriteList.findIndex(function(d) {
        return d.aid = item.aid
      });

      this.favoriteList.splice(index, 1);
      localStorage.setItem('favoriteList', JSON.stringify(this.favoriteList));

      index = this.list.findIndex(function(d) {
        return d.aid === item.aid;
      });

      this.list.splice(index, 1);

    }
  },
  mounted: function() {
    this.getData();
  }
});