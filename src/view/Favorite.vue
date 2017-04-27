<template lang="jade">
  #cp-favorite
    ul.week-list.container(v-cloak v-if="list.length")
      li(v-for="(day, index) of weekDays") {{ weekList[index] }}
        ul
          card.col-md-3(
            v-for="(item, x) of day",
            @on-card-remove-from-favorite="removeFromWeekArray(item, index)",
            :item="item",
            :key="item.aid"
          )
    .no-video-tip.text-center(v-else) no favorite video available
</template>

<script>
const weekList = () => {
  return ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
};

export default {
  name: "favorite",
  data() {
    return {
      list: [],
      favoriteList: localStorage.getItem("favoriteList")
        ? JSON.parse(localStorage.getItem("favoriteList"))
        : [],
      weekList: weekList(),
      weekDays: [[], [], [], [], [], [], []]
    }
  },
  methods: {
    getData() {
      axios
        .get("/favorite/list", {
          params: {
            favoriteList: localStorage.getItem("favoriteList")
              ? JSON.parse(localStorage.getItem("favoriteList"))
              : []
          }
        })
        .then(({ status, data }) => {
          console.log(data);
          let count = 0;
          if (data.length) {
            this.list = this.list.concat(
              data.map(item => {
                item.isFavorite = this.favoriteList.includes(item.aid);
                this.weekDays[(moment(item.updated).day() + 6) % 7].push(item);
                return item;
              })
            );
          }
          // navView.videoCount = this.list.length;
          eventHub.$emit('update-video-count', this.list.length)
        });
    },
    removeFromFavoriteList(item) {
      let index = this.favoriteList.findIndex((d) => {
        return d.aid === item.aid;
      });

      this.favoriteList.splice(index, 1);
      localStorage.setItem("favoriteList", JSON.stringify(this.favoriteList));

      index = this.list.findIndex((d) => {
        return d.aid === item.aid;
      });

      this.list.splice(index, 1);
    },
    removeFromWeekArray({ aid }, index) {
      console.log(index);
      let removeIndex = this.weekDays[index].findIndex(
        item => item.aid === aid
      );
      this.weekDays[index].splice(removeIndex, 1);
      removeIndex = this.favoriteList.findIndex(item => item === aid);
      this.favoriteList.splice(removeIndex, 1);
      localStorage.setItem("favoriteList", JSON.stringify(this.favoriteList));
    }
  },
  mounted() {
    this.getData();
  }
}
</script>

<style lang="sass">
#cp-favorite
  ul.week-list
    & > li
      margin: 10px 0
      font-size: 1.2em
      ul
        border-top: 1px solid grey
        margin-top: 5px
        padding-left: 0
        font-size: initial
        overflow: hidden
        .card
          margin: 10px 0
</style>