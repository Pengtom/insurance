<template>
  <div class="container">
    <!-- 左侧历史记录 -->
    <div class="left">
      <div class="sticky-header">
        <h2>GPT</h2>
        <p>
          全能AI对话机器人，智能问答、写爆款文案、写视频脚本、写代码、AI绘画等.
        </p>
        <el-button type="primary" @click="addTask" class="new-task-button">
          新建对话
        </el-button>
      </div>

      <div class="tasks">
        <div
          v-for="(task, index) in tasks"
          :key="index"
          class="task"
          @click="selectTask(index)"
          :class="{ 'active-task': index === currentTaskIndex }"
        >
          <span class="task-tag">新的聊天</span>

          <div class="task-options" @click="toggleOptions(index)">
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
              <button @click="deleteTask(index)">删除</button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 右侧对话框 -->
    <div class="chat-container">
      <div class="chat-box">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="{
            'message-left': message.sender === 'other',
            'message-right': message.sender === 'self',
          }"
        >
          <img
            :src="message.avatar"
            class="message-avatar"
            :class="{
              'avatar-left': message.sender === 'other',
              'avatar-right': message.sender === 'self',
            }"
          />
          <div class="message-content">
            <markdown-it-vue-light :content="message.text" />
          </div>
        </div>
      </div>
      <div class="input-container">
        <textarea
          v-model="newMessage"
          @keyup.enter="sendMessage"
          @input="adjustTextareaHeight"
          placeholder="Type a message..."
          ref="messageInput"
        />
        <el-button
          class="send-button"
          :class="buttonClass"
          :disabled="isButtonDisabled || loading"
          @click="sendMessage"
        >
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { test } from "@/api/zhiqi/gpt";
import MarkdownItVueLight from "markdown-it-vue/dist/markdown-it-vue-light.umd.min.js";
import "markdown-it-vue/dist/markdown-it-vue-light.css";
export default {
  components: {
    MarkdownItVueLight,
  },
  data() {
    return {
      tasks: [], // 存储任务和对应的消息
      currentTaskIndex: null, // 当前选中的任务索引
      newMessage: "",
      loading: false,
    };
  },
  computed: {
    messages() {
      // 返回当前选中的任务的消息
      return this.currentTaskIndex !== null
        ? this.tasks[this.currentTaskIndex].messages
        : [];
    },
    isButtonDisabled() {
      return !this.newMessage.trim();
    },
    buttonClass() {
      return {
        "send-button-disabled": !this.newMessage.trim() || this.loading,
        "send-button-active": this.newMessage.trim() && !this.loading,
      };
    },
  },
  methods: {
    addTask() {
      const newTaskId = Date.now() % 100000000;
      const message = {
        id: newTaskId,
        messages: [],
        showOptions: false,
        loading: false,
        newMessage: "",
      };
      this.tasks.unshift(message);
      this.currentTaskIndex = 0; // 选中新建的任务
      console.log(this.tasks, "===");
    },
    selectTask(index) {
      this.currentTaskIndex = index; // 切换到选中的任务
    },
    toggleOptions(index) {
      this.tasks[index].showOptions = !this.tasks[index].showOptions;
    },
    async deleteTask(taskId) {
      await deleteTaskById(taskId);
      this.tasks = this.tasks.filter((item) => item.id !== taskId);
      this.init();
      if (this.tasks.length === 0) {
        this.isDrawerVisible = false;
      }
      this.showOptions = false;
    },
    adjustTextareaHeight() {
      const textarea = this.$refs.messageInput;
      const currentHeight = textarea.clientHeight;
      const maxHeightIncrease = currentHeight * 0.6; // 最大增加高度的50%
      textarea.style.height = "auto"; // Reset height to auto to shrink
      console.log(textarea.scrollHeight);
      console.log(currentHeight + maxHeightIncrease);
      const newHeight = Math.min(
        textarea.scrollHeight,
        currentHeight + maxHeightIncrease
      );
      textarea.style.height = `${newHeight}px`; // Set height to new height
    },
    async sendMessage() {
      if (this.loading) {
        return; // 如果正在加载，则不发送消息
      }
      if (this.newMessage.trim()) {
        if (this.currentTaskIndex === null || this.tasks.length === 0) {
          // 如果没有任务，则创建一个新的任务
          this.addTask();
        }

        this.loading = true;
        this.$nextTick(() => {
          const textarea = this.$refs.messageInput;
          textarea.style.height = `70px`;
        });
        // 将消息添加到当前选中的任务
        if (this.currentTaskIndex !== null) {
          this.tasks[this.currentTaskIndex].messages.push({
            sender: "self",
            text: this.newMessage.trim(),
            avatar: "/girl.png",
          });
          const formData = new FormData();
          formData.append("content", this.newMessage.trim());
          this.newMessage = ""; // 清空输入框
          try {
            const res = await test(formData);
            console.log(res);

            this.tasks[this.currentTaskIndex].messages.push({
              sender: "other",
              text: res.msg,
              avatar: "/girl.png",
            });
          } catch (error) {
            console.error("Error sending message:", error);
          } finally {
            console.log(this.tasks);

            // 处理完成后，将 loading 状态设为 false
            this.loading = false;
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  position: relative;
  height: 94vh; /* 全屏高度 */
  background-color: rgba(0, 0, 0, 0.45);
}

.left {
  width: 20%; /* 可以根据需要调整宽度 */
  background-color: #fff;
  border-right: 1px #e3e3e3 solid;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
.sticky-header {
  position: sticky;
  top: 0;
  padding: 10px;
  background-image: url("https://www.weshop.com/bg_tip_aimodel.webp");
  background-repeat: no-repeat;
  background-size: 100% auto;
  z-index: 1;
}
.new-task-button {
  margin-left: 5%;
  margin-bottom: 20px;
  width: 90%;
  border-radius: 5px;
}

.tasks {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px; /* 内边距调整 */
  scrollbar-width: none;
}

.task {
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  height: 60px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.active-task {
  background-color: #f5f7fd; /* 选中的任务背景色 */
}

.task-tag {
  font-size: 14px;
  border-radius: 4px;
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
.more-options-icon {
  width: 14px;
  height: 4px;
  cursor: pointer;
}
.options-dropdown button {
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 14px;
}
h2 {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8);
}

p {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 20px;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 10px;
  background-color: rgb(244 244 244 / 1);
  position: relative;
}

.message-left,
.message-right {
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  max-width: 60%;
  position: relative;
  display: flex;
  align-items: center;
  word-break: break-word;
  overflow-wrap: break-word;
  flex-direction: column;
}

.message-left {
  align-self: flex-start;
  background-color: #e0e0e0;
  margin-left: 50px;
}

.message-right {
  align-self: flex-end;
  background-color: #007bff;
  color: #fff;
  margin-right: 50px;
  margin-bottom: 2%;
}

.message-content {
  /* white-space: pre-wrap; */
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  overflow: auto;
}
::v-deep .markdown-body pre code {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  overflow: auto;
}
.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
}

.avatar-left {
  left: -50px;
}

.avatar-right {
  right: -50px;
}

.input-container {
  padding: 10px;
  background-color: rgb(244 244 244 / 1);
  display: flex;
  align-items: center;
}

textarea {
  width: 100%;
  min-height: 50px;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: rgb(244 244 244 /1);
  border-radius: 20px;
  outline: none;
  resize: none;
  font-size: 20px;
}

.send-button {
  border-radius: 100%;
  font-size: 14px;
}

.send-button-disabled {
  background-color: #f0f0f0;
  color: #ccc;
  border: 1px solid #ddd;
  cursor: not-allowed;
  margin-left: 10px;
  height: 50px;
  line-height: 30px;
}

.send-button-disabled:hover {
  background-color: #f0f0f0;
  color: #ccc;
  border: 1px solid #ddd;
}

.send-button-active {
  background-color: #000;
  color: #fff;
  border: 1px solid #000;
  margin-left: 10px;
  height: 50px;
  line-height: 30px;
}
</style>
