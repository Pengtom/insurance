<template>
  <div class="container">
    <left :context="context" @data = "handle"/>
    <right :images="images" :flag="flag"/>
  </div>
</template>

<script>
import Left from "../model/left.vue";
import Right from "../right.vue";
export default {
  data() {
    return {
      flag : true,
      context: {
        title: "AI商品",
        content:
          "轻松生成多样化的AI数字人模特和专业电商拍摄场景，可适应全球各地市场需求，高效展示商品。",
      },
      images: [
        "http://localhost:10086/images/chanp1-s.png",
        "http://localhost:10086/images/chanp3-s.png",
        "http://localhost:10086/images/chanp2-s.png",
        "http://localhost:10086/images/chanp4-s.png",
        "http://localhost:10086/images/chanp4-s.png",
        "http://localhost:10086/images/chanp4-s.png",
      ],
    };
  },
  components: {
    Left,
    Right,
  },
  methods:{
    handle(newdata){
      this.flag = !newdata
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 90vh;
}
</style>