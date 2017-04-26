Vue.component("vue-infinite-loading", VueInfiniteLoading.default);
let indexView = new Vue({
  el: "#app",
  name: "app",
  data: {
    showDropdown: false,
    list: [],
    hasMore: true,
    favoriteList: localStorage.getItem("favoriteList")
      ? JSON.parse(localStorage.getItem("favoriteList"))
      : [],
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
    selected: localStorage.getItem("defaultCate")
      ? JSON.parse(localStorage.getItem("defaultCate"))
      : 0,
    searchedList: []
  },
  computed: {
    filteredList() {
      return this.searchingText ? this.searchedList : this.list;
      // var result = [];
      // this.list.forEach((item, index) => {
      //   if (this.list[index].title.indexOf(this.searchingText) !== -1) {
      //     item.searchedText = item.title.replace(this.searchingText, `<mark>${this.searchingText}</mark>`);
      //     if (!this.searchingText) {
      //       item.searchedText = item.title
      //     }
      //     result.push(item);
      //   }
      // });
      // return result;
    },
    currentId() {
      return this.categories[+this.selected].currentId;
    }
  },
  methods: {
    getMore() {
      if (!this.hasMore) {
        return
      }
      this.categories[this.selected].currentId =
        this.categories[this.selected].currentId + 1;
      axios
        .get("/index/search", {
          params: {
            cate: this.selected,
            page: this.currentId,
            q: this.searchingText
          }
        })
        .then(({ status, data }) => {
          if (this.searchingText) {
            this.searchedList = this.searchedList.concat(
              data.map(item => {
                item.isFavorite = this.favoriteList.includes(item.aid);
                item.searchedText = item.title.replace(this.searchingText, `<mark>${this.searchingText}</mark>`);
                return item;
              })
            );
            navView.videoCount = this.searchedList.length;
            if (data.length) {
              this.$refs.infiniteLoading.$emit("$InfiniteLoading:loaded");
            } else {
              this.$refs.infiniteLoading.$emit("$InfiniteLoading:complete");
              this.hasMore = false
            }
            return
          }
          if (data.length) {
            this.list = this.list.concat(
              data.map(item => {
                item.isFavorite = this.favoriteList.includes(item.aid);
                item.searchedText = item.title;
                return item;
              })
            );
          }
          navView.videoCount = this.list.length;
          if (data.length) {
            this.$refs.infiniteLoading.$emit("$InfiniteLoading:loaded");
          } else {
            this.$refs.infiniteLoading.$emit("$InfiniteLoading:complete");
            this.hasMore = false
          }
        });
    },
    addToFavorite(item) {
      this.favoriteList.push(item.aid);
      localStorage.setItem("favoriteList", JSON.stringify(this.favoriteList));
    },
    removeFromFavorite(item) {
      var index = this.favoriteList.findIndex(function(i) {
        return i === item.aid;
      });
      this.favoriteList.splice(index, 1);
      localStorage.setItem("favoriteList", JSON.stringify(this.favoriteList));
    },
    resetCate(item) {
      item.currentId = 0;
      this.list = [];
      this.showDropdown = false;
      this.selected = item.value;
      this.searchingText = '';
      this.$refs.infiniteLoading.$emit("$InfiniteLoading:reset");
      localStorage.setItem("defaultCate", JSON.stringify(this.selected));
      this.hasMore = true;
      this.getMore();
    },
    onInputHandler() {}
  },
  mounted() {
    this.onInputHandler = _.debounce(() => {
      this.categories[this.selected].currentId = 0;
      this.showDropdown = false;
      this.$refs.infiniteLoading.$emit("$InfiniteLoading:reset");
      this.hasMore = true;
      if (this.searchingText) {
        this.searchedList = [];
        this.getMore()
      } else {
        this.list = [];
      }
    }, 300)
  }
});