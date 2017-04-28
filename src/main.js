import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './view/Index.vue'
import About from './view/About.vue'
import Contact from './view/Contact.vue'
import Favorite from './view/Favorite.vue'
import Card from './components/Card.vue'
import InfiniteLoading from 'vue-infinite-loading';
import App from './App.vue';
import debounce from 'lodash/debounce';
import random from 'lodash/random';
import axios from 'axios';
window.axios = axios;

window._ = {};
window._.debounce = debounce;
window._.random = random

Vue.component("vue-infinite-loading", InfiniteLoading);
Vue.component("card", Card);

Vue.use(VueRouter)

const routes = [
  { path: '/index', component: Index },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/favorite', component: Favorite },
  { path: '/*', component: Index }
]

const router = new VueRouter({
  routes
})

let eventHub = new Vue();

window.eventHub = eventHub;

const app =new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

window.app = app;
// Now the app has started!


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
  true
);

document.getElementById('to-top').onclick = function(e) {
  e.stopPropagation();
  this.style.display = 'none';
  document.body.scrollTop = 0;
};

// prevent add to home screen app, A link to open by safari
if ('standalone' in window.navigator && window.navigator.standalone) {
  var noddy, remotes = false;
  document.addEventListener(
    'click',
    function(event) {
      noddy = event.target;
      while (noddy.nodeName !== 'A' && noddy.nodeName !== 'HTML') {
        noddy = noddy.parentNode;
      }
      if (
        'href' in noddy &&
        noddy.href.indexOf('http') !== -1 &&
        (noddy.href.indexOf(document.location.host) !== -1 || remotes)
      ) {
        event.preventDefault();
        document.location.href = noddy.href;
      }
    },
    false
  );
}
