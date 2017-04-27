<template lang="jade">
  #cp-index.container(v-cloak)
    .container
      .row
        .input-group.col-md-3.col-sm-12
          .input-group-btn(:class="{ open: showDropdown }")
            button(type="button" class="btn btn-default dropdown-toggle" @click="showDropdown = !showDropdown") {{ categories[selected].text }}
              span.caret(style="margin-left: 5px;")
            ul.dropdown-menu(v-show="showDropdown")
              li(v-for="item in categories" @click="resetCate(item)")
                a(href="#") {{ item.text }}
          input.form-control(type="text" id="search" placeholder="Search" v-model="searchingText")
    - var col = 4
    .tv-list
      .row(v-for="i in Math.ceil(filteredList.length / #{col})")
        card.col-sm-6(
          class="col-md-#{12/col}",
          v-for="(item, index) in filteredList.slice((i - 1) * #{col}, #{col} * i)",
          :item="item",
          :key="item.aid",
          :index="index",
          :row="i",
          @on-card-add-to-favorite="addToFavorite",
          @on-card-remove-from-favorite="removeFromFavorite"
        )
        .clearfix.visible-md
      vue-infinite-loading(
        :on-infinite="getMore",
        ref="infiniteLoading",
        spinner="waveDots"
      )
        span(slot="no-more") No more
      button.btn.btn-default.btn-block(@click="getMore" v-if="hasMore") Get More
</template>

<script>
export default {
  name: "index",
  data() {
    return {
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
      searchedList: [],
      isLoading: false
    }
  },
  computed: {
    filteredList() {
      return this.searchingText ? this.searchedList : this.list;
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
      if (this.isLoading) {
        return
      }
      this.isLoading = true
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
          this.isLoading = false;
          if (this.searchingText) {
            this.searchedList = this.searchedList.concat(
              data.map(item => {
                item.isFavorite = this.favoriteList.includes(item.aid);
                item.searchedText = item.title.replace(this.searchingText, `<mark>${this.searchingText}</mark>`);
                return item;
              })
            );
            eventHub.$emit("update-video-count", this.searchedList.length);
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
          eventHub.$emit("update-video-count", this.list.length);
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
      this.isLoading = false;
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
}
</script>