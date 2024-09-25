<template>
  <div class="container" :style="containerStyle">
    <left
      ref="leftComponent"
      :context="context"
      @data="handleOpen"
      @success="handleOpenSuccess"
    />
    <right
      :images="images"
      :flag="flag"
      :isSuccess="isSuccess"
      :hasMore="hasMore"
      :currentTask="currentTask"
      @updateStatus="handleUpdateStatus"
    />
  </div>
</template>

<script>
import Left from "./left.vue";
import Right from "../right.vue";
import work from "../mixins/work";
import { list } from "@/api/zhiqi/image";
export default {
  components: {
    Left,
    Right,
  },
  mixins: [work],
  data() {
    return {
      context: {
        title: "AI模特",
        content:
          "海量预先设计，百种数字模型，让您能够轻松解决各种场地、模特商业需求，触达全球各地的用户，精准展示商品。",
      },
      images: [],
    };
  },
  computed: {
    containerStyle() {
      return {
        backgroundColor: this.flag ? "transparent" : "rgba(0, 0, 0, 0.45)",
      };
    },
  },
   async mounted() {
    const res = await list(1);
    this.images = res.data;
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  position: relative;
  height: 100vh; /* 全屏高度 */
  background-color: rgba(0, 0, 0, 0.45);
}
</style>