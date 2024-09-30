<template>
  <div class="right-container" v-show="flag">
    <div class="inner-wrapper" v-if="!isSuccess">
      <div class="content-wrapper">
        <div class="section">
          <div class="sub-section">
            <div class="title-wrapper">
              <div class="title">
                <p>优秀案例</p>
              </div>
            </div>
          </div>
        </div>
        <div id="img-content" class="img-content">
          <Waterfall :list="images" :width="250">
            <template #item="{ item }">
              <div class="card">
                <LazyImg class="img" :url="item.url" />
              </div>
            </template>
          </Waterfall>
        </div>
        <div v-if="!hasMore" class="no-more-data">没有更多数据了</div>
      </div>
    </div>
    <success
      v-if="isSuccess"
      :currentTask="currentTask"
      @updateProjetStatus="loadImageSuccess"
    />
  </div>
</template>

<script>
import success from "./success.vue";
import { LazyImg, Waterfall } from "vue-waterfall-plugin";
import "vue-waterfall-plugin/dist/style.css";
export default {
  props: {
    images: Array,
    hasMore: Boolean,
    isSuccess: Boolean,
    flag: Boolean,
    currentTask: Object,
  },
  components: {
    success,
    LazyImg,
    Waterfall,
  },
  data() {
    return {
      breakpoints: {
        1000: {
          // 当容器宽度 < 1200
          rowPerView: 4,
        },
      },
    };
  },
  methods: {
    loadImageSuccess() {
      this.$emit("updateStatus");
    },
  },
};
</script>

<style scoped>
.right-container {
  height: 100%;
  width: 80%;
  scrollbar-width: none;
  overflow-y: auto;
}
.inner-wrapper {
  width: 100%;
  height: 100%;
}
.content-wrapper {
  width: 100%;
  height: 100%;
  /* overflow: scroll; */
  scrollbar-width: none;
}
.section {
  position: sticky;
  display: flex;
  width: 100%;
  background-color: #fff;
  z-index: 50;
  padding-top: 10px;
  top: 0;
}
.sub-section {
  color: #97a0b4;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgb(240, 240, 240);
}
.title-wrapper {
  position: relative;
  display: flex;
  flex: none;
  align-items: center;
  width: 100% !important;
  box-sizing: border-box;
  padding-left: 50px;
  margin: 0 !important;
}
.title {
  position: relative;
  display: flex;
  flex: auto;
  align-self: stretch;
  overflow: hidden;
  white-space: nowrap;
  transform: translate(0);
  width: 100% !important;
  box-sizing: border-box;
  font-size: 30px;
  line-height: 0;
  color: #555555;
}

.img-content {
  width: 100%;
  margin-top: 10px;
  position: relative;
}
.img {
  border-radius: 12px;
}
.no-more-data {
  text-align: center;
  font-size: 14px;
  position: absolute; /* Position at the bottom of the content-wrapper */
  bottom: 10px;
  left: 0;
  width: 100%;
}
</style>
