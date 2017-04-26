"use strict";

Vue.component("vue-infinite-loading", VueInfiniteLoading.default);
var indexView = new Vue({
  el: "#app",
  name: "app",
  data: {
    showDropdown: false,
    list: [],
    hasMore: true,
    favoriteList: localStorage.getItem("favoriteList") ? JSON.parse(localStorage.getItem("favoriteList")) : [],
    searchingText: "",
    categories: {
      0: {
        text: "日剧",
        value: 0,
        currentId: 0
      },
      1: {
        text: "动漫",
        value: 1,
        currentId: 0
      },
      // 2: {
      //   text: "fixsub",
      //   value: 2,
      //   currentId: 0
      // },
      3: {
        text: "QQ",
        value: 3,
        currentId: 0
      },
      4: {
        text: '推荐',
        value: 4,
        currentId: 0
      },
      5: {
        text: '优酷动漫',
        value: 5,
        currentId: 0
      }
    },
    selected: localStorage.getItem("defaultCate") ? JSON.parse(localStorage.getItem("defaultCate")) : 0,
    searchedList: [],
    isLoading: false
  },
  computed: {
    filteredList: function filteredList() {
      return this.searchingText ? this.searchedList : this.list;
    },
    currentId: function currentId() {
      return this.categories[+this.selected].currentId;
    }
  },
  methods: {
    getMore: function getMore() {
      var _this = this;

      if (!this.hasMore) {
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.categories[this.selected].currentId = this.categories[this.selected].currentId + 1;
      axios.get("/index/search", {
        params: {
          cate: this.selected,
          page: this.currentId,
          q: this.searchingText
        }
      }).then(function (_ref) {
        var status = _ref.status,
            data = _ref.data;

        _this.isLoading = false;
        if (_this.searchingText) {
          _this.searchedList = _this.searchedList.concat(data.map(function (item) {
            item.isFavorite = _this.favoriteList.includes(item.aid);
            item.searchedText = item.title.replace(_this.searchingText, "<mark>" + _this.searchingText + "</mark>");
            return item;
          }));
          navView.videoCount = _this.searchedList.length;
          if (data.length) {
            _this.$refs.infiniteLoading.$emit("$InfiniteLoading:loaded");
          } else {
            _this.$refs.infiniteLoading.$emit("$InfiniteLoading:complete");
            _this.hasMore = false;
          }
          return;
        }
        if (data.length) {
          _this.list = _this.list.concat(data.map(function (item) {
            item.isFavorite = _this.favoriteList.includes(item.aid);
            item.searchedText = item.title;
            return item;
          }));
        }
        navView.videoCount = _this.list.length;
        if (data.length) {
          _this.$refs.infiniteLoading.$emit("$InfiniteLoading:loaded");
        } else {
          _this.$refs.infiniteLoading.$emit("$InfiniteLoading:complete");
          _this.hasMore = false;
        }
      });
    },
    addToFavorite: function addToFavorite(item) {
      this.favoriteList.push(item.aid);
      localStorage.setItem("favoriteList", JSON.stringify(this.favoriteList));
    },
    removeFromFavorite: function removeFromFavorite(item) {
      var index = this.favoriteList.findIndex(function (i) {
        return i === item.aid;
      });
      this.favoriteList.splice(index, 1);
      localStorage.setItem("favoriteList", JSON.stringify(this.favoriteList));
    },
    resetCate: function resetCate(item) {
      item.currentId = 0;
      this.list = [];
      this.showDropdown = false;
      this.selected = item.value;
      this.searchingText = '';
      this.$refs.infiniteLoading.$emit("$InfiniteLoading:reset");
      localStorage.setItem("defaultCate", JSON.stringify(this.selected));
      this.hasMore = true;
      this.isLoading = false;
      this.getMore();
    },
    onInputHandler: function onInputHandler() {}
  },
  mounted: function mounted() {
    var _this2 = this;

    this.onInputHandler = _.debounce(function () {
      _this2.categories[_this2.selected].currentId = 0;
      _this2.showDropdown = false;
      _this2.$refs.infiniteLoading.$emit("$InfiniteLoading:reset");
      _this2.hasMore = true;
      if (_this2.searchingText) {
        _this2.searchedList = [];
        _this2.getMore();
      } else {
        _this2.list = [];
      }
    }, 300);
  }
});
//# sourceMappingURL=index.js.map
