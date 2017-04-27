<template lang="jade">
  #cp-about
    .container(class="col-md-8 col-md-offset-2")
      .panel.panel-default.text-center
        .panel-heading Developer Info
        .panel-body
          .author
            img.img-circle(src="https://wx.qlogo.cn/mmopen/PiajxSqBRaEKVWob5U3FZeorHoy3Oe2Queica3gMJGFvSVWKSQoddrbXSu4FW5m5V83L0ts16JUsbUg91iaDicNAjg/0")
            p Alex.Q
            a.btn-block(href="https://github.com/qinbinhua601/fun-hub") GitHub
      .panel.panel-default.text-center
        .panel-heading Main Tools To Use
        .panel-body
            ul.list-inline
              li(v-for="item in techs")
                a(:href="item.link")
                  span.label.label-primary {{ item.text }}
      blockquote.blockquote-reverse
        p Regular people do regular things, but I am not regular.
        footer
          | 2-time NBA MVP &nbsp;
          cite(title="Stephen Curry") Stephen Curry
</template>

<script>
export default {
  name: 'about',
  data() {
    return {
      techs: [
        {
          text: 'nodejs',
          link: 'https://nodejs.org/en/'
        },
        {
          text: 'mongodb',
          link: 'https://www.mongodb.com/'
        },
        {
          text: 'cheerio',
          link: 'https://github.com/cheeriojs/cheerio'
        },
        {
          text: 'superagent',
          link: 'https://github.com/visionmedia/superagent'
        },
        {
          text: 'vue',
          link: 'https://vuejs.org'
        },
        {
          text: 'vue-router',
          link: 'https://router.vuejs.org'
        }
      ]
    }
  },
  methods: {},
  mounted() {}
}
</script>

<style lang="sass">
#cp-about
  .author
    img
      width: 80px
      height: 80px
  ul
    li
      margin-bottom: 5px
</style>
