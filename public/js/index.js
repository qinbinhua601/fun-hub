var vm = new Vue({
  el: '#app',
  name: 'app',
  data: {
    msg: 'apple',
    list: []
  },
  methods: {
    getListData: function(id) {
      var _this = this;
      axios.get('/' + id)
      .then(function ({ status, data }) {
        console.log(data.archives);
        _this.list = _this.list.concat(data.archives);
      })
    }
  }
});