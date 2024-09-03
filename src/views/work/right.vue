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
          <img
            loading="lazy"
            class="img"
            v-for="(item, index) in images"
            :key="'img' + index"
            :data-src="item"
            :style="'width:' + imgWidth + 'px;'"
            ref="img"
          />
        </div>
        <div v-if="!hasMore" class="no-more-data">没有更多数据了</div>
      </div>
    </div>
    <success v-if="isSuccess" :currentTask="currentTask" />
  </div>
</template>

<script>
import success from "./success.vue";
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
  },
  updated() {
    if (!this.isSuccess) {
      this.$nextTick(() => {
        this.initLazyLoad();
        this.waterfallHandler();
      });
    }
  },
  data() {
    return {
      imgWidth: 240,
      imgMargin: 15,
    };
  },
  mounted() {
    this.initLazyLoad();
    window.addEventListener("resize", this.waterfallHandler);
    document
      .querySelector(".content-wrapper")
      .addEventListener("scroll", this.checkIfNeedMore);
  },
  methods: {
    waterfallHandler() {
      if (!this.images) {
        return;
      }
      this.$nextTick(() => {
        // 计算图片宽度和间隙
        const imgWidth = this.imgWidth + this.imgMargin;
        const contentW = document.getElementById("img-content").offsetWidth;
        const column = Math.floor(contentW / imgWidth);

        // 初始化每列的高度为0
        const heightArr = new Array(column).fill(0);

        // 获取所有图片元素
        const imgList = Array.from(document.getElementsByClassName("img"));

        // 使用 requestAnimationFrame 提升性能
        requestAnimationFrame(() => {
          imgList.forEach((item, index) => {
            // 计算图片高度（包括间隙）
            const itemHeight = item.offsetHeight + this.imgMargin;

            // 查找当前最短列
            const minHeight = Math.min(...heightArr);
            const minIndex = heightArr.indexOf(minHeight);

            // 设置图片的位置
            item.style.top = `${minHeight}px`;
            item.style.left = `${minIndex * imgWidth}px`;

            // 更新最短列的高度
            heightArr[minIndex] += itemHeight;
          });
        });
      });
    },
    checkIfNeedMore() {
      const container = document.querySelector(".content-wrapper");
      if (
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100
      ) {
        if (this.hasMore) {
          console.log("213131");

          this.$emit("load-more");
          this.initLazyLoad();
        }
      }
    },
    initLazyLoad() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.onload = () => {
                img.classList.add("loaded");
                this.waterfallHandler(); // 图片加载后重新计算布局
              };
              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: "200px 0px",
        }
      );

      Array.from(this.$refs.img).forEach((img) => {
        observer.observe(img);
      });
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
  height: 95%;
}
.content-wrapper {
  width: 100%;
  height: 100%;
  overflow: scroll;
  scrollbar-width: none;
}
.section {
  position: sticky;
  display: flex;
  width: 100%;
  background-color: #fff;
  z-index: 50;
  padding-top: 24px;
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
  font-size: 18px;
  line-height: 25px;
  color: rgba(0, 0, 0, 0.88);
}

.img-content {
  width: 100%;
  height: 1000px;
  margin-top: 15px;
  position: relative;
}
.img {
  position: absolute;
  vertical-align: top;
  margin: 10px;
  opacity: 0;
  transition: opacity 0.5s;
  border-radius: 12px;
}
.img.loaded {
  opacity: 1;
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
