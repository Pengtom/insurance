<template>
  <div class="left-container">
    <div class="left">
      <div class="sticky-header">
        <div style="font-size: 18px; line-height: 25px; margin-left: 10px">
          {{ context.title }}
        </div>
        <p style="font-size: 14px; line-height: 20px; color: #97a0b4">
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
              <button @click.stop="deleteTask(task.id, task.type)">删除</button>
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
              action="#"
              :show-file-list="false"
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
            <div class="image-preview image-preview2">
              <img :src="currentTask.maskImageSrc" class="uploaded-image" />
              <p v-if="currentTask.loading">选区图</p>
              <p v-if="!currentTask.loading">
                <a
                  @click="dialogVisible = true"
                  style="color: #7530fe; text-decoration: underline"
                  >编辑选区</a
                >
              </p>
            </div>
          </template>
        </div>
      </transition>
      <custom @modelId="modelId" @sceneId="sceneId" />
      <div class="fixed-bottom">
        <div class="info-text">
          本次任务将消耗
          <span style="margin-right: 4px; color: #7530fe"
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
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      :modal="false"
      flex
      :before-close="dialogclose"
    >
      <img
        :src="currentTask.uploadedImage"
        alt="Uploaded Image"
        ref="uploadedImage"
        style="cursor: Pointer; object-fit: contain"
        @click="getImageClickCoordinates"
        @contextmenu.prevent="getImageClickCoordinates"
        width="350"
        height="350"
      />
      <img
        width="350"
        height="350"
        :src="currentTask.maskImageSrc"
        class="overlay-image"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogclose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from "../mixins/left";
import custom from "./custom.vue";
import { queryListTask, save } from "@/api/zhiqi/task";
import { img2img } from "@/api/zhiqi/sd";
import store from "@/store";
export default {
  mixins: [mixins],
  components: {
    custom,
  },
  data() {
    return {
      selectModelId: "",
      selectSceneId: "",
      loading: false,
    };
  },
  methods: {
    async init() {
      const params = { type: "1", name: "" };
      const res = await queryListTask(params);
      console.log(res);
      this.tasks = res.data.sort((a, b) => {
        return new Date(b.createTime) - new Date(a.createTime);
      });
      this.tasks.forEach((item) => {
        if (item.primaryImage) {
          item.uploadedImage = item.primaryImage;
        } else {
          item.imagesrc = require("@/assets/images/未标题-1.png");
        }
        if (item.maskImage) {
          this.$set(item, "maskImageSrc", item.maskImage);
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
        type: 1,
      };
      const res = await save({ type: 1, name: "任务-" + newTaskId });
      newTask.id = res.msg;
      this.tasks.unshift(newTask);
      this.currentTaskId = newTask.id;
      this.isDrawerVisible = true;
    },
    modelId(selectModelId) {
      this.selectModelId = selectModelId;
    },
    sceneId(sceneId) {
      this.selectSceneId = sceneId;
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
      if (!this.currentTask.maskImage) {
        this.$message({
          message: "❌ 请选择蒙版图 ❗",
          type: "",
        });
        return;
      }
      console.log(!this.selectModelId);
      console.log(!this.selectSceneId);

      if (!this.selectSceneId || !this.selectModelId) {
        this.$message({
          message: "❌ 请选择或填写商拍场景 不能为空 ❗",
          type: "",
        });
        return;
      }
      this.loading = true;
      const Img2imgVo = {
        projectId: this.currentTask.id,
        selectPmodelId: this.selectSceneId,
        selectModelId: this.selectModelId,
        quantity: this.quantity,
      };

      try {
        console.log(Img2imgVo);
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
          type:this.currentTask.type
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
</style>