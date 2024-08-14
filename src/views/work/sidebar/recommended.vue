<template>
  <div class="container">
    <div class="left-section">
      <div class="input-section">
        <label>场景描述</label>
        <el-input
          type="textarea"
          placeholder="TIPS:场景描述请写场景以及位置等信息
例如：一杯牛奶放在餐桌上，清晨，温馨"
          :rows="16"
          maxlength="1500"
          show-word-limit
        />
      </div>
    </div>
    <div class="right-section">
      <div class="input-section">
        <label>不希望出现的内容</label>
        <el-input
          type="textarea"
          placeholder="请输入不希望出现的内容"
          :rows="16"
          maxlength="1500"
          show-word-limit
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-between; /* 确保左右对齐 */
  align-items: stretch; /* 保持两边高度一致 */
  gap: 20px; /* 两边之间的间距 */
  margin-top: 5%;
}

.left-section,
.right-section {
  flex: 1;
}

.input-section {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%; /* 确保内部元素撑开整个容器的高度 */
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}
</style>
