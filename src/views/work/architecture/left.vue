<template>
  <div class="left-container">
    <div class="left">
      <div class="sticky-header">
        <div
          style="
            font-size: 15px;
            line-height: 25px;
            margin-left: 10px;
            color: #555555;
          "
        >
          {{ context.title }}
        </div>
        <p style="font-size: 12px; line-height: 20px; color: #97a0b4">
          {{ context.content }}
        </p>
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
              :src="task.uploadedImage || task.imagesrc"
            />
            <div class="task-details">
              <span class="task-tag">{{ task.name }}</span>
              <div class="task-status">{{ statusMap[task.taskType] }}</div>
            </div>
          </div>
          <div class="task-options" @click.stop="toggleOptions(task.id)">
            <img
              class="more-options-icon"
              loading="lazy"
              width="14"
              height="4"
              decoding="async"
              :src="require('@/assets/images/more-horizontal.png')"
            />
          </div>
          <transition name="fade">
            <div v-if="task.showOptions" class="options-dropdown">
              <i class="el-icon-delete"></i>
              <button @click="deleteTask(task.id, task.type)">删除</button>
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
        <div
          v-if="currentTaskId !== null"
          key="currentTaskId"
          class="dialog-content"
        >
          <div class="upload-section" v-if="!currentTask.uploadedImage">
            <el-upload
              class="upload-demo"
              drag
              :show-file-list="false"
              action="#"
              v-loading="!!currentTask.uploading"
              :http-request="handleUpload"
              :file-list="currentTask.fileList"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">点击上传或将图片拖入此区域</div>
              <div class="el-upload__tip" slot="tip">
                文件不超过5mb，不支持gif/avif格式
              </div>
            </el-upload>
          </div>
          <template v-else>
            <div class="image-preview">
              <img
                :src="currentTask.uploadedImage"
                alt="Uploaded Image"
                class="uploaded-image"
                ref="uploadedImage"
              />
              <div style="display: flex">
                <p>原图</p>
                <el-upload
                  class="upload-demo"
                  action="#"
                  :file-list="currentTask.fileList"
                  list-type="picture"
                  :show-file-list="false"
                  :http-request="handleUpload"
                >
                  <p v-if="!currentTask.loading">重新上传</p>
                </el-upload>
              </div>
            </div>
          </template>
        </div>
      </transition>
      <custom
        @radioval="radioval"
        @stepsVal="stepsVal"
        @correctval="correctval"
        @loraIndexVal="loraIndexVal"
      />
      <div class="fixed-bottom">
        <div class="info-text">
          本次任务将消耗
          <span style="margin-right: 4px; color: rgb(33, 23, 255)"
            >{{ 10 * quantity }}算力点</span
          >，生成{{ quantity }}张图片
        </div>
        <div class="button-container">
          <el-button class="execute-button" :loading="loading" @click="img2img"
            >执行</el-button
          >
          <div class="settings-container">
            <div class="settings-image" @click="openSelectFlag">
              <img
                width="16"
                height="16"
                :src="require('@/assets/images/ic_agent_setting.svg')"
              />
            </div>
            <div class="modal-container" v-if="currentTask.selectFlag">
              <img
                width="44"
                height="44"
                class="close-icon"
                :src="require('@/assets/images/ic_modal_close.svg')"
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
import mixins from "../mixins/left";
import custom from "./custom.vue";
import { queryListTask, save, upload, update } from "@/api/zhiqi/task";
import { img2img } from "@/api/zhiqi/sd";
import store from "@/store";
export default {
  mixins: [mixins],
  components: {
    custom,
  },
  data() {
    return {
      type: 0,
      prompt: "",
      steps: 25,
      loraIndex: 0,
      loramodel: 1, //权重
      loading: false,
    };
  },
  methods: {
    async init() {
      const params = { type: "3", name: "" };
      const res = await queryListTask(params);
      this.tasks = res.data.sort((a, b) => {
        return new Date(b.createTime) - new Date(a.createTime);
      });
      this.tasks.forEach((item) => {
        if (item.primaryImage) {
          item.uploadedImage = item.primaryImage;
        } else {
          item.imagesrc = require("@/assets/images/未标题-1.png");
        }
        this.$set(item, "showOptions", false);
      });
    },
    async addTask() {
      const newTaskId = Date.now() % 100000000;
      const newTask = {
        id: newTaskId,
        name: "任务-" + newTaskId,
        imagesrc: require("@/assets/images/未标题-1.png"),
        uploadedImage: null,
        fileList: [],
        showOptions: false,
        taskType: 0,
      };
      const res = await save({ type: 3, name: "任务-" + newTaskId });
      newTask.id = res.msg;
      this.tasks.unshift(newTask);
      this.currentTaskId = newTask.id;
      this.isDrawerVisible = true;
    },
    async openDrawer(taskId) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task.taskType === 1 || task.taskType === 2) {
        this.$emit("success", {
          id: taskId,
          image: task.uploadedImage,
          name: task.name,
          isSuccess: true,
        });
        this.currentTaskId = taskId;
        this.isDrawerVisible = false;
        return;
      }
      if (this.currentTask.id !== taskId) {
        this.currentTaskId = taskId;
        this.isDrawerVisible = true;
      }
    },
    async handleUpload(file) {
      const allowedTypes = ["image/gif", "image/avif"];
      const isAllowedType = allowedTypes.includes(file.file.type);
      if (isAllowedType) {
        this.$message({
          message: "❌ 不允许上传此类型的文件 ❗",
          type: "",
        });
        return;
      }
      const isLt5M = file.file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message({
          message: "❌ 图片大小不能超过 5MB ❗",
          type: "",
        });
        return;
      }
      const imageStatus = await this.iSImageStatus(file.file);

      if (!imageStatus.isValid) {
        const fileList = this.currentTask.fileList.filter(
          (f) => f.uid !== file.file.uid
        );
        this.$set(this.currentTask, "fileList", fileList);
        return;
      }
      if (this.currentTask.fileList) {
        const fileList = this.currentTask.fileList.filter(
          (f) => f.uid === file.file.uid
        );
        this.$set(this.currentTask, "fileList", fileList);
      }
      this.$set(this.currentTask, "uploading", this.currentTaskId);
      const formdata = new FormData();
      formdata.append("file", file.file);
      formdata.append("type", "0");
      const res = await upload(formdata);
      const qzProject = {
        id: this.currentTask.id,
        primaryImage: res.url,
      };
      update(qzProject);
      this.$set(this.currentTask, "uploadedImage", res.url);
      this.$set(this.currentTask, "fileList", [file.file]);
    },
    radioval(radio) {
      this.type = radio;
    },
    stepsVal(steps) {
      this.steps = steps;
    },
    correctval(correct) {
      this.prompt = correct;
    },
    loraIndexVal(lora) {
      this.loraIndex = lora.loraIndex;
      this.loramodel = lora.loraWeight;
    },
    selectNum(num) {
      this.quantity = num;
    },
    async img2img() {
      if (!this.currentTask.uploadedImage) {
        this.$message({
          message: "❌ 请先进行图片的上传 ❗",
          type: "",
        });
        return;
      }
      if (this.type === 0 && this.loraIndex === 0) {
        this.$message({
          message: "❌ 请选择lora模型 ❗",
          type: "",
        });
        return;
      }
      this.loading = true;
      const Img2imgVo = {
        projectId: this.currentTask.id,
        type: this.type,
        quantity: this.quantity,
        steps: this.steps,
        loramodel: this.loramodel,
        prompt: this.prompt,
      };
      if (this.type === 0) {
        Img2imgVo.loraname = this.loraIndex;
      }
      try {
        const res = await img2img(Img2imgVo);
        if (res.code === 500) {
          this.$message({
            message: `❌ ${res.msg} ❗`,
            type: "",
          });
          return;
        }
        if (res.msg === "算力点不足") {
          this.$message({
            message: "❌ 您的算力点不足，请及时充值 ❗",
            type: "",
          });
          return;
        }
        store.dispatch("getComputingPower");
        this.isDrawerVisible = false;
        this.init();
        this.$emit("success", {
          id: this.currentTask.id,
          image: this.currentTask.uploadedImage,
          name: this.currentTask.name,
          isSuccess: true,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/work.scss";
.sticky-header {
  background: url("../../../assets/images/AI建筑.png") no-repeat;
  background-size: 100% auto;
}
</style>