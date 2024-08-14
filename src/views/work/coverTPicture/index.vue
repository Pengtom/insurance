<template>
  <div class="container">
    <div class="left">
      <h2>{{ context.title }}</h2>
      <p>{{ context.content }}</p>
      <el-button type="primary" @click="addTask" class="new-task-button">
        新建任务
      </el-button>
      <div class="tasks">
        <div 
          v-for="task in tasks" 
          :key="task.id" 
          class="task" 
          @click="openDrawer(task.id)"
        >
          <el-tag type="success" class="task-tag">
            任务 {{ tasks.indexOf(task) + 1 }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 这里遍历 tasks，渲染每个任务的对话框 -->
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
            <!-- 其他选项 -->
          </el-select>
          <el-select v-model="task.vae" placeholder="VAE">
            <el-option label="自动" value="auto"></el-option>
            <!-- 其他选项 -->
          </el-select>
          <el-select v-model="task.clipSkip" placeholder="Clip Skip">
            <el-option label="1" value="1"></el-option>
            <!-- 其他选项 -->
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
          <el-button @click="closeDrawer(task.id)">
            取消
          </el-button>
        </div>
      </div>
    </el-drawer>
    <right :images="images"/>
  </div>
</template>

<script>
import Left from "../sidebar/left.vue";
import Right from "../right.vue";
export default {
  data() {
    return {
      context: {
        title: "文生图",
        content:
          "把文字变成生动图像",
      },
       tasks: [],
      currentTaskId: null, // 当前正在编辑的任务的 ID
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
    Left,
    Right,
  },
  methods:{
    addTask() {
      const newTaskId = Date.now(); // 使用时间戳作为唯一标识符
      this.tasks.push({
        id: newTaskId,
        dialogVisible: true,
        uploadedImage: null,
        fileList: [],
        checkpoint: "",
        vae: "",
        clipSkip: "1",
        prompt: "",
        negativePrompt: "",
      });
      this.currentTaskId = newTaskId;
    },
    handleSave(taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.dialogVisible = false;
        this.currentTaskId = null;
      }
    },
    closeDrawer(taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.dialogVisible = false;
      }
    },
    openDrawer(taskId) {
      this.currentTaskId = taskId;
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.dialogVisible = true;
      }
    },
  }
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.left {
  width: 20%;
  padding: 20px;
  background-image: url("https://www.weshop.com/bg_tip_aimodel.webp");
  background-color: var(--FillColor6);
  border-right: 1px var(--BorderColor11) solid;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: 100% auto;
}

.new-task-button {
  margin-bottom: 20px;
  width: 100%; /* 拉长按钮 */
  border-radius: 8px; /* 添加边框圆角 */
}

.tasks {
  margin-top: 20px;
}

.task {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-tag {
  font-size: 14px;
  border-radius: 4px;
}

.custom-drawer {
  background-color: #f9f9f9;
  border-radius: 16px;
}

.drawer-content {
  padding: 20px;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.drawer-body {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.drawer-column {
  width: 48%;
}

.drawer-column h3 {
  font-size: 16px;
  color: #888;
  margin-bottom: 10px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
