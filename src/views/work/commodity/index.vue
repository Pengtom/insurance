<template>
  <div class="container">
    <commodity
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
    />
  </div>
</template>

<script>
import commodity from "./commodity.vue";
import Right from "../right.vue";
import work from "../mixins/work";
export default {
  mixins: [work],
  data() {
    return {
      context: {
        title: "AI商品",
        content:
          "轻松生成多样化的AI数字人模特和专业电商拍摄场景，可适应全球各地市场需求，高效展示商品。",
      },
      images: [
        "https://ai-image.weshop.com/a45b50c0-c64f-4dec-8a59-f9aa0073903c_560x720.png_preview.webp",
        "https://ai-image.weshop.com/90c8000f-7ddf-4879-99af-22f6365a69f1_1496x1496.png_preview.webp",
        "https://ai-image.weshop.com/b730a0f7-07f0-434a-82ae-ed299fca369e_736x736.png_preview.webp",
        "https://ai-image.weshop.com/0f8cf5d9-62a4-4b05-8957-0a57e9aa826d_560x640.png_preview.webp",
        "https://ai-image.weshop.com/cca04158-3f8a-4111-8206-036644e86fe8_560x704.png_preview.webp",
        "https://ai-image.weshop.com/9b9055a4-256f-4289-939e-10a6098f9af9_560x696.png_preview.webp",
        "https://ai-image.weshop.com/d6f5116d-5eae-4d83-a6bf-63757a568d42_560x1000.png_preview.webp",
        "https://ai-image.weshop.com/1ef599bc-437a-4630-925e-60c727cdaafd_560x784.png_preview.webp",
        "https://ai-image.weshop.com/e5a41033-073b-49c8-84ce-fdb828e4a11b_520x520.png_preview.webp",
        "https://ai-image.weshop.com/340ffa4b-dd1f-480a-b4d9-510ef633127e_560x840.png_preview.webp",
        "https://ai-image.weshop.com/21d4d569-de26-45d7-9543-3f67fee15272_560x560.png_preview.webp",
        "https://ai-image.weshop.com/223c326b-eade-4acb-87a1-10f7c8f17015_560x752.png_preview.webp",
        "https://ai-image.weshop.com/7b8e098e-1a31-46fa-8cf9-3096aaa5b018_920x1304.png_preview.webp",
      ],
    };
  },
  components: {
    commodity,
    Right,
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;
}
</style>