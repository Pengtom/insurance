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
      flag: true,
      context: {
        title: "AI换装",
        content:
          "轻松生成多样化的AI数字人模特和专业电商拍摄场景，可适应全球各地市场需求，高效展示商品。",
      },
      images: [
        "https://tse1.mm.bing.net/th/id/OIP.ovopO3VqtKIULmQmywBLYQHaGE?w=224&h=184&c=7&r=0&o=5&pid=1.7",
        "https://tse2.mm.bing.net/th/id/OIP.uJ8t6a5qJ7pBxGmom9L7ogHaFg?w=271&h=201&c=7&r=0&o=5&pid=1.7",
        "https://tse4.mm.bing.net/th/id/OIP.VCP3C2jlVkzH_TGhndvizAHaFj?w=253&h=190&c=7&r=0&o=5&pid=1.7",
        "https://tse2.mm.bing.net/th/id/OIP.fKXKO8siPlLfk7fkIg-xuwHaEn?w=284&h=180&c=7&r=0&o=5&pid=1.7",
        "https://tse2.mm.bing.net/th/id/OIP.cPkRFwOhIRFCm1SV3RkWOAHaEw?w=246&h=180&c=7&r=0&o=5&pid=1.7",
      ],
    };
  },
  components: {
    Left,
    Right,
  },
  methods: {
    handle(newdata) {
      this.flag = !newdata;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh
}
</style>