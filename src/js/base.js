let eventHub = new Vue();

// #top-nav view
let navView = new Vue({
  el: '#top-nav',
  name: 'top-nav',
  data: {
    showNav: false,
    videoCount: 0
  },
  created() {
    eventHub.$on('update-video-count', newVideoCount => {
      this.videoCount = newVideoCount;
    });
  }
});

// define card component
Vue.component('card', {
  template: `
    <transition
      name="list",
      :enter-active-class="enterActiveClass",
      :leave-active-class="leaveActiveClass"
    >
      <div @click="$emit('on-card-click', item.aid)" class="card">
        <div>
          <div class="card-image">
            <a :href="item.url" target="_blank">
              <img :src="item.img" class="img-responsive" />
            </a>
            <span :class="[item.isFavorite ? 'glyphicon-heart' : 'glyphicon-heart-empty']" @click.stop="onFavoriteClick(item)" class="glyphicon"></span>
          </div>
          <h4 class="card-title">{{ item.title }}</h4>
          <p>{{ getDate }}</p>
        </div>
      </div>
    </transition>`,
  data() {
    return {
      animLib: ['fadeInRight', 'fadeOutLeft', 'bounceIn', 'bounceOut', 'rotateIn', 'rotateOut']
    }
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    },
    row: {
      type: Number
    },
    crazyMode: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onFavoriteClick(item) {
      item.isFavorite = !item.isFavorite;
      if (item.isFavorite) {
        this.$emit('on-card-add-to-favorite', item);
      } else {
        this.$emit('on-card-remove-from-favorite', item);
      }
    }
  },
  computed: {
    getDate() {
      return moment(this.item.updated).format('YYYY-MM-DD HH:mm:ss');
    },
    enterActiveClass() {
      return this.crazyMode ? this.animLib[_.random(0,(this.animLib.length - 1)) * (this.animLib.length - 1)] : 'zoomIn'
    },
    leaveActiveClass() {
      return this.crazyMode ? this.animLib[_.random(0,(this.animLib.length - 1) + 1) * (this.animLib.length - 1) + 1] : 'zoomOut'
    }
  }
});

// detecting if touch mobile device
var touch =
  'ontouchstart' in document.documentElement ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

// for disabling the hover css effect
if (!touch) {
  document.body.setAttribute('class', 'pc');
}

document.body.onscroll = _.debounce(
  () => {
    let $toTop = document.getElementById('to-top');
    if (document.body.scrollTop > 100) {
      $toTop.style.display = 'block';
    } else {
      $toTop.style.display = 'none';
    }
  },
  200,
  {
    leading: true
  }
);

document.getElementById('to-top').onclick = function(e) {
  e.stopPropagation();
  this.style.display = 'none';
  document.body.scrollTop = 0;
};
