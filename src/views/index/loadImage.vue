<template>
  <div>
    <div class="grid-container">
      <div
        class="grid-column"
        v-for="(column, colIndex) in columns"
        :key="colIndex"
      >
        <div
          class="grid-item"
          v-for="(image, imgIndex) in column"
          :key="imgIndex"
        >
          <img :src="image.src" :alt="image.alt" />
        </div>
      </div>
    </div>
    <div id="sentinel"></div>
    <infinite-loading @infinite="loadMore">
      <template slot="no-more">
        <div class="custom-no-more">没有更多数据了</div>
      </template>
    </infinite-loading>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";

export default {
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      columns: [[], [], [], [], [], []], // 假设初始有6列
      allImages: [
        {
          src: require("@/assets/indexImage/首页-未登录-image8.png"),
          alt: "Image 1",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image9.png"),
          alt: "Image 2",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image10.png"),
          alt: "Image 3",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image11.png"),
          alt: "Image 1",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image12.png"),
          alt: "Image 2",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image13.png"),
          alt: "Image 3",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image14.png"),
          alt: "Image 1",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image15.png"),
          alt: "Image 2",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image16.png"),
          alt: "Image 3",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image17.png"),
          alt: "Image 1",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image18.png"),
          alt: "Image 2",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image19.png"),
          alt: "Image 3",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image20.png"),
          alt: "Image 1",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image21.png"),
          alt: "Image 2",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image22.png"),
          alt: "Image 3",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image23.png"),
          alt: "Image 2",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image24.png"),
          alt: "Image 3",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image25.png"),
          alt: "Image 1",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image26.png"),
          alt: "Image 2",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image27.png"),
          alt: "Image 3",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image28.png"),
          alt: "Image 3",
        },
        {
          src: require("@/assets/indexImage/首页-未登录-image29.png"),
          alt: "Image 3",
        },
        // ... 更多图片
      ],
      page: 0,
      perPage: 6,
      hasMore: true,
    };
  },
  methods: {
    loadMore($state) {
      if (!this.hasMore) {
        $state.complete();
        return;
      }

      const start = this.page * this.perPage;
      const end = start + this.perPage;
      const newImages = this.allImages.slice(start, end);

      if (newImages.length < this.perPage) {
        this.hasMore = false;
        $state.complete();
      }

      // 将新图片分配到列中
      newImages.forEach((image, index) => {
        const columnIndex =
          (this.page * this.perPage + index) % this.columns.length;
        this.columns[columnIndex].push(image);
      });

      this.page += 1;
      $state.loaded();
    },
    setupObserver() {
      const sentinel = document.querySelector("#sentinel");
      if (!sentinel) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            this.loadMore();
          }
        },
        { threshold: 1.0 }
      );
      observer.observe(sentinel);
    },
  },
  mounted() {
    this.setupObserver();
    this.loadMore({ complete: () => {} }); // 初次加载
  },
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px; /* 图片间的间隙 */
  padding: 10px;
}

.grid-item {
  margin-bottom: 20px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
}

.grid-item img {
  width: 100%;
  height: auto;
  display: block;
}
.custom-no-more {
  font-size: 16px;
  color: #666;
}

/* 响应式设计：调整列数 */
@media (max-width: 1200px) {
  .grid-container {
    flex-wrap: wrap;
  }
  .grid-column {
    flex-basis: 16%;
  }
}

@media (max-width: 900px) {
  .grid-container {
    flex-wrap: wrap;
  }
  .grid-column {
    flex-basis: 20%;
  }
}

@media (max-width: 600px) {
  .grid-container {
    flex-wrap: wrap;
  }
  .grid-column {
    flex-basis: 30%;
  }
}

@media (max-width: 400px) {
  .grid-container {
    flex-wrap: wrap;
  }
  .grid-column {
    flex-basis: 45%;
  }
}
</style>
