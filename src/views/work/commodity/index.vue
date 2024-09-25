<template>
  <div class="container">
    <commodity
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
import commodity from "./commodity.vue";
import Right from "../right.vue";
import work from "../mixins/work";
import { list } from "@/api/zhiqi/image";
export default {
  mixins: [work],
  data() {
    return {
      context: {
        title: "AI商品",
        content:
          "轻松实现商品融合真实场景，分秒渲染，足不出户即可生成商业摄影质量的产品主图。",
      },
      images: [],
    };
  },
  components: {
    commodity,
    Right,
  },
   async mounted() {
    const res = await list(2);
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