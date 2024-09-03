<template>
  <div class="task-wrapper">
    <div class="task-content">
      <div class="task-header">
        <div class="task-header-inner">
          <img
            :src= currentTask.image
            alt=""
            width="54"
            height="54"
            class="task-image"
          />
          <div class="task-info-wrapper">
            <div class="task-title">
              <div>{{ currentTask.name }}</div>
            </div>
          </div>
        </div>
        <div style="width: 100%">
          <div class="task-details">
            <div class="task-details-inner">
              <div class="task-info">
                <div class="task-info-inner">
                  <div class="task-info-content">
                    <!-- <div class="task-info-content-inner">
                      <img
                        src="https://ai-image.weshop.com/71bf8823-5df5-4cab-b008-9a3d7387f4c2_1200x1200.png"
                        width="26"
                        height="26"
                        class="task-info-image"
                      />
                      <div
                        class="task-assignee"
                        style="padding-left: 19px !important"
                      >
                        波莉娜
                      </div>
                      <div class="task-assignee">自由发挥</div>
                      <div class="task-assignee">巷子</div>
                    </div> -->
                  </div>
                </div>
                <div class="task-status">
                  <span style="margin-right: 10px">执行成功</span>
                  <span style="margin-left: 10px">2024-08-08 11:33:19</span>
                </div>
              </div>
              <div>
                <div class="image-container">
                  <div v-if="isLoading">
                    <div class="loading-spinner">
                      <div class="loading-text"></div>
                    </div>
                  </div>
                  <div v-for="(item, index) in image" :key="index">
                    <div class="image-content">
                      <div class="image-content-inner">
                        <div class="image-final" style="width: 252px">
                          <div v-if="!item.imageUrl" class="loading-spinner">
                            <div class="loading-text"></div>
                          </div>
                          <img
                            v-else
                            :src="item.imageUrl"
                            width="252"
                            class="image-src"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryImagesByProjectId } from "@/api/zhiqi/projectImage";
export default {
  props: {
    currentTask: Object,
  },
  data() {
    return {
      image: [], // 初始化 image 为 null
      intervalId: null,
      isLoading: true,
    };
  },
  methods: {
    async loadImage() {
      this.intervalId = setInterval(async () => {
        try {
          const res = await queryImagesByProjectId(this.currentTask.id);
          if (res && Array.isArray(res.data)) {
            const allImagesHaveUrl = res.data.every((item) => item.imageUrl);
            console.log(allImagesHaveUrl);

            if (allImagesHaveUrl) {
              this.image = res.data;
              this.isLoading = false;
              clearInterval(this.intervalId);
            } else {
              this.image = res.data;
              this.isLoading = false
            }
          }
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }, 5000);
    },
  },
  watch: {
    currentTask: {
      immediate: true, // 使得在组件首次加载时也会触发
      handler() {
        this.image = [];
        this.isLoading = true
        clearInterval(this.intervalId);
        this.loadImage();
      },
    },
  },
   beforeDestroy() {
    console.log(this.intervalId);
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
</script>

<style scoped>
.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 5px solid #3498db;
  animation: spin 1s linear infinite;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.task-wrapper {
  height: 100%;
  background-color: #fff;
  position: relative;
}
.task-content {
  width: 100%;
  height: 100%;
}
.task-header {
  width: 100%;
  height: 100%;
  /* overflow: scroll; */
  min-width: 584px;
}
.task-header-inner {
  position: sticky;
  min-height: 90px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 18px 30px;
  top: 0;
  border-bottom: 1px solid #e3e3e3;
  z-index: 50;
}
.task-image {
  border-radius: 8px;
  object-fit: cover;
  margin-right: 18px;
}
.task-info-wrapper {
  display: flex;
  justify-content: left;
  flex-direction: column;
}
.task-title {
  display: flex;
  align-items: center;
  color: #333;
  font-weight: 500;
  font-size: 18px;
  line-height: 25px;
}
.task-details {
  width: 100%;
  max-width: 1136px;
  padding-bottom: 180px;
  padding-top: 10px;
}
.task-details-inner {
  padding-top: 30px;
  padding-left: 20px;
}
.task-info {
  width: 100%;
  padding-left: 8px;
  padding-right: 30px;
}
.task-info-inner {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 20px 0;
}
.task-info-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 0;
}
.task-info-content-inner {
  display: flex;
  align-items: center;
}
.task-info-image {
  margin-right: -13px;
  z-index: 1;
  border-radius: 50%;
  display: inline-block;
  object-fit: cover;
}
.task-assignee {
  background-color: #f5f7fd;
  border-radius: 6px;
  padding: 3px 10px;
  color: #333;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
  font-size: 14px;
  line-height: 20px;
}
.task-status {
  color: #b8b2b2;
  margin-top: 6px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 20px;
}
.image-container {
  width: 100%;
  min-height: 400px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
}
.image-content {
  width: 252px;
  border-radius: 20px;
  margin: 10px;
  position: relative;
}
.image-content-inner {
  position: relative;
  width: 252px;
  /* background-color: #f5f7fd; */
  border-radius: 20px;
}
.image-final {
  position: relative;
  display: inline-block;
  font-size: 14px;
  box-sizing: border-box;
}
.image-src {
  width: 100%;
  height: auto;
  vertical-align: middle;
  border-radius: 20px;
}
</style>