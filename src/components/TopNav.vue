<template lang="jade">
  .cp-to-nav
    nav.navbar.navbar-inverse.navbar-fixed-top#top-nav(role='navigation' v-cloak)
      .container
        .navbar-header
          button.navbar-toggle(@click="showNav = !showNav")
            span.sr-only Toggle navigation
            span.icon-bar
            span.icon-bar
            span.icon-bar
          a.navbar-brand(@click="toLink('index')") Fun-Hub  ({{ videoCount }})
        #bs-example-navbar-collapse-1.collapse.navbar-collapse(:class="{in: showNav}")
          ul.nav.navbar-nav
            li.text-capitalize(v-for="item of links")
              a(@click="toLink(item)") {{ item }}
    #to-top(style="display: none;")
      span.glyphicon.glyphicon-arrow-up
</template>

<script>
export default {
  name: 'top-nav',
  data() {
    return {
      showNav: false,
      videoCount: 0,
      links: [
        'favorite',
        'about',
        'contact'
      ]
    }
  },
  created() {
    eventHub.$on('update-video-count', newVideoCount => {
      this.videoCount = newVideoCount;
    });
  },
  methods: {
    toLink(item) {
      window.app.$router.push(`/${item}`);
      this.showNav = false;
    }
  }
}
</script>

<style lang="sass">
#bs-example-navbar-collapse-1
  ul
    li
      cursor: pointer
a.navbar-brand
  cursor: pointer
</style>