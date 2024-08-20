<template>
  <div>
    <div class="container" v-if="radio === 0">
      <!-- AI 模特部分 -->
      <div class="ai-models">
        <div class="header">
          <h2>AI模特</h2>
        </div>
        <div class="models-grid">
          <div v-for="(model, index) in models" :key="index" class="model-item">
            <img
              :src="model.modelImage"
              alt="model"
              width="106"
              height="106"
              class="model-image"
            />
            <span class="model-name">{{ model.modelName }}</span>
            <!-- <span v-if="model.new" class="new-tag">New</span> -->
          </div>
        </div>
      </div>

      <!-- 商店场景部分 -->
      <div class="store-scenes">
        <h2>商店场景</h2>
        <div class="scenes-grid">
          <div v-for="(scene, index) in scenes" :key="index" class="scene-item">
            <img
              :src="scene.modelImage"
              alt="scene"
              width="106"
              height="106"
              class="scene-image"
            />
            <span>{{ scene.modelName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="container2" v-else>
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
  </div>
</template>

<script>
import { queryListModel } from "@/api/zhiqi/model";
export default {
  props: {
    radio: Number,
  },
  data() {
    return {
      models: [
        {
          modelName: "模特1",
          modelImage:
            "https://ai-image.weshop.com/9ec5a001-0dc4-409c-bf76-399f515a48a1_560x560.png_crop256.jpeg",
          new: true,
        },
        {
          modelName: "模特2",
          modelImage:
            "https://ai-image.weshop.com/097c2521-83ce-44c5-b758-00b07c755bf6_697x697.png_crop256.jpeg",
          new: false,
        },
        {
          modelName: "模特3",
          modelImage:
            "https://ai-image.weshop.com/ed5f1ca6-ca2a-44ca-92b0-bae0f699c1ad_560x560.png_crop256.jpeg",
          new: true,
        },
        {
          modelName: "模特1",
          modelImage:
            "https://ai-image.weshop.com/9ec5a001-0dc4-409c-bf76-399f515a48a1_560x560.png_crop256.jpeg",
          new: true,
        },
        {
          modelName: "模特2",
          modelImage:
            "https://ai-image.weshop.com/097c2521-83ce-44c5-b758-00b07c755bf6_697x697.png_crop256.jpeg",
          new: false,
        },
        {
          modelName: "模特3",
          modelImage:
            "https://ai-image.weshop.com/ed5f1ca6-ca2a-44ca-92b0-bae0f699c1ad_560x560.png_crop256.jpeg",
          new: true,
        },
        {
          modelName: "模特1",
          modelImage:
            "https://ai-image.weshop.com/9ec5a001-0dc4-409c-bf76-399f515a48a1_560x560.png_crop256.jpeg",
          new: true,
        },
        {
          modelName: "模特2",
          modelImage:
            "https://ai-image.weshop.com/097c2521-83ce-44c5-b758-00b07c755bf6_697x697.png_crop256.jpeg",
          new: false,
        },
        {
          modelName: "模特3",
          modelImage:
            "https://ai-image.weshop.com/ed5f1ca6-ca2a-44ca-92b0-bae0f699c1ad_560x560.png_crop256.jpeg",
          new: true,
        },
        // 添加更多模型
      ],
      scenes: [
        {
          modelName: "场景1",
          modelImage:
            "https://ai-image.weshop.com/403df960-8ac8-47c1-bdff-3e90681d855f_1024x1024.png_256x256.jpeg",
        },
        {
          modelName: "场景2",
          modelImage:
            "https://ai-image.weshop.com/2bc446c7-3283-41cb-b5e2-6b2fbae36680.png_256x256.jpeg",
        },
        // 添加更多场景
      ],
    };
  },
  mounted() {
    queryListModel(0, 0).then((res) => {
      this.models = res.data;
      console.log(res);
    });
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
}

.ai-models,
.store-scenes {
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

.models-grid,
.scenes-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.model-item,
.scene-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  color: #7d7675;
  padding: 0;
  margin: 0;
}

.model-image,
.scene-image {
  border-radius: 10px;
  object-fit: cover;
}

.model-name {
  color: #97a0b4;
  margin-top: 6px;
  max-width: 106px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  line-height: 17px;
  font-weight: 400;
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

.container2 {
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
