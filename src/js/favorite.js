const weekList = () => {
  return [
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
    '周日'
  ]
}

let favoriteView = new Vue({
  el: '#app',
  name: 'favorite',
  data: {
    list: [],
    favoriteList: localStorage.getItem('favoriteList') ? JSON.parse(localStorage.getItem('favoriteList')) : [],
    weekList: weekList(),
    weekDays: [ [], [], [], [], [], [], [] ]
  },
  methods: {
    getData: function() {
      axios.get('/favorite/list', {
          params: {
            favoriteList: localStorage.getItem('favoriteList') ? JSON.parse(localStorage.getItem('favoriteList')) : []
          }
        })
        .then(({ status, data }) => {
          console.log(data);
          let count = 0;
          if (data.length) {
            this.list = this.list.concat(data.map((item) => {
              item.isFavorite = this.favoriteList.includes(item.aid);
              this.weekDays[count++ % 7].push(item);
              return item;
            }));
          }

        })
    },
    removeFromFavoriteList: function(item) {
      let index = this.favoriteList.findIndex(function(d) {
        return d.aid === item.aid
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