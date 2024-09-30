<template>
  <div>
    <div style="padding: 0 10px">
      <div class="container">
        <!-- AI 模特部分 -->
        <div class="ai-models">
          <div class="header">
            <p>AI模特</p>
          </div>
          <div class="models-grid">
            <div
              v-for="(model, index) in models"
              :key="index"
              class="model-item"
            >
              <img
                :src="model.modelImage"
                alt="model"
                width="90"
                height="90"
                class="model-image"
                :class="{ outline: modelsIndex === model.id }"
                @click="handleClick(model.id)"
              />
              <span class="model-name">{{ model.modelName }}</span>
              <!-- <span v-if="model.new" class="new-tag">New</span> -->
            </div>
          </div>
        </div>

        <!-- 商店场景部分 -->
        <div class="store-scenes">
          <p>商拍场景</p>
          <div class="scenes-grid">
            <div
              v-for="(scene, index) in scenes"
              :key="index"
              class="scene-item"
            >
              <img
                :src="scene.modelImage"
                alt="scene"
                width="90"
                height="90"
                class="scene-image"
                :class="{ outline: sceneIndex === scene.id }"
                @click="handleSenceClick(scene.id)"
              />
              <span class="model-name">{{ scene.modelName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryListModel } from "@/api/zhiqi/model";
export default {
  data() {
    return {
      models: [],
      scenes: [],
      modelsIndex: "",
      sceneIndex: "",
    };
  },
  mounted() {
    queryListModel(0, 0).then((res) => {
      this.models = res.data;
      const image = {
        modelImage: require('@/assets/images/研发中2.png'),
        modelName: "研发中",
      };
      const image2 = {
        modelImage: require('@/assets/images/研发中3.png'),
        modelName: "研发中",
      };
      this.models = [...this.models, image, image2];
    });
    queryListModel(0, 1).then((res) => {
      this.scenes = res.data;
    });
  },
  methods: {
    handleClick(id) {
      if (!id) {
        this.$message({
          message: "❌ 敬请期待 ❗",
          type: "",
        });
        return;
      }
      if (this.modelsIndex === id) {
        this.modelsIndex = null;
        this.$emit("modelId", this.sceneIndex);
      } else {
        this.modelsIndex = id;
        this.$emit("modelId", this.modelsIndex);
      }
    },
    handleSenceClick(id) {
      if (this.sceneIndex === id) {
        this.sceneIndex = null;
        this.$emit("sceneId", this.sceneIndex);
      } else {
        this.sceneIndex = id;
        this.$emit("sceneId", this.sceneIndex);
      }
    },
  },
};
</script>

<style scoped>
.radio-group-container {
  display: flex;
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
}
::v-deep label {
  display: inline-block !important;
}
.container {
  display: flex;
  flex-direction: column;
}

.ai-models,
.store-scenes {
  background-color: #fff;
  border-radius: 8px;
  padding: 0 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.start-button {
  background-color: #6b5bff;
  border-color: #6b5bff;
}

.models-grid,
.scenes-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.model-item,
.scene-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  color: #7d7675;
  padding: 0;
  margin: 0;
}

.model-image,
.scene-image {
  border-radius: 20px;
  object-fit: cover;
}
.outline {
  outline: 2px solid #1890ff;
}
.model-name {
  color: #97a0b4;
  margin-top: 6px;
  max-width: 106px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  line-height: 17px;
  font-weight: 400;
}

.new-tag {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: red;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
}

.container2 {
  display: flex;
  justify-content: space-between; /* 确保左右对齐 */
  align-items: stretch; /* 保持两边高度一致 */
  gap: 20px; /* 两边之间的间距 */
  margin-top: 5%;
  height: 350px;
}

.left-section,
.right-section {
  flex: 1;
}

.input-section {
  background: #f5f7fd;
  padding: 10px;
  border-radius: 8px;
  height: 100%; /* 确保内部元素撑开整个容器的高度 */
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}
::v-deep .el-input--medium {
  height: 300px;
}
::v-deep .el-textarea__inner {
  height: 270px;
  background: transparent;
  border: none;
  resize: none;
}
::v-deep .el-input__count {
  background: transparent;
  border: none;
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  border-top: 1px solid #d9d9d9;
}
</style>
