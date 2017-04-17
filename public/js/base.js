'use strict';

// #top-nav view
var navView = new Vue({
  el: '#top-nav',
  data: {
    showNav: false
  }
});

// define card component
Vue.component('card', {
  template: '\n    <div @click="$emit(\'on-card-click\', item.aid)" class="card col-md-4 col-sm-6">\n      <div class="card-image">\n        <img :src="item.img" class="img-responsive" />\n        <span :class="[item.isFavorite ? \'glyphicon-heart\' : \'glyphicon-heart-empty\']" @click.stop="addToFavorite(item)" class="glyphicon"></span>\n      </div>\n      <h4 class="card-title">{{ item.title }}</h4>\n      <!-- <div class="card-content">{{ item.desc }}</div> -->\n    </div>\n  ',
  props: {
    item: {
      type: Object
    }
  },
  methods: {}
});
//# sourceMappingURL=base.js.map
