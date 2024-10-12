<template>
  <div class="task-wrapper">
    <div class="task-content">
      <div class="task-header">
        <div class="task-header-inner">
          <img
            :src="currentTask.image"
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
                  <div class="task-info-content"></div>
                </div>
                <div class="task-status">
                  <span style="margin-right: 10px">{{ success }}</span>
                </div>
              </div>
              <div>
                <div class="image-container">
                  <div v-for="(item, index) in images" :key="index">
                    <div
                      class="image-content"
                      @click="hidePreview(item.imageUrl)"
                    >
                      <div class="image-content-inner">
                        <div
                          class="image-final"
                          :style="{
                            width: '252px',
                            height: item.imageUrl ? 'auto' : '335px',
                          }"
                        >
                          <!-- <el-progress
                            v-if="!item.imageUrl"
                            type="circle"
                            :percentage="item.progress"
                            :stroke-width="1"
                            :width="60"
                          ></el-progress> -->
                          <div
                            v-if="!item.imageUrl && !item.queuePosition"
                            class="loading-spinner"
                          >
                            <div class="loading-text"></div>
                          </div>
                          <el-image
                            v-if="item.imageUrl"
                            :src="item.imageUrl"
                            width="252"
                            class="image-src"
                          >
                          </el-image>
                        </div>
                      </div>
                      <div
                        v-if="!item.imageUrl && item.queuePosition"
                        class="queue-position"
                      >
                        排在第 {{ item.queuePosition }} 位
                      </div>
                      <div v-else class="overlay">
                        <span>预览</span>
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
    <div
      v-if="showPreview"
      class="preview-overlay"
      @click="closePreview"
      tabindex="0"
      @keydown="handleEscKey"
      ref="previewOverlay"
    >
      <div class="close-btn">
        <img
          width="44"
          height="44"
          :src="require('@/assets/icons/1错误.png')"
        />
      </div>
      <div class="preview-content">
        <div class="preview-image-container left-image">
          <img
            :src="currentTask.image"
            alt="Large Image 1"
            class="preview-image"
          />
          <div class="image-label before-label">Before</div>
        </div>
        <div class="preview-image-container right-image">
          <img :src="currentImg" alt="Large Image 2" class="preview-image" />
          <div class="image-label after-label">After</div>
        </div>
        <div class="outer-container">
          <div class="inner-container">
            <div class="content-wrapper" @click="downloadImage">
              <img
                :src="require('@/assets/icons/2下载白.png')"
                width="24"
                height="24"
              />
              <div>下载大图</div>
            </div>
            <div
              style="width: 1px; height: 20px; background-color: #4f535a"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryImagesByProjectId,
  awaitQueue,
  queryImagesById,
} from "@/api/zhiqi/projectImage";
import { getParam } from "@/api/zhiqi/task";

export default {
  props: {
    currentTask: Object,
  },
  data() {
    return {
      images: [],
      showPreview: false,
      currentImg: "",
      success: "",
    };
  },
  computed: {
    allImagesLoaded() {
      return this.images.every((img) => img.imageUrl);
    },
  },
  async created() {
    await this.initializeTask();
  },
  methods: {
    async initializeTask() {
      try {
        const taskDetails = await getParam(this.currentTask.id);
        this.success = taskDetails.data;
        await this.loadImages();
      } catch (error) {
        console.error("Error initializing task:", error);
      }
    },
    async loadImages() {
      try {
        const imagesData = await queryImagesByProjectId(this.currentTask.id);
        this.images = imagesData.data.map((image) => ({
          ...image,
          queuePosition: null,
        }));
        this.monitorImageLoading();
      } catch (error) {
        console.error("Error loading images:", error);
      }
    },
    async monitorImageLoading() {
      if (!this.allImagesLoaded) {
        let anyImageUpdated = false;
        const imagesToUpdate = this.images.filter((image) => !image.imageUrl);

        // 使用 Promise.all 进行并行处理
        await Promise.all(
          imagesToUpdate.map(async (image) => {
            try {
              // 检查队列状态
              const queueRes = await awaitQueue(image.id);
              if (queueRes && queueRes.msg !== "未找到") {
                this.$set(image, "queuePosition", queueRes.msg);
              } else if (queueRes && queueRes.msg === "未找到") {
                this.$set(image, "queuePosition", "");

                // 查询图片数据
                const imageData = await queryImagesById(
                  this.currentTask.id,
                  image.id
                );
                if (imageData && imageData.data && imageData.data.imageUrl) {
                  this.$set(image, "imageUrl", imageData.data.imageUrl);
                  this.$emit("updateProjetStatus");
                  anyImageUpdated = true;
                }
              }
            } catch (error) {
              console.error(`Error processing image ID ${image.id}:`, error);
            }
          })
        );

        if (anyImageUpdated) {
          this.refreshQueueStatus();
        } else {
          this.scheduleNextPoll();
        }
      }
    },

    async refreshQueueStatus() {
      const imagesToUpdate = this.images.filter((img) => !img.imageUrl);

      // 使用 Promise.all 并行更新队列状态
      await Promise.all(
        imagesToUpdate.map(async (image) => {
          try {
            const queueRes = await awaitQueue(image.id);
            if (queueRes && queueRes.msg !== "未找到") {
              this.$set(image, "queuePosition", queueRes.msg);
            }
          } catch (error) {
            console.error(
              `Error refreshing queue status for image ID ${image.id}:`,
              error
            );
          }
        })
      );

      this.scheduleNextPoll();
    },

    scheduleNextPoll() {
      setTimeout(() => this.monitorImageLoading(), 2000);
    },

    async downloadImage() {
      try {
        const filename = this.currentImg.substring(
          this.currentImg.lastIndexOf("/") + 1
        );
        const response = await fetch(this.currentImg);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error downloading the image:", error);
      }
    },
    hidePreview(img) {
      if (!img) {
        this.$message({
          message: "❌ 图片正在生成中 ❗",
          type: "",
        });
        return;
      }
      this.currentImg = img;
      this.showPreview = !this.showPreview;
      this.$nextTick(() => {
        this.$refs.previewOverlay.focus();
      });
    },
    handleEscKey(event) {
      if (event.key == "Escape") {
        this.showPreview = false;
      }
    },
    closePreview() {
      this.showPreview = false;
    },
  },
  watch: {
    currentTask: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.initializeTask();
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.loading-spinner {
  position: absolute;
  top: 40%;
  left: 40%;
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
  display: flex;
  flex-direction: column;
  align-items: center;
}
.image-content-inner {
  position: relative;
  width: 252px;
  background-color: #f5f7fd;
  border-radius: 20px;
}
.image-final {
  position: relative;
  display: inline-block;
  font-size: 14px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-src {
  width: 100%;
  height: auto;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 20px;
}
.image-content:hover .overlay {
  opacity: 1;
}
.queue-position {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: opacity 0.3s;
  z-index: 1;
  border-radius: 20px;
  font-size: 16px;
  line-height: 22px;
  opacity: 0;
}

.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.3s ease, visibility 0.3s ease; /* 过渡效果 */
}
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
}
.preview-content {
  display: flex;
  justify-content: center;
  border-radius: 8px;
  padding: calc(10px + 2vw); // 边距根据屏幕分辨率调整

  @media (max-width: 768px) {
    padding: calc(10px + 5vw); // 更大边距
  }

  @media (min-width: 768px) {
    padding: calc(20px + 4vw);
  }

  @media (min-width: 1200px) {
    padding: calc(30px + 3vw);
  }

  @media (min-width: 1600px) {
    padding: calc(40px + 2vw);
  }
}

.preview-image-container {
  position: relative;
  flex: 1;
  max-width: 45%; // 确保两张图片在一行内显示

  .preview-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    transition: transform 0.3s ease; // 平滑放大效果
    transform: scale(1); // 调整放大比例
    max-width: 100vw; // 限制图片最大宽度
    max-height: 80vh; // 限制图片最大高度
  }

  .image-label {
    position: absolute;
    color: #fff;
    background: rgba(0, 0, 0, 0.6);
    padding: 5px 15px;
    border-radius: 8px;
    font-size: 12px;
  }

  .before-label {
    top: 5px;
    left: 5px;
  }

  .after-label {
    top: 5px;
    right: 5px;
  }
}
.outer-container {
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 10%;
  width: 100vw;
  transform: translateY(100%);
}
.inner-container {
  background-color: rgba(0, 0, 0, 0.7);
  height: 50px;
  border-radius: 30px;
  align-items: center;
  display: flex;
  padding: 0 12px;
}
.content-wrapper {
  color: #fff;
  padding: 0 16px;
  height: 40px;
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  font-size: 14px;
  line-height: 20px;
}
</style>