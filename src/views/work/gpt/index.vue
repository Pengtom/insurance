<template>
  <div class="container">
    <!-- 左侧历史记录 -->
    <div class="left">
      <h2>GPT</h2>
      <p>全能AI对话机器人，智能问答、写爆款文案、写视频脚本、写代码、AI绘画等.</p>
      <el-button type="primary" @click="addTask" class="new-task-button">
        新建对话
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

    <!-- 右侧对话框 -->
    <div class="chat-container">
      <div class="chat-box">
        <div 
          v-for="(message, index) in messages" 
          :key="index" 
          :class="{'message-left': message.sender === 'other', 'message-right': message.sender === 'self'}"
        >
          <img 
            :src="message.avatar" 
            class="message-avatar" 
            :class="{'avatar-left': message.sender === 'other', 'avatar-right': message.sender === 'self'}" 
          />
          <div class="message-content">{{ message.text }}</div>
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
          :disabled="isButtonDisabled" 
          @click="sendMessage"
        >
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      tasks: [], // 存储任务和对应的消息
      currentTaskIndex: null, // 当前选中的任务索引
      newMessage: '',
      //   messages: [
      //   { sender: 'self', text: 'Hello!', avatar: '/girl.png' },
      //   { sender: 'other', text: 'Hi there!', avatar: '/girl.png' },
      //   { sender: 'self', text: 'How can I assist you today?', avatar: '/girl.png' },
      //   { sender: 'other', text: 'I need help with Vue.js.', avatar: '/girl.png' },
      //   { sender: 'self', text: 'Sure! What do you need help with?', avatar: '/girl.png' },
      //   { sender: 'other', text: 'ok', avatar: '/girl.png' },
      // ],
    };
  },
  computed: {
    messages() {
      // 返回当前选中的任务的消息
      return this.currentTaskIndex !== null ? this.tasks[this.currentTaskIndex].messages : [];
    },
    isButtonDisabled() {
      return !this.newMessage.trim();
    },
    buttonClass() {
      return {
        'send-button-disabled': !this.newMessage.trim(),
        'send-button-active': this.newMessage.trim(),
      };
    }
  },
  methods: {
    addTask() {
      // 新建任务并初始化消息列表
      this.tasks.push({ messages: [] });
      this.currentTaskIndex = this.tasks.length - 1; // 选中新建的任务
    },
    selectTask(index) {
      this.currentTaskIndex = index; // 切换到选中的任务
    },
    adjustTextareaHeight() {
      const textarea = this.$refs.messageInput;
      const currentHeight = textarea.clientHeight;
      const maxHeightIncrease = currentHeight * 0.5; // 最大增加高度的50%
      textarea.style.height = 'auto'; // Reset height to auto to shrink
      const newHeight = Math.min(textarea.scrollHeight, currentHeight + maxHeightIncrease);
      textarea.style.height = `${newHeight}px`; // Set height to new height
    },
    sendMessage() {
    if (this.newMessage.trim()) {
        if (this.currentTaskIndex === null || this.tasks.length === 0) {
          // 如果没有任务，则创建一个新的任务
          this.addTask();
        }

        // 将消息添加到当前选中的任务
        if (this.currentTaskIndex !== null) {
          this.tasks[this.currentTaskIndex].messages.push({
            sender: 'self',
            text: this.newMessage.trim(),
            avatar: '/girl.png'
          },
          { sender: 'self', text: 'Hello!', avatar: '/girl.png' },
          { sender: 'other', text: 'Hi there!', avatar: '/girl.png' },
          { sender: 'self', text: 'How can I assist you today?', avatar: '/girl.png' },
          { sender: 'other', text: 'I need help with Vue.js.', avatar: '/girl.png' },
          { sender: 'self', text: 'Sure! What do you need help with?', avatar: '/girl.png' },
          { sender: 'other', text: 'ok', avatar: '/girl.png' },
          );
          this.newMessage = ''; // 清空输入框
          this.$nextTick(() => {
            this.adjustTextareaHeight(); // 调整输入框高度
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  height: 90vh;
}

.left {
  width: 300px; /* 可以根据需要调整宽度 */
  padding: 20px;
  background-image: url("https://www.weshop.com/bg_tip_aimodel.webp");
  background-color: var(--FillColor6);
  border-right: 1px solid var(--BorderColor11);
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: cover; /* 背景图片覆盖整个容器 */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); 
}

.new-task-button {
  margin-bottom: 20px;
  width: 100%;
  border-radius: 8px;
}

.tasks {
  margin-top: 20px;
  flex: 1;
  overflow-y: auto;
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
  cursor: pointer; /* 添加鼠标指针 */
}

.task:hover {
  background-color: #e0e0e0; /* 鼠标悬停时的背景色 */
}

.active-task {
  background-color: #d0d0d0; /* 选中的任务背景色 */
}

.task-tag {
  font-size: 14px;
  border-radius: 4px;
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
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  position: relative;
}

.message-left, .message-right {
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  max-width: 60%;
  position: relative;
  display: flex; /* 使头像和内容在同一行 */
  align-items: center; /* 使头像和内容垂直对齐 */
  word-break: break-word; /* 确保单词在最大宽度时换行 */
  overflow-wrap: break-word; /* 确保长单词或 URL 换行 */
}

.message-left {
  align-self: flex-start; /* 左对齐 */
  background-color: #e0e0e0;
  margin-left: 50px; /* 给头像留出空间 */
}

.message-right {
  align-self: flex-end; /* 右对齐 */
  background-color: #007bff;
  color: #fff;
  margin-right: 50px; /* 给头像留出空间 */
}

.message-content {
  white-space: pre-wrap; /* 保留空格并在边界处换行 */
  word-break: break-word; /* 确保单词在最大宽度时换行 */
  overflow-wrap: break-word; /* 确保长单词或 URL 换行 */
  max-width: 100%; /* 确保内容不超出最大宽度 */
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute; /* 绝对定位 */
}

.avatar-left {
  left: -50px; /* 头像左对齐时的左边距 */
}

.avatar-right {
  right: -50px; /* 头像右对齐时的右边距 */
}

.input-container {
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #fff;
  display: flex;
  align-items: center;
}

textarea {
  width: 100%;
  min-height: 50px; /* 设置最小高度 */
  box-sizing: border-box; /* 包括内边距和边框在内的宽高计算 */
  padding: 10px;
  border: 1px solid #ddd;
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
  cursor: default;
  margin-left: 10px; 
  height: 50px; /* 确保按钮高度固定 */
  line-height: 30px; /* 调整按钮文本的行高 */
}

.send-button-disabled:hover {
  background-color: #f0f0f0; 
  color: #ccc; 
  border: 1px solid #ddd; 
  cursor: default; 
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
