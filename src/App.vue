<template lang="jade">
  #app(v-cloak)
    top-nav
    router-view
</template>

<script>
import TopNav from './components/TopNav.vue';

export default {
  name: 'app',
  components: {
    TopNav
  }
}
</script>

<style lang="sass">
@import "./sass/placeholder"
@import "./sass/animations/fadeInRight"
@import "./sass/animations/fadeOutLeft"
@import "./sass/animations/bounceIn"
@import "./sass/animations/bounceOut"
@import "./sass/animations/rotateIn"
@import "./sass/animations/rotateOut"
@import "./sass/animations/zoomIn"
@import "./sass/animations/zoomOut"
html, body
  max-width: 100%
  overflow-x: hidden
  min-height: 400px
body
  padding-top: 70px
  &.pc
    .card > div .card-image span.glyphicon-heart:hover
      color: lightgray
      transform: scale(1.5)
      &:before
        content: "\e143"
    .card > div .card-image span.glyphicon-heart-empty:hover
      color: #e60b97
      transform: scale(1.5)
      &:before
        content: "\e005"
    #to-top:hover
      transform: scale(1.3)
      color: rgba(255, 0, 0, 1)
#to-top
  position: fixed
  bottom: 15px
  right: 15px
  text-align: center
  z-index: 1
  span
    font-size: 4em
    color: rgba(255, 0, 0, .5)
    transition: all .2s ease-in
ul
  list-style: none
[v-cloak]
  display: none
.tv-list
  padding: 0
.fadeInRight
  animation: fadeInRight .5s
.fadeOutLeft
  animation: fadeOutLeft .5s
.bounceIn
  animation: bounceIn .5s
.bounceOut
  animation: bounceOut .5s
.rotateIn
  animation: rotateIn .5s
.rotateOut
  animation: rotateOut .5s
.zoomIn
  animation: zoomIn .5s
.zoomOut
  animation: zoomOut .5s
.form-inline
  margin-bottom: 20px
mark
  background-color: #ff0
</style>