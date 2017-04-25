'use strict';

var eventHub = new Vue();

// #top-nav view
var navView = new Vue({
  el: '#top-nav',
  name: 'top-nav',
  data: {
    showNav: false,
    videoCount: 0
  },
  created: function created() {
    var _this = this;

    eventHub.$on('update-video-count', function (newVideoCount) {
      _this.videoCount = newVideoCount;
    });
  }
});

// define card component
Vue.component('card', {
  template: '\n    <transition\n      name="list",\n      :enter-active-class="enterActiveClass",\n      :leave-active-class="leaveActiveClass"\n    >\n      <div @click="$emit(\'on-card-click\', item.aid)" class="card">\n        <div>\n          <div class="card-image">\n            <a :href="item.url" target="_blank">\n              <img :src="item.img" class="img-responsive" />\n            </a>\n            <span :class="[item.isFavorite ? \'glyphicon-heart\' : \'glyphicon-heart-empty\']" @click.stop="onFavoriteClick(item)" class="glyphicon"></span>\n          </div>\n          <h4 class="card-title">{{ item.title }}</h4>\n          <div class="card-bottom">\n            <span>{{ getDate }}</span>\n            <span class="pull-right">\n              <span class="glyphicon glyphicon-eye-open"></span>\n              <i>{{ getView }}</i>\n            </span>\n          </div>\n        </div>\n      </div>\n    </transition>',
  data: function data() {
    return {
      animLib: ['fadeInRight', 'fadeOutLeft', 'bounceIn', 'bounceOut', 'rotateIn', 'rotateOut']
    };
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
      return moment(this.item.updated).format('YYYY-MM-DD HH:mm:ss');
    },
    enterActiveClass: function enterActiveClass() {
      return this.crazyMode ? this.animLib[_.random(0, this.animLib.length - 1) * (this.animLib.length - 1)] : 'zoomIn';
    },
    leaveActiveClass: function leaveActiveClass() {
      return this.crazyMode ? this.animLib[_.random(0, this.animLib.length - 1 + 1) * (this.animLib.length - 1) + 1] : 'zoomOut';
    },
    getView: function getView() {
      return this.item.view >= 100000000 ? this.item.view / 100000000 + '亿' : this.item.view >= 10000 ? this.item.view / 10000 + '万' : this.item.view;
    }
  }
});

// detecting if touch mobile device
var touch = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

// for disabling the hover css effect
if (!touch) {
  document.body.setAttribute('class', 'pc');
}

document.body.onscroll = _.debounce(function () {
  var $toTop = document.getElementById('to-top');
  if (document.body.scrollTop > 100) {
    $toTop.style.display = 'block';
  } else {
    $toTop.style.display = 'none';
  }
}, 200, {
  leading: true
});

document.getElementById('to-top').onclick = function (e) {
  e.stopPropagation();
  this.style.display = 'none';
  document.body.scrollTop = 0;
};

// prevent add to home screen app, A link to open by safari
if ('standalone' in window.navigator && window.navigator.standalone) {
  var noddy,
      remotes = false;
  document.addEventListener('click', function (event) {
    noddy = event.target;
    while (noddy.nodeName !== 'A' && noddy.nodeName !== 'HTML') {
      noddy = noddy.parentNode;
    }
    if ('href' in noddy && noddy.href.indexOf('http') !== -1 && (noddy.href.indexOf(document.location.host) !== -1 || remotes)) {
      event.preventDefault();
      document.location.href = noddy.href;
    }
  }, false);
}
//# sourceMappingURL=base.js.map
