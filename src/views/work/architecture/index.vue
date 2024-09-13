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
      @load-more="loadMoreImages"
      @updateStatus="handleUpdateStatus"
    />
  </div>
</template>

<script>
import Left from "./left.vue";
import Right from "../right.vue";
import work from "../mixins/work";
export default {
  mixins: [work],
  data() {
    return {
      context: {
        title: "建筑外观",
        content:
          "轻松生成多样化的AI数字人模特和专业电商拍摄场景，可适应全球各地市场需求，高效展示商品。",
      },
      images: [
        "https://tse4.mm.bing.net/th/id/OIP.2_kpG99JOiWbA-74sOSYLQHaEc?w=290&h=180&c=7&r=0&o=5&pid=1.7",
        "https://tse1.mm.bing.net/th/id/OIP.QEQ81qwRY_oOJ3GCEr-AVQHaEg?w=285&h=180&c=7&r=0&o=5&pid=1.7",
        "https://tse3.mm.bing.net/th/id/OIP.B7zNTGqc-cXlnPRx9hCwlQHaEJ?w=330&h=186&c=7&r=0&o=5&pid=1.7",
        "https://tse4.mm.bing.net/th/id/OIP.2_kpG99JOiWbA-74sOSYLQHaEc?w=290&h=180&c=7&r=0&o=5&pid=1.7",
        "https://tse1.mm.bing.net/th/id/OIP.QEQ81qwRY_oOJ3GCEr-AVQHaEg?w=285&h=180&c=7&r=0&o=5&pid=1.7",
        "https://tse4.mm.bing.net/th/id/OIP.D4iVQe1dYDeW4Z4gTDPvSgHaFf?w=277&h=205&c=7&r=0&o=5&pid=1.7",
      ],
    };
  },
  components: {
    Left,
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