'use strict';

// #top-nav view
var navView = new Vue({
  el: '#top-nav',
  name: 'top-nav',
  data: {
    showNav: false
  }
});

// define card component
Vue.component('card', {
  template: '\n    <div @click="$emit(\'on-card-click\', item.aid)" class="card col-md-4 col-sm-6">\n      <div class="card-image">\n        <img :src="item.img" class="img-responsive" />\n        <span :class="[item.isFavorite ? \'glyphicon-heart\' : \'glyphicon-heart-empty\']" @click.stop="onFavoriteClick(item)" class="glyphicon"></span>\n      </div>\n      <h4 class="card-title">{{ item.title }}</h4>\n      <p>{{ getDate }}</p>\n      <!-- <div class="card-content">{{ item.desc }}</div> -->\n    </div>',
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    onFavoriteClick: function onFavoriteClick(item) {
      item.isFavorite = !item.isFavorite;
      if (item.isFavorite) {
        this.$emit('on-card-add-to-favorite', item);
      } else {
        this.$emit('on-card-remove-from-favorite', item);
      }
    }
  },
  computed: {
    getDate: function getDate() {
      return moment(this.item.updated).weekday() + ' ' + moment(this.item.updated).format('L');
    }
  }
});
//# sourceMappingURL=base.js.map
