<template>
  <div class="right-container" v-show="flag">
    <div class="right">
      <h2>优秀案例</h2>
      <div class="image-gallery">
        <div v-for="(image, index) in images" :key="index" class="image-item">
          <img :src="image" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    images:Array,
    flag: Boolean
  }
};
</script>

<style scoped>
.right-container {
  height: 100%;
  width: 70%; /* 右边宽度 */
  scrollbar-width: none;
  overflow-y: auto;
}
.right {
  padding: 20px;
}

h2 {
  position: relative;
  margin-bottom: 10px;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8); /* 设置标题的字体颜色并添加透明效果 */
}

p {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6); /* 设置描述文字的字体颜色并添加透明效果 */
  margin-bottom: 20px;
}

.right h2::after {
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  background-color: #dcdcdc;
  position: absolute;
  bottom: -5px;
  left: 0;
}
.image-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 自动调整列数和列宽 */
  gap: 12px; /* 设置图片之间的间隙 */
}

.image-item {
  border-radius: 8px;
  overflow: hidden;
  display: flex;
}

.image-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  /* border: 1px solid #dcdcdc; */
  object-fit: contain;
}
</style>
