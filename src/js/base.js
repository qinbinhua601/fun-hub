// #top-nav view
let navView = new Vue({
  el: "#top-nav",
  name: "top-nav",
  data: {
    showNav: false
  }
});

// define card component
Vue.component("card", {
  template: `
    <div @click="$emit('on-card-click', item.aid)" class="card">
      <div>
        <div class="card-image">
          <img :src="item.img" class="img-responsive" />
          <span :class="[item.isFavorite ? 'glyphicon-heart' : 'glyphicon-heart-empty']" @click.stop="onFavoriteClick(item)" class="glyphicon"></span>
        </div>
        <h4 class="card-title">{{ item.title }}</h4>
        <p>{{ getDate }}</p>
      </div>
    </div>`,
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    onFavoriteClick(item) {
      item.isFavorite = !item.isFavorite;
      if (item.isFavorite) {
        this.$emit("on-card-add-to-favorite", item);
      } else {
        this.$emit("on-card-remove-from-favorite", item);
      }
    }
  },
  computed: {
    getDate() {
      return moment(this.item.updated).format("YYYY-MM-DD HH:mm:ss");
    }
  }
});

// detecting if touch mobile device
var touch =
  "ontouchstart" in document.documentElement ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;


// for disabling the hover css effect
if (!touch) {
  document.body.setAttribute("class", "pc");
}
