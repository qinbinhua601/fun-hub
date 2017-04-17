// #top-nav view
var navView = new Vue({
  el: '#top-nav',
  data: {
    showNav: false
  }
});

// define card component
Vue.component('card', {
  template: `
    <div @click="$emit('on-card-click', item.aid)" class="card col-md-4 col-sm-6">
      <div class="card-image">
        <img :src="item.img" class="img-responsive" />
        <span :class="[item.isFavorite ? 'glyphicon-heart' : 'glyphicon-heart-empty']" @click.stop="addToFavorite(item)" class="glyphicon"></span>
      </div>
      <h4 class="card-title">{{ item.title }}</h4>
      <!-- <div class="card-content">{{ item.desc }}</div> -->
    </div>
  `,
  props: {
    item: {
      type: Object
    }
  },
  methods: {}
});