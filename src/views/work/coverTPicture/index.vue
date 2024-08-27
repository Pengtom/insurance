<template>
  <div class="container">
    <!-- <div class="left">
      <h2>{{ context.title }}</h2>
      <p>{{ context.content }}</p>
      <el-button type="primary" @click="addTask" class="new-task-button">
        新建任务
      </el-button>
      <div class="tasks">
        <div
          v-for="(task, index) in tasks"
          :key="index"
          class="task"
          @click="selectTask(index)"
          :class="{ 'active-task': index === currentTaskIndex }"
        >
          <el-tag type="success" class="task-tag">任务 {{ index + 1 }}</el-tag>
        </div>
      </div>
    </div>
    <el-drawer
      v-for="task in tasks"
      :key="'drawer-' + task.id"
      :visible.sync="task.dialogVisible"
      title="新建任务"
      custom-class="custom-drawer"
      size="50%"
    >
      <div class="drawer-content">
        <div class="drawer-header">
          <el-select v-model="task.checkpoint" placeholder="CHECKPOINT">
            <el-option label="ChilloutMix" value="ChilloutMix"></el-option>
          </el-select>
          <el-select v-model="task.vae" placeholder="VAE">
            <el-option label="自动" value="auto"></el-option>
          </el-select>
          <el-select v-model="task.clipSkip" placeholder="Clip Skip">
            <el-option label="1" value="1"></el-option>
          </el-select>
        </div>
        <div class="drawer-body">
          <div class="drawer-column">
            <h3>请输入正向咒语</h3>
            <el-input
              type="textarea"
              placeholder="Write your prompt"
              v-model="task.prompt"
            />
          </div>
          <div class="drawer-column">
            <h3>请输入反向咒语</h3>
            <el-input
              type="textarea"
              placeholder="Write your Negative prompt"
              v-model="task.negativePrompt"
            />
          </div>
        </div>
        <div class="drawer-footer">
          <el-button type="primary" @click="handleSave(task.id)">
            保存
          </el-button>
          <el-button @click="closeDrawer(task.id)"> 取消 </el-button>
        </div>
      </div>
    </el-drawer> -->
    <left :context="context" />
    <right :images="images" :flag="true" />
  </div>
</template>

<script>
import Left from "./left.vue";
import Right from "../right";
export default {
  data() {
    return {
      context: {
        title: "文生图",
        content: "把文字变成生动图像",
      },
      images: [
        "https://ai-image.weshop.com/0a673bdd-571d-4480-9c6c-6cfe3e864f98_512x768.png",
        "https://ai-image.weshop.com/101e959e-0a22-4ce4-84cc-482b333c1398_512x768.png",
        "https://ai-image.weshop.com/54f0ecaf-4961-49c5-96a7-4a0f79ba2cca_512x768.png",
        "https://ai-image.weshop.com/0a673bdd-571d-4480-9c6c-6cfe3e864f98_512x768.png",
        "https://ai-image.weshop.com/101e959e-0a22-4ce4-84cc-482b333c1398_512x768.png",
        "https://ai-image.weshop.com/54f0ecaf-4961-49c5-96a7-4a0f79ba2cca_512x768.png",
      ],
    };
  },
  components: {
    Right,
    Left,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  height: 94vh;
}
</style>
