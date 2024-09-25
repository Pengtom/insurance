<template>
  <div class="container">
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
  mixins: [work],
  data() {
    return {
      context: {
        title: "建筑外观",
        content:
          "提供思绪、线稿或是涂鸦手绘图，就能将概念中的建筑外观，转化为真实的渲染效果图，告别传统繁琐的建模流程。",
      },
      images: [],
    };
  },
  components: {
    Left,
    Right,
  },
  async mounted() {
    const res = await list(3);
    this.images = res.data;
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;
}
</style>