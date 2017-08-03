<script>
const formatDate = (time) => {
  let date = new Date(time);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  let h = date.getHours();
  h = h < 10 ? '0' + h : h;
  let min = date.getMinutes();
  min = min < 10 ? '0' + min : min;
  let s = date.getSeconds();
  s = s < 10 ? '0' + s : s;
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

export default {
  name: 'card',
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
              <img :src="item.img" class="img-responsive" onerror="this.src = '/img/default.jpg'"/>
            </a>
            <span :class="[item.isFavorite ? 'glyphicon-heart' : 'glyphicon-heart-empty']" @click.stop="onFavoriteClick(item)" class="glyphicon"></span>
          </div>
          <h4 class="card-title" v-html="item.searchedText"></h4>
          <div class="card-bottom">
            <span>{{ getDate }}</span>
            <span class="pull-right">
              <span class="glyphicon glyphicon-eye-open"></span>
              <i>{{ getView }}</i>
            </span>
          </div>
        </div>
      </div>
    </transition>`,
  data() {
    return {
      animLib: [
        'fadeInRight',
        'fadeOutLeft',
        'bounceIn',
        'bounceOut',
        'rotateIn',
        'rotateOut'
      ]
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
      // return moment(this.item.updated).format('YYYY-MM-DD HH:mm:ss');
      return formatDate(this.item.updated);
    },
    enterActiveClass() {
      return this.crazyMode
        ? this.animLib[
            _.random(0, this.animLib.length - 1) * (this.animLib.length - 1)
          ]
        : 'zoomIn';
    },
    leaveActiveClass() {
      return this.crazyMode
        ? this.animLib[
            _.random(0, this.animLib.length - 1 + 1) *
              (this.animLib.length - 1) +
              1
          ]
        : 'zoomOut';
    },
    getView() {
      return this.item.view > 100000000
        ? this.item.view / 100000000 + '亿'
        : this.item.view > 10000
            ? this.item.view / 10000 + '万'
            : this.item.view;
    }
  }
}
</script>

<style lang="sass">
@import "../sass/placeholder"
.card
  margin: 10px 0
  & > div
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)
    box-sizing: border-box
    border-radius: 2px
    background-clip: padding-box
    .card-image
      position: relative
      overflow: hidden
      cursor: pointer
      img
        width: 100%
        border-radius: 2px 2px 0 0
        background-clip: padding-box
        position: relative
        z-index: -1
        max-height: 400px
      span.glyphicon-heart-empty, span.glyphicon-heart
        position: absolute
        top: 10px
        left: 10px
        font-size: 1.5em
        color: lightgray
        transition: all .3s linear
      span.glyphicon-heart
        color: #e60b97
    .card-title
      @extend  %forceOneLine
    .card-content
      border-radius: 0 0 2px 2px
      background-clip: padding-box
      box-sizing: border-box
      p
        margin: 0
        color: inherit
      span.card-title
        line-height: 48px
    .card-bottom
      padding: 0 10px
</style>