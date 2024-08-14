<template>
  <div class="container">
    <!-- AI 模特部分 -->
    <div class="ai-models">
      <div class="header">
        <h2>AI模特</h2>
      </div>
      <div class="models-grid">
        <div v-for="(model, index) in models" :key="index" class="model-item">
          <img :src="model.img" alt="model" class="model-image" />
          <span>{{ model.name }}</span>
          <span v-if="model.new" class="new-tag">New</span>
        </div>
      </div>
    </div>

    <!-- 商店场景部分 -->
    <div class="store-scenes">
      <h2>商店场景</h2>
      <div class="scenes-grid">
        <div v-for="(scene, index) in scenes" :key="index" class="scene-item">
          <img :src="scene.img" alt="scene" class="scene-image" />
          <span>{{ scene.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      models: [
        { name: '模特1', img: 'https://ai-image.weshop.com/9ec5a001-0dc4-409c-bf76-399f515a48a1_560x560.png_crop256.jpeg', new: true },
        { name: '模特2', img: 'https://ai-image.weshop.com/097c2521-83ce-44c5-b758-00b07c755bf6_697x697.png_crop256.jpeg', new: false },
        { name: '模特3', img: 'https://ai-image.weshop.com/ed5f1ca6-ca2a-44ca-92b0-bae0f699c1ad_560x560.png_crop256.jpeg', new: true },
          { name: '模特1', img: 'https://ai-image.weshop.com/9ec5a001-0dc4-409c-bf76-399f515a48a1_560x560.png_crop256.jpeg', new: true },
        { name: '模特2', img: 'https://ai-image.weshop.com/097c2521-83ce-44c5-b758-00b07c755bf6_697x697.png_crop256.jpeg', new: false },
        { name: '模特3', img: 'https://ai-image.weshop.com/ed5f1ca6-ca2a-44ca-92b0-bae0f699c1ad_560x560.png_crop256.jpeg', new: true },
          { name: '模特1', img: 'https://ai-image.weshop.com/9ec5a001-0dc4-409c-bf76-399f515a48a1_560x560.png_crop256.jpeg', new: true },
        { name: '模特2', img: 'https://ai-image.weshop.com/097c2521-83ce-44c5-b758-00b07c755bf6_697x697.png_crop256.jpeg', new: false },
        { name: '模特3', img: 'https://ai-image.weshop.com/ed5f1ca6-ca2a-44ca-92b0-bae0f699c1ad_560x560.png_crop256.jpeg', new: true },
        // 添加更多模型
      ],
      scenes: [
        { name: '场景1', img: 'https://ai-image.weshop.com/403df960-8ac8-47c1-bdff-3e90681d855f_1024x1024.png_256x256.jpeg' },
        { name: '场景2', img: 'https://ai-image.weshop.com/2bc446c7-3283-41cb-b5e2-6b2fbae36680.png_256x256.jpeg' },
        // 添加更多场景
      ]
    };
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
}

.ai-models, .store-scenes {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.start-button {
  background-color: #6b5bff;
  border-color: #6b5bff;
}

.models-grid, .scenes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
}

.model-item, .scene-item {
  position: relative;
  text-align: center;
}

.model-image, .scene-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.new-tag {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: red;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
