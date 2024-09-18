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
                  @click="openDilog"
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
    <right
      v-if="dialogVisible"
      :bgImage="currentTask.uploadedImage"
      :mask="currentTask.fileName"
      @close="closeDig"
    />
  </div>
</template>

<script>
import mixins from "../mixins/left";
import custom from "./custom.vue";
import right from "./right.vue";
import { queryListTask, save, upload, update } from "@/api/zhiqi/task";
import { img2img } from "@/api/zhiqi/sd";
import store from "@/store";
export default {
  mixins: [mixins],
  components: {
    custom,
    right,
  },
  data() {
    return {
      selectModelId: "",
      selectSceneId: "",
      loading: false,
      ////
      dialogVisible: false,
    };
  },
  methods: {
    async closeDig(maskImage) {
      if (maskImage) {
        const fileImage = dataURLtoBlob(maskImage, Date.now() + ".png");
        console.log(fileImage);

        const resizedImageBlob = await this.resizeImage(fileImage, 1024);
        console.log(resizedImageBlob);

        const blob = await readFileAsBlob(resizedImageBlob);
        const newFile = new File([blob], resizedImageBlob.name, {
          type: resizedImageBlob.type,
        });

        const formdata = new FormData();
        formdata.append("file", newFile);
        formdata.append("type", "2");
        console.log(newFile);

        const res = await upload(formdata);
        this.$set(this.currentTask, "maskImageSrc", res.url);
        update({ id: this.currentTask.id, mask: res.url });
      }
      this.dialogVisible = false;
    },
    async handleUpload(file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/bmp",
        "image/webp",
      ];
      const isAllowedType = allowedTypes.includes(file.file.type);
      if (!isAllowedType) {
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
      console.log(file.file);
      console.log(this.currentTask.fileList);

      if (this.currentTask.fileList) {
        const fileList = this.currentTask.fileList.filter(
          (f) => f.uid === file.file.uid
        );
        this.$set(this.currentTask, "fileList", fileList);
        console.log(this.currentTask.fileList);
      }
      this.$set(this.currentTask, "uploading", this.currentTaskId);

      const resizedImageBlob = await this.resizeImage(file.file, 1024);
      console.log(resizedImageBlob, "===");

      const imageByteArray = await blobToByteArray(resizedImageBlob);
      ////////////////////////
      const blob = await readFileAsBlob(resizedImageBlob);
      const newFile = new File([blob], resizedImageBlob.name, {
        type: resizedImageBlob.type,
      });
      const formdata = new FormData();
      formdata.append("file", newFile);
      formdata.append("type", "0");
      console.log(formdata);

      const res = await upload(formdata);
      console.log(res);
      const fileName = res.url.split("/").pop().split(".")[0];
      console.log(fileName, "====================");
      /////////////////////
      update({ id: this.currentTask.id, primaryImage: res.url });
      const task = this.currentTask;
      fetch(`/apiz/create-task/${fileName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 设置请求头，表明发送的是 JSON 数据
        },
        body: JSON.stringify({
          // 要发送的 JSON 数据对象
          image_url: `${res.url}`,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.$set(task, "fileName", data);
        })
        .catch((error) => {
          console.log(error);
        });

      this.$set(task, "uploadedImage", res.url);
      this.$set(task, "fileList", [newFile]);
      this.$set(task, "clickCoordinates", []);
      this.$set(task, "type", []);
      this.$set(this.currentTask, "loading", true);
    },
    async openDilog() {
      console.log(!this.currentTask.fileName, "===");

      if (!this.currentTask.fileName) {
        this.$set(this.currentTask, "loading", true);
        const fileName = this.currentTask.uploadedImage
          .split("/")
          .pop()
          .split(".")[0];
        await fetch(`/apiz/create-task/${fileName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // 设置请求头，表明发送的是 JSON 数据
          },
          body: JSON.stringify({
            // 要发送的 JSON 数据对象
            image_url: `${this.currentTask.uploadedImage}`,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            this.$set(this.currentTask, "fileName", data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      this.dialogVisible = true;
    },
    // //////////////////////////
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
        if (item.mask) {
          this.$set(item, "maskImageSrc", item.mask);
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
      if (!this.currentTask.maskImageSrc) {
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
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
async function blobToByteArray(blob) {
  return new Uint8Array(await new Response(blob).arrayBuffer());
}

//文件转base64
function readFileAsBlob(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const dataUrl = fileReader.result;
      const [header, base64] = dataUrl.split(",");
      const mime = header.match(/:(.*?);/)[1];
      const binary = atob(base64);
      const binaryLength = binary.length;
      const u8arr = new Uint8Array(binaryLength);

      for (let i = 0; i < binaryLength; i++) {
        u8arr[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([u8arr], { type: mime });
      resolve(blob);
    };
    fileReader.onerror = () => reject(new Error("FileReader failed"));
    fileReader.readAsDataURL(file);
  });
}
function dataURLtoBlob(dataurl, name) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], name, {
    type: mime,
  });
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/work.scss";
</style>