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
      @load-more="loadMoreImages"
      @updateStatus="handleUpdateStatus"
    />
  </div>
</template>

<script>
import Left from "./left copy.vue";
import Right from "../right.vue";
import work from "../mixins/work";
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
          "轻松生成多样化的AI数字人模特和专业电商拍摄场景，可适应全球各地市场需求，高效展示商品。",
      },
      images: [
        "https://ai-image.weshop.com/2722ba48-a8e2-4e39-a80f-6dc994869147_776x1056.png_preview.webp",
        "https://ai-image.weshop.com/156740a9-aa98-469f-a656-4b72ba74a2a6_560x704.png_preview.webp",
        "https://ai-image.weshop.com/a1367049-dab6-4e8b-8868-35e7f390246f_856x1144.png_preview.webp",
        "https://ai-image.weshop.com/7e67a54b-f72d-4459-ae83-212bc774bf11_560x752.png_preview.webp",
        "https://ai-image.weshop.com/2722ba48-a8e2-4e39-a80f-6dc994869147_776x1056.png_preview.webp",
        "https://ai-image.weshop.com/156740a9-aa98-469f-a656-4b72ba74a2a6_560x704.png_preview.webp",
        "https://ai-image.weshop.com/a1367049-dab6-4e8b-8868-35e7f390246f_856x1144.png_preview.webp",
        "https://ai-image.weshop.com/7e67a54b-f72d-4459-ae83-212bc774bf11_560x752.png_preview.webp",
        "https://ai-image.weshop.com/7e67a54b-f72d-4459-ae83-212bc774bf11_560x752.png_preview.webp",
        "https://ai-image.weshop.com/2722ba48-a8e2-4e39-a80f-6dc994869147_776x1056.png_preview.webp",
        "https://ai-image.weshop.com/156740a9-aa98-469f-a656-4b72ba74a2a6_560x704.png_preview.webp",
        "https://ai-image.weshop.com/a1367049-dab6-4e8b-8868-35e7f390246f_856x1144.png_preview.webp",
        "https://ai-image.weshop.com/7e67a54b-f72d-4459-ae83-212bc774bf11_560x752.png_preview.webp",
      ],
    };
  },
  computed: {
    containerStyle() {
      return {
        backgroundColor: this.flag ? "transparent" : "rgba(0, 0, 0, 0.45)",
      };
    },
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