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
        title: "AI换装",
        content:
          "无需再受限于固有素材，一键换装，让时尚变换如同按下快门般简单。",
      },
      images: [],
    };
  },
  components: {
    Left,
    Right,
  },
  async mounted() {
    const res = await list(4);
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