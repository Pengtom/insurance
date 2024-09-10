<template>
  <div>
    <div class="radio-group-container">
      <el-radio-group v-model="radio">
        <el-radio-button :label="0">室内设计</el-radio-button>
        <el-radio-button :label="1">建筑外观</el-radio-button>
      </el-radio-group>
    </div>
    <div style="padding: 0 10px">
      <div class="container">
        <div class="slider-container">
          <label for="iteration-slider" class="slider-label"> 迭代步数 </label>
          <el-slider
            id="iteration-slider"
            v-model="steps"
            :step="1"
            :min="1"
            :max="60"
          >
          </el-slider>
          <div class="slider-value">当前步数: {{ steps }}</div>
        </div>
        <div class="slider-container" v-if="radio === 0">
          <label class="slider-label"> lora模型 </label>
          <div class="loras">
            <div v-for="(lora, index) in loras" :key="index" class="lora-item">
              <div class="counter-controls" v-if="loraIndex === lora.id">
                <div class="counter-button" @click="decrement">-</div>
                <div>权重{{ loraWeight }}</div>
                <div class="counter-button" @click="increment">+</div>
              </div>
              <img
                :src="lora.modelImage"
                width="90"
                height="90"
                class="lora-image"
                :class="{ outline: loraIndex === lora.id }"
                @click="handleClick(lora.id)"
              />
              <span class="model-name">{{ lora.modelName }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="container2">
        <div class="left-section">
          <div class="input-section">
            <label>场景描述</label>
            <el-input
              v-model="correct"
              type="textarea"
              placeholder="TIPS:场景描述请写场景以及位置等信息"
              :rows="16"
              :maxlength="1500"
              show-word-limit
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: 0,
      correct: "",
      steps: 25,
      loraIndex: null,
      loraWeight: 0,
      loras: [
        {
          id: 1,
          modelName: "清晰风格.safetensors",
          modelImage:
            "https://ai-image.weshop.com/403df960-8ac8-47c1-bdff-3e90681d855f_1024x1024.png_256x256.jpeg",
        },
        {
          id: 2,
          modelName: "清晰风格.safetensors",
          modelImage:
            "https://ai-image.weshop.com/2bc446c7-3283-41cb-b5e2-6b2fbae36680.png_256x256.jpeg",
        },
      ],
    };
  },
  methods: {
    handleClick(id) {
      if (this.loraIndex === id) {
        this.loraIndex = null;
      } else {
        this.loraWeight = 0.6;
        this.loraIndex = id;
      }
    },
    increment() {
      if (this.loraWeight < 1) {
        this.loraWeight = Math.max(
          parseFloat((this.loraWeight + 0.1).toFixed(1)),
          0
        );
      } else {
        this.$message({
          message: "❌ 权重在0~1之间 ❗",
          type: "",
        });
      }
    },
    decrement() {
      if (this.loraWeight > 0) {
        this.loraWeight = Math.max(
          parseFloat((this.loraWeight - 0.1).toFixed(1)),
          0
        );
      } else {
        this.$message({
          message: "❌ 权重在0~1之间 ❗",
          type: "",
        });
      }
    },
  },
  watch: {
    radio(newval) {
      this.$emit("radioval", newval);
    },
    steps(newVal) {
      this.$emit("stepsVal".newVal);
    },
    correct(newVal) {
      this.$emit("correctval", newVal);
    },
    loraIndex(newVal) {
      const lora = this.loras.find(lora => lora.id === newVal)
      this.$emit("loraIndexVal", {
        loraIndex: lora.modelName,
        loraWeight: this.loraWeight,
      });
    },
    loraWeight(newVal) {
      const lora = this.loras.find(lora => lora.id === this.loraIndex)
      this.$emit("loraIndexVal", {
        loraIndex: lora.modelName,
        loraWeight: newVal,
      });
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
  outline: 2px solid #7530fe;
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
.slider-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 2%;
}
.loras {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 20px;
}
.lora-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  color: #7d7675;
  padding: 0;
  margin-top: 10%;
}
.counter-controls {
  display: flex;
  position: absolute;
  width: 90%;
  color: #fff;
  justify-content: space-evenly;
  top: 70px;
  font-size: 12px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.counter-button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 16px;
  width: 15px;
  height: 15px;
}
.lora-image {
  border-radius: 15px;
  object-fit: cover;
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
