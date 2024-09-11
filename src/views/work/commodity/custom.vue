<template>
  <div>
    <div class="radio-group-container">
      <span style="margin-right: 10px; font-size: 14px">是否开启提示词</span>
      <el-switch v-model="switchValue"> </el-switch>
      <!-- <el-radio-group v-model="radio">
        <el-radio-button :label="0">推荐</el-radio-button>
        <el-radio-button :label="1">自定义</el-radio-button>
      </el-radio-group> -->
    </div>
    <div style="padding: 0 10px">
      <!-- <div class="container" v-if="radio === 0">
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
            </div>
          </div>
        </div>-->
      <div class="store-scenes">
        <p>商拍场景</p>
        <div class="scenes-grid">
          <div v-for="(scene, index) in scenes" :key="index" class="scene-item">
            <img
              :src="scene.modelImage"
              alt="scene"
              width="90"
              height="90"
              class="scene-image"
              :class="{ outline: sceneIndex === scene.id }"
              @click="handleClick(scene.id)"
            />
            <span>{{ scene.modelName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="container2" v-if="switchValue">
      <div class="left-section">
        <div class="input-section">
          <label>场景描述</label>
          <el-input
            v-model="correct"
            type="textarea"
            placeholder="TIPS:场景描述请写场景以及位置等信息
例如：一杯牛奶放在餐桌上，清晨，温馨"
            :rows="16"
            :maxlength="1500"
            show-word-limit
          />
        </div>
      </div>
      <!-- <div class="right-section">
        <div class="input-section">
          <label>不希望出现的内容</label>
          <el-input
            v-model="reverse"
            type="textarea"
            placeholder="请输入不希望出现的内容"
            :rows="16"
            maxlength="1500"
            show-word-limit
          />
        </div>
      </div> -->
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
      openValue: 0,
      correct: "",
      reverse: "",
    };
  },
  computed: {
    switchValue: {
      get() {
        return this.openValue === 1;
      },
      set(val) {
        this.openValue = val ? 1 : 0;
      },
    },
  },
  mounted() {
    queryListModel(1, 1).then((res) => {
      this.scenes = res.data;
      console.log(res);
    });
  },
  methods: {
    handleClick(id) {
      if (this.sceneIndex === id) {
        this.sceneIndex = null;
        this.$emit("sceneId", this.sceneIndex);
      } else {
        this.sceneIndex = id;
        this.$emit("sceneId", this.sceneIndex);
      }
    },
  },
  watch: {
    openValue(newval) {
      this.$emit("openSwitch", newval);
    },
    correct(newVal) {
      this.$emit("correctval", newVal);
    },
    reverse(newVal) {
      this.$emit("reverseVal", newVal);
    },
  },
};
</script>

<style scoped>
.radio-group-container {
  display: flex;
  padding: 0 30px;
}
::v-deep label {
  display: inline-block !important;
}
.container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
}

.ai-models,
.store-scenes {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  padding: 0 20px;
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
