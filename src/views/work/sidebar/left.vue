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
            <img class="task-image" width="50" height="50" decoding="async" :src="task.uploadedImage || task.imagesrc" />
            <div class="task-details">
              <span class="task-tag">任务-{{ task.id % 10000000 }}</span>
              <div class="task-status">未启动</div>
            </div>
          </div>
          <div class="task-options" @click="toggleOptions">
            <img class="more-options-icon" loading="lazy" width="14" height="4" decoding="async" src="https://www.weshop.com/_next/image?url=%2Fmore-horizontal.png&w=16&q=75" />
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
    <canvas id="imageCanvas"></canvas>
    <canvas id="maskCanvas"></canvas>
    <canvas id="resultCanvas"></canvas>
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
          <div v-if="currentTaskId !== null" key="currentTaskId" class="dialog-content">
            <div class="upload-section" v-if="!currentTask.uploadedImage">
              <el-upload
                class="upload-demo"
                :limit="1"
                drag
                action="#"
                v-loading="uploadingTaskId !== null"
                :http-request="handleUpload"
                :file-list="currentTask.fileList"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">点击上传或将图片拖入此区域</div>
                <div class="el-upload__tip" slot="tip">
                  文件不超过20mb，不支持gif/avif格式
                </div>
              </el-upload>
            </div>
            <template v-else>
                <div class="image-preview" >
                  <img
                    :src="currentTask.uploadedImage"
                    alt="Uploaded Image"
                    class="uploaded-image"
                    ref="uploadedImage"
                  
                  />
                  <p>原图</p>
                </div>
                <div class="image-preview image-preview2">
                    <img
                    :src="currentTask.maskImage"
                    class="uploaded-image"
                  />
                  <p v-if=currentTask.loading>选区图</p>
                  <p v-if=!currentTask.loading>
                    <a @click="dialogVisible = true" style="color:#7530fe;text-decoration: underline;">编辑选区</a>
                  </p>
                </div>
            </template>
          </div>·
        </transition>
        <div class="radio-group-container">
            <el-radio-group v-model="radio">
              <el-radio-button label="推荐"></el-radio-button>
              <el-radio-button label="自定义"></el-radio-button>
            </el-radio-group>
        </div>
        <div class="content" style="padding:0 10px;overflow-y:auto;">
          <custom v-if="radio === '推荐'"/>
          <recommended v-if="radio === '自定义'"/>
        </div>
         <div class="fixed-bottom">
            <div class="info-text">本次任务将消耗10算力点</div>
            <div class="button-container">
              <el-button class="execute-button" @click="img2img">执行</el-button>
              <div>
                <img src="https://www.weshop.com/ic_agent_setting.svg">
              </div>
            </div>
          </div>
    </el-drawer>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      :modal="false"
      flex
     >
       <img
        :src="currentTask.uploadedImage"
        alt="Uploaded Image"
        ref="uploadedImage"
        style="cursor: crosshair;"
        @click="getImageClickCoordinates"
        @contextmenu.prevent="getImageClickCoordinates"
        width="300"
        height="300"
      />
      <img width="300" height="300" src="@/assets/images/9ec4209d66a0806e592740124ca25f2.jpg">
      <img
        width="300"
        height="300"
        :src="currentTask.maskImage"
        class="overlay-image"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import left from './left';
import custom from './custom.vue'
import recommended from './recommended.vue';
export default {
  ...left,
  components:{
    custom,
    recommended
  }
};
</script>

<style scoped>
.fixed-bottom {
  background-color: #fff;
  display: flex;
  justify-content: space-between; /* 确保两个 div 在水平方向上分开 */
  align-items: center; /* 垂直居中对齐 */
  border-top: 1px solid #eee;
  position: sticky;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 10px;
  z-index: 1;
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


canvas {
    display: none;
}
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
    background-color: var(--FillColor6);
    border-right: 1px var(--BorderColor11) solid;
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

::v-deep .el-drawer__body{
  scrollbar-width: none;
}

.dialog-content {
    display: flex;
    justify-content: space-between;
    padding: 0px 30px;
    margin-bottom: 50px;
}

.upload-section {
    width: 300px;
    height: 300px;
    padding-right: 20px;
}

::v-deep .el-upload-dragger{
  width: 300px;
  height: 300px;
}

::v-deep .el-icon-upload{
  margin-top: 33%;
}

.image-preview {
    width: 50%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-left: 30px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.uploaded-image {
    background-color: #f5f7fd;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: contain;
}

.canvas-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none; /* Allow clicks to pass through canvas to the image */
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

.radio-group-container {
  display: flex;
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
}

.overlay-image {
  position: absolute;
  left: 320px;
  object-fit: cover;
}

</style>
