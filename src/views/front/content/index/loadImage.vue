<template>
  <Waterfall :list="allImages" :width="250">
    <template #item="{ item }">
      <div class="card">
        <LazyImg class="grid-item" :url="item.url" />
      </div>
    </template>
  </Waterfall>
</template>

<script>
import { list } from "@/api/zhiqi/image";
import { LazyImg, Waterfall } from "vue-waterfall-plugin";
import "vue-waterfall-plugin/dist/style.css";
export default {
  components: {
    LazyImg,
    Waterfall,
  },
  props: {
    selectedCategory: String,
  },
  data() {
    return {
      allImages: [],
    };
  },
  async mounted() {
    const res = await list(-1);
    this.allImages = res.data;
  },
  watch: {
    selectedCategory: {
      handler: async function (newValue, oldValue) {
        this.allImages = []
        const res = await list(newValue);
        this.allImages = res.data;
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped>
.grid-item {
  background: white;
  border-radius: 20px;
  overflow: hidden;
}
</style>
