import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './view/Index.vue'
import About from './view/About.vue'
import Contact from './view/Contact.vue'
import Favorite from './view/Favorite.vue'
import Card from './components/Card.vue'
import InfiniteLoading from 'vue-infinite-loading';
import _ from 'lodash';
import App from './App.vue';

Vue.component("vue-infinite-loading", InfiniteLoading);
Vue.component("card", Card);

Vue.use(VueRouter)

// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter and then call Vue.use(VueRouter).

// 1. Define route components.
// These can be imported from other files
// const Foo = { template: '<div>foo</div>' }

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/index', component: Index },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/favorite', component: Favorite },
  { path: '/*', component: Index }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for routes: routes
})

let eventHub = new Vue();
window.eventHub = eventHub;
// #top-nav view
// let navView = new Vue({
//   el: '#top-nav',
//   name: 'top-nav',
//   data: {
//     showNav: false,
//     videoCount: 0,
//     links: [
//       'favorite',
//       'about',
//       'contact'
//     ]
//   },
//   created() {
//     eventHub.$on('update-video-count', newVideoCount => {
//       this.videoCount = newVideoCount;
//     });
//   },
//   methods: {
//     toLink(item) {
//       window.app.$router.push(`/${item}`);
//       this.showNav = false;
//     }
//   }
// });
// window.navView = navView;

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
// const app = new Vue({
//   router
// }).$mount('#app')

const app =new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

window.app = app;
// Now the app has started!
