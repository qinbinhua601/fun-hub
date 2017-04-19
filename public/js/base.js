"use strict";

var eventHub = new Vue();

// #top-nav view
var navView = new Vue({
  el: "#top-nav",
  name: "top-nav",
  data: {
    showNav: false,
    videoCount: 0
  },
  created: function created() {
    var _this = this;

    eventHub.$on('update-video-count', function (newVideoCount) {
      console.log('hello');
      _this.videoCount = newVideoCount;
    });
  }
});

// define card component
Vue.component("card", {
  template: "\n    <div @click=\"$emit('on-card-click', item.aid)\" class=\"card\">\n      <div>\n        <div class=\"card-image\">\n          <a :href=\"item.url\" target=\"_blank\">\n            <img :src=\"item.img\" class=\"img-responsive\" />\n          </a>\n          <span :class=\"[item.isFavorite ? 'glyphicon-heart' : 'glyphicon-heart-empty']\" @click.stop=\"onFavoriteClick(item)\" class=\"glyphicon\"></span>\n        </div>\n        <h4 class=\"card-title\">{{ item.title }}</h4>\n        <p>{{ getDate }}</p>\n      </div>\n    </div>",
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    onFavoriteClick: function onFavoriteClick(item) {
      item.isFavorite = !item.isFavorite;
      if (item.isFavorite) {
        this.$emit("on-card-add-to-favorite", item);
      } else {
        this.$emit("on-card-remove-from-favorite", item);
      }
    }
  },
  computed: {
    getDate: function getDate() {
      return moment(this.item.updated).format("YYYY-MM-DD HH:mm:ss");
    }
  }
});

// detecting if touch mobile device
var touch = "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

// for disabling the hover css effect
if (!touch) {
  document.body.setAttribute("class", "pc");
}
//# sourceMappingURL=base.js.map
