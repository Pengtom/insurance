<template>
  <div class="left-container">
    <div class="left">
      <div class="sticky-header">
        <h2>{{ context.title }}</h2>
        <p>{{ context.content }}</p>
        <el-button type="primary" @click="addTask" class="new-task-button">
          新建任务
        </el-button>
      </div>
      <div class="tasks">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="task"
          :class="{ active: task.id === currentTaskId }"
          @click="openDrawer(task.id)"
        >
          <div class="task-info">
            <img
              class="task-image"
              width="50"
              height="50"
              decoding="async"
              src="task.uploadedImage || task.imagesrc"
            />
            <div class="task-details">
              <span class="task-tag">任务-{{ task.id % 10000000 }}</span>
              <div class="task-status">未启动</div>
            </div>
          </div>
          <div class="task-options" @click="toggleOptions">
            <img
              class="more-options-icon"
              loading="lazy"
              width="14"
              height="4"
              decoding="async"
              src="https://www.weshop.com/_next/image?url=%2Fmore-horizontal.png&w=16&q=75"
            />
          </div>
          <transition name="fade">
            <div v-if="task.showOptions" class="options-dropdown">
              <i class="el-icon-delete"></i>
              <button @click="deleteTask(task.id)">删除</button>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <!-- 抽屉组件 -->
    <el-drawer
      :visible.sync="isDrawerVisible"
      title="任务详情"
      :direction="'ltr'"
      :modal="false"
      class="el-drawer"
      size="100%"
      @close="handleDrawerClose"
    >
      <transition name="fade-in-out" mode="out-in">
        <div class="drawer-content">
          <div class="drawer-header">
            <div>
              <div class="model-label">模型</div>
              <el-select
                v-model="currentTask.checkpoint"
                placeholder="CHECKPOINT"
              >
                <el-option label="ChilloutMix" value="ChilloutMix"></el-option>
              </el-select>
            </div>
            <div>
              <div class="model-label">VAE模型</div>
              <el-select v-model="currentTask.vae" placeholder="VAE">
                <el-option label="自动" value="auto"></el-option>
              </el-select>
            </div>
            <div>
              <div class="model-label">终止次数</div>
              <el-select v-model="currentTask.clipSkip" placeholder="Clip Skip">
                <el-option label="1" value="1"></el-option>
              </el-select>
            </div>
          </div>
          <div class="drawer-body">
            <div class="drawer-column">
              <h3>请输入正向咒语</h3>
              <el-input
                type="textarea"
                v-model="currentTask.prompt"
                :rows="16"
                :maxlength="1500"
                placeholder="Write your prompt"
                show-word-limit
              />
            </div>
            <div class="drawer-column">
              <h3>请输入反向咒语</h3>
              <el-input
                type="textarea"
                :rows="16"
                :maxlength="1500"
                placeholder="Write your Negative prompt"
                show-word-limit
              />
            </div>
          </div>
        </div>
      </transition>
      <div style="padding: 0 3% 5% 2%">
        <div class="slider-container">
          <label class="slider-label"> lora模型 </label>
          <div class="loras">
            <div v-for="(lora, index) in loras" :key="index" class="lora-item">
              <div class="counter-controls">
                <div class="counter-button" @click="decrement(lora)">-</div>
                <div>权重{{ lora.weight }}</div>
                <div class="counter-button" @click="increment(lora)">+</div>
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
        <div class="slider-container">
          <label for="iteration-slider" class="slider-label"> 迭代步数 </label>
          <el-slider
            id="iteration-slider"
            v-model="value1"
            :step="10"
            :min="0"
            :max="100"
          >
          </el-slider>
          <div class="slider-value">当前步数: {{ value1 }}</div>
        </div>
        <div class="size-generator">
          <label for="iteration-slider" class="slider-label"> 选择尺寸 </label>
          <div class="size-selection">
            <div
              v-for="(size, index) in sizes"
              :key="size.value"
              class="size-option"
              :class="{ outline: selectedSize === index }"
            >
              <div @click="selectSize(index)" class="size-preview">{{ size.label }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="fixed-bottom">
        <div class="info-text">
          本次任务将消耗
          <span style="margin-right: 4px; color: #7530fe"
            >{{ 10 * quantity }}算力点</span
          >
        </div>
        <div class="button-container">
          <el-button class="execute-button" @click="txt2img">执行</el-button>
          <div class="settings-container">
            <div class="settings-image" @click="openSelectFlag">
              <img
                width="16"
                height="16"
                src="https://www.weshop.com/ic_agent_setting.svg"
              />
            </div>
            <div class="modal-container" v-if="selectFlag">
              <img
                width="44"
                height="44"
                class="close-icon"
                src="https://www.weshop.com/ic_modal_close.svg"
                @click="openSelectFlag"
              />
              <div class="count-settings">
                <div class="placeholder"></div>
                <div class="count-options-container">
                  <p class="count-label">生成张数</p>
                  <div class="count-options">
                    <div
                      class="count-option"
                      :class="{ selected: quantity === 1 }"
                      @click="selectNum(1)"
                    >
                      1
                    </div>
                    <div
                      class="count-option"
                      :class="{ selected: quantity === 2 }"
                      @click="selectNum(2)"
                    >
                      2
                    </div>
                    <div
                      class="count-option"
                      :class="{ selected: quantity === 4 }"
                      @click="selectNum(4)"
                    >
                      4
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import left from "./left";
export default {
  ...left,
  components: {},
};
</script>

<style scoped>
.left-container {
  width: 20%;
  height: 100%;
  border-right: 1px solid #ccc;
  overflow: hidden; /* 隐藏外部滚动条 */
  background-color: white;
}

.left {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border-right: 1px #e3e3e3 solid;
}

.sticky-header {
  position: sticky;
  top: 0;
  background-image: url("https://www.weshop.com/bg_tip_aimodel.webp");
  background-repeat: no-repeat;
  background-size: 100% auto;
  padding: 10px; /* 让内容不贴边 */
  z-index: 1; /* 确保 header 在其他内容之上 */
}

.new-task-button {
  margin-left: 5%;
  margin-bottom: 20px;
  width: 90%;
  border-radius: 5px;
}

.tasks {
  overflow-y: auto; /* 允许垂直滚动 */
  flex: 1; /* 填满剩余空间 */
  padding: 0 10px; /* 内边距调整 */
  scrollbar-width: none;
}

.task {
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  height: 70px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.task.active {
  background-color: #f5f7fd;
}

.task-info {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
}

.task-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px; /* 为了让图片和文字之间有间距 */
}

.task-details {
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: left;
}

.task-tag {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #333;
}

.task-status {
  color: #7530fe;
  font-size: 12px;
  line-height: 17px;
}

.task-options {
  margin-left: auto; /* 将更多选项图标推到右边 */
  cursor: pointer;
}

.options-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 10px;
  z-index: 10;
}

.options-dropdown button {
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 14px;
}

.more-options-icon {
  width: 14px;
  height: 4px;
  cursor: pointer;
}

h2 {
  margin-left: 10px;
  margin-bottom: 10px;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8);
}

p {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
  margin-left: 10px;
  margin-bottom: 20px;
}

.el-drawer {
  position: absolute;
  left: 20%;
  padding: 0;
  width: 50vw !important;
  background: rgba(7, 18, 26, 0.8);
  font-size: 16px;
  transition: transform 0.1s linear, opacity 0.1s linear;
  -webkit-box-shadow: none;
  box-shadow: none;
  background-color: white;
}

::v-deep .el-drawer__body {
  scrollbar-width: none;
}

.drawer-content {
  padding: 20px 20px 0 20px;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.model-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}
.drawer-body {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 20px;
  margin-top: 5%;
  margin-bottom: 20px;
  height: 350px;
}

.drawer-column {
  width: 48%;
  background: rgba(4, 17, 51, 0.05);
  padding: 10px;
  border-radius: 8px;
  height: 100%;
}

.drawer-column h3 {
  font-size: 16px;
  color: #888;
  margin-bottom: 10px;
}
::v-deep .el-textarea {
  height: 300px;
}
::v-deep .el-textarea__inner {
  height: 250px;
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
/* 过渡效果 */
.fade-in-out-enter-active,
.fade-in-out-leave-active {
  transition: opacity 0.3s ease;
}

.fade-in-out-enter,
.fade-in-out-leave-to {
  opacity: 0;
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
.outline {
  outline: 2px solid #7530fe;
}
.slider-label {
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
  color: #403d3c;
  margin-bottom: 5px;
}

.el-slider {
  margin-left: 2%;
  margin-bottom: 10px; /* 滑块和下方文本之间的间距 */
}
.slider-value {
  font-size: 14px;
  color: #555;
}
.size-selection {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 3%;
}
.size-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
}
.size-preview {
  width: 80%;
  height: 60px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #7530fe;
}


.fixed-bottom {
  background-color: #fff;
  display: flex;
  justify-content: space-between; /* 确保两个 div 在水平方向上分开 */
  align-items: center; /* 垂直居中对齐 */
  border-top: 1px solid #eee;
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 60px;
  text-align: center;
  padding: 10px;
  z-index: 1002;
}
.info-text {
  font-size: 14px;
  color: #333;
}
.button-container {
  display: flex;
  align-items: center;
  width: 286px;
  height: 44px;
}
.execute-button {
  font-weight: 500;
  flex: 1 1 0%;
  border-radius: 10px;
  background-color: #7530fe;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.settings-container {
  width: 40px;
  height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  background-color: #f5f7fd;
  margin-left: 8px;
}
.settings-image {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  background-color: #f5f7fd;
}
.modal-container {
  position: absolute;
  width: 476px;
  right: 4px;
  bottom: 48px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  z-index: 2;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
}
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
.count-settings {
  flex: 1 1;
  overflow-y: scroll;
  padding: 0 24px;
  margin-top: 16px;
  gap: 24px;
  display: flex;
  flex-direction: column;
}
.count-options-container {
  width: 100%;
}
.count-label {
  margin: 0;
  margin-bottom: 8px;
  font-size: 12px;
  line-height: 17px;
  font-weight: 500;
}
.count-options {
  width: 100%;
  display: flex;
  cursor: pointer;
  flex-wrap: wrap;
  gap: 12px 6px;
}
.count-option {
  padding: 4px 18px;
  border-radius: 100px;
  border: 1px solid #e3e3e3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #97a0b4;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.overlay-image {
  object-fit: contain;
}
.selected {
  border: 1px solid #7530fe;
}
</style>
