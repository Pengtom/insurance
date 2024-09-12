<template>
  <div>
    <div class="main-content">
      <div style="position: absolute !important; width: 100%; height: 100%">
        <img
          class="image-bg"
          :src="require('@/assets/indexImage/无排版背景图.jpg')"
          width="100%"
          height="100%"
        />
      </div>
      <div style="width: 100%; height: 80px"></div>
      <div class="content-wrapper">
        <h1 class="content-wrapper1">
          <p class="primary-text">来自全球<strong>100万+</strong>用户的依赖</p>
          <p class="secondary-text">智启高效工作·助力全球店家好生意</p>
        </h1>
        <div class="description">
          A商拍、数字超模、精准营销、全天候客服支持，打造跨境电商高效增长引擎，全面提升全球竞争力
        </div>
        <div class="info-sections">
          <div class="info-item">
            <img
              class="info-img-large"
              loading="lazy"
              width="91"
              height="106"
              :src="require('@/assets/indexImage/模特.png')"
            />
            <p class="info-text">免费试用</p>
            <img
              class="info-img-small"
              loading="lazy"
              width="20"
              height="20"
              src="https://www.weshop.com/ic_home_try_arrow.svg"
            />
          </div>
          <div class="info-item info-right">
            <img
              class="info-img-medium"
              loading="lazy"
              width="40"
              height="40"
              src="https://www.weshop.com/ic_home_play.svg"
            />
            <div class="info-details">
              <div class="info-detail-title">想了解更多?</div>
              <div class="info-detail-item">观看演示视频</div>
            </div>
          </div>
        </div>
      </div>
      <div class="global-trust">
        <div class="trust-images">
          <vue-seamless-scroll
            :data="svgs"
            :class-option="classOption"
            class="warp"
          >
            <ul class="ul-item">
              <li class="li-item" v-for="(item, index) in svgs" :key="index">
                <img :src="item" width="90" height="24" class="trust-image" />
              </li>
            </ul>
          </vue-seamless-scroll>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="text-content">领先的AI工具 重新定义卓越</div>
      <div class="spacer-1">
        <div class="empty-space">
          <div style="width: 580px; height: 420px">
            <img
              width="580"
              height="420"
              :src="require('@/assets/indexImage/首页-未登录-image62.png')"
              alt="Content Image 1"
              class="main-image"
            />
          </div>
        </div>
        <div class="content-container">
          <div class="header-text">AI 数字运营</div>
          <div class="carousel-container">
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>60秒完成内容创作，精准营销</p>
            </div>
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>商品与热点的智能匹配</p>
            </div>
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>全流程营销闭环管理</p>
            </div>
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>快速生成多平台内容</p>
            </div>
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>个性化分发与效果分析</p>
            </div>
          </div>
          <router-link to="/work/imgtoimg/model" class="cta-link">
            <div class="cta-text">免费试用</div>
          </router-link>
        </div>
      </div>
      <div class="spacer-1 spacer-2">
        <div class="image-gallery">
          <div class="gallery-row">
            <div class="hero-images">
              <img
                class="image1"
                width="580"
                height="420"
                loading="lazy"
                :src="require('@/assets/indexImage/首页-未登录-image60.png')"
              />
              <img
                class="image2"
                width="580"
                height="420"
                loading="lazy"
                :src="require('@/assets/indexImage/首页-未登录-image60.png')"
              />
            </div>
            <div class="featured-images">
              <div
                style="
                  position: relative;
                  overflow: hidden;
                  width: 580px;
                  height: 360px;
                "
              >
                <img
                  class="image1"
                  width="580"
                  height="360"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image53.png')"
                />
                <img
                  class="image2"
                  width="580"
                  height="360"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image53.png')"
                />
              </div>
            </div>
            <div class="thumbnail-images">
              <div
                style="
                  position: relative;
                  overflow: hidden;
                  width: 130px;
                  height: 170px;
                "
              >
                <img
                  class="image1"
                  width="130"
                  height="170"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image61.png')"
                />
                <img
                  class="image2"
                  width="130"
                  height="170"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image61.png')"
                />
              </div>
            </div>
            <div class="icon-gallery">
              <div class="icon-item">
                <img
                  class="icon"
                  width="68"
                  height="68"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image59.png')"
                />
              </div>
              <div class="icon-item">
                <img
                  class="icon"
                  width="68"
                  height="68"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image58.png')"
                />
              </div>
              <div class="icon-item">
                <img
                  class="icon"
                  width="68"
                  height="68"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image57.png')"
                />
              </div>
              <div class="icon-item">
                <img
                  class="icon"
                  width="68"
                  height="68"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image56.png')"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="content-container">
          <div class="header-text">AI 模特商拍</div>
          <div class="carousel-container">
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>创建海量自定义个人模特</p>
            </div>
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>在 60 秒内生成逼真的真人脸</p>
            </div>
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>跨越国籍、年龄、性别的人工智能模型</p>
            </div>
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>超过 200 名全球知名模特的独家数字形象</p>
            </div>
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>室内外场景，不受拍摄时间、地点限制</p>
            </div>
          </div>
          <a class="cta-link">
            <div class="cta-text">免费试用</div>
          </a>
        </div>
      </div>
      <div class="spacer-1">
        <div class="image-gallery">
          <div class="gallery-row">
            <div class="hero-images">
              <img
                class="image1"
                width="580"
                height="420"
                loading="lazy"
                src="https://ai-image.weshop.com/home-resource/home-aiprod-fore.webp"
              />
            </div>
            <div class="featured-images">
              <div
                style="
                  position: relative;
                  overflow: hidden;
                  width: 580px;
                  height: 360px;
                "
              >
                <img
                  class="image1"
                  width="580"
                  height="360"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image54.png')"
                />
                <img
                  class="image2"
                  width="580"
                  height="360"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image54.png')"
                />
              </div>
            </div>
            <div class="thumbnail-images">
              <div
                style="
                  position: relative;
                  overflow: hidden;
                  width: 130px;
                  height: 170px;
                "
              >
                <img
                  class="image1"
                  width="130"
                  height="170"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image55.png')"
                />
                <img
                  class="image2"
                  width="130"
                  height="170"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image55.png')"
                />
              </div>
            </div>
            <div class="icon-gallery">
              <div class="icon-item">
                <img
                  class="icon"
                  width="68"
                  height="68"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image52.png')"
                />
              </div>
              <div class="icon-item">
                <img
                  class="icon"
                  width="68"
                  height="68"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image51.png')"
                />
              </div>
              <div class="icon-item">
                <img
                  class="icon"
                  width="68"
                  height="68"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image50.png')"
                />
              </div>
              <div class="icon-item">
                <img
                  class="icon"
                  width="68"
                  height="68"
                  loading="lazy"
                  :src="require('@/assets/indexImage/首页-未登录-image49.png')"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="content-container">
          <div class="header-text">AI 商品商拍</div>
          <div class="carousel-container">
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>创建海量自定义个人模特</p>
            </div>
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>在 60 秒内生成逼真的真人脸</p>
            </div>
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>跨越国籍、年龄、性别的人工智能模型</p>
            </div>
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>超过 200 名全球知名模特的独家数字形象</p>
            </div>
            <div class="carousel-item">
              <img
                style="object-fit: contain"
                width="20"
                height="25"
                loading="lazy"
                src="https://www.weshop.com/ic_home_intro_item.svg"
              />
              <p>室内外场景，不受拍摄时间、地点限制</p>
            </div>
          </div>
          <a class="cta-link">
            <div class="cta-text">免费试用</div>
          </a>
        </div>
      </div>
      <div class="spacer-3">
        <router-link to="" v-for="(item,index) in bigPng" :key="index">
          <div class="custom-image-container">
            <img
              width="172"
              height="220"
              loading="lazy"
              class="custom-main-img"
              :src="item.src"
            />
            <div class="custom-text-overlay">
              {{item.name}}
              <img
                width="24"
                height="24"
                loading="lazy"
                class="custom-main-img"
                src="https://www.weshop.com/ic_home_arrow.svg"
              />
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div>
      <div class="wrapper">
        <div class="headline">优秀案例</div>
        <div class="content-area">
          <div class="card-wrapper">
            <div class="card">
              <label class="radio-container" style="background-color: #ffffff">
                <input type="radio" class="radio-control" />
                <div class="image-label">
                  <div class="image-box">
                    <img
                      class="icon-image"
                      width="36"
                      height="36"
                      loading="lazy"
                      :src="
                        require('@/assets/indexImage/首页-未登录-image.png')
                      "
                    />
                    精选
                  </div>
                </div>
              </label>
              <label class="radio-container">
                <input type="radio" class="radio-control" />
                <div class="image-label">
                  <div class="image-box">
                    <img
                      class="icon-image"
                      width="36"
                      height="36"
                      loading="lazy"
                      :src="
                        require('@/assets/indexImage/首页-未登录-image2.png')
                      "
                    />
                    服饰
                  </div>
                </div>
              </label>
              <label class="radio-container">
                <input type="radio" class="radio-control" />
                <div class="image-label">
                  <div class="image-box">
                    <img
                      class="icon-image"
                      width="36"
                      height="36"
                      loading="lazy"
                      :src="
                        require('@/assets/indexImage/首页-未登录-image3.png')
                      "
                    />
                    美妆个护
                  </div>
                </div>
              </label>
              <label class="radio-container">
                <input type="radio" class="radio-control" />
                <div class="image-label">
                  <div class="image-box">
                    <img
                      class="icon-image"
                      width="36"
                      height="36"
                      loading="lazy"
                      :src="
                        require('@/assets/indexImage/首页-未登录-image4.png')
                      "
                    />
                    家具
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div style="width: 100%; padding: 20px 20px">
          <div><load-image /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loadImage from "./loadImage.vue";
import vueSeamlessScroll from "vue-seamless-scroll";
export default {
  components: {
    loadImage,
    vueSeamlessScroll,
  },
  data() {
    return {
      svgs: [
        require("@/assets/indexImage/1.png"),
        require("@/assets/indexImage/2.png"),
        require("@/assets/indexImage/3.png"),
        require("@/assets/indexImage/4.png"),
        require("@/assets/indexImage/5.png"),
        require("@/assets/indexImage/6.png"),
        require("@/assets/indexImage/7.png"),
        require("@/assets/indexImage/8.png"),
        require("@/assets/indexImage/9.png"),
        require("@/assets/indexImage/10.png"),
        require("@/assets/indexImage/11.png"),
        require("@/assets/indexImage/12.png"),
        require("@/assets/indexImage/13.png"),
        require("@/assets/indexImage/14.png"),
        require("@/assets/indexImage/15.png"),
        require("@/assets/indexImage/16.png"),
      ],
      classOption: {
        limitMoveNum: 2,
        direction: 2,
      },
      bigPng: [
        {
          src: require("@/assets/indexImage/2-高清增强.png"),
          name: "高清增强",
        },
        {
          src: require("@/assets/indexImage/3-打光.png"),
          name: "智能打光",
        },
          {
          src: require("@/assets/indexImage/4.图生图.png"),
          name: "图生图",
        },
          {
          src: require("@/assets/indexImage/5建筑生成.png"),
          name: "建筑设计",
        },
      ],
    };
  },
};
</script>

<style scoped>
.main-content {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* align-items: center; */
}
.image-bg {
  height: 100%;
  width: 100%;
  vertical-align: middle;
  position: absolute;
  left: 0;
  top: 0;
  object-fit: cover;
}
.content-wrapper {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  z-index: 3;
  margin: 0;
  padding: 0 5%;
  color: #fff;
}
.content-wrapper1 {
  margin: 0;
  margin-bottom: 7px;
}
.primary-text {
  font-size: 23px;
  font-family: MiSans;
  font-weight: 500;
  color: #fff;
  margin: 0;
  /* padding: 3px; */
}

.secondary-text {
  line-height: 56px;
  font-family: MiSans;
  font-size: 43px;
  font-weight: 500;
  margin: 0;
  /* margin-top: 4px; */
}

.description {
  font-family: MiSans;
  font-size: 17px;
  line-height: 22px;
  margin: 0;
}

.info-sections {
  display: flex;
  gap: 20px;
  margin-top: 45px;
}

/* Styling for each info item */
.info-item {
  display: flex;
  height: 64px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #fff;
  padding: 0 20px;
  cursor: pointer;
  font-size: 18px;
  height: 54px;
  min-width: 235px;
  padding: 0 12px 0 0;
  background: linear-gradient(70deg, #fd1e49, #8859ee);
}

/* Large image styling */
.info-img-large {
  width: 65px;
  height: 76px;
  margin-right: 12px;
  display: block;
  align-self: flex-end;
}

.info-text {
  font-size: 18px;
  margin: 0;
  line-height: 28px;
}

.info-img-small {
  margin-left: 4px;
  height: 18px;
  width: 18px;
}

.info-right {
  background: hsla(0, 0%, 100%, 0.35);
  min-width: 240px;
  justify-content: flex-start;
  padding: 7px;
}

.info-details {
  margin-left: 8px;
  color: #fff;
  line-height: normal;
}

.info-detail-title {
  font-size: 10px;
  line-height: 14px;
  font-weight: 500;
}

.info-detail-item {
  font-size: 16px;
  line-height: 25px;
  font-weight: 500;
}

.global-trust {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
}
.trust-images {
  margin-bottom: 60px;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 48px;
  margin-top: 18px;
  justify-content: center;
  height: 24px;
}
.warp {
  width: 100%;
  height: 24px;
  overflow: hidden;
}

.warp ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.warp .ul-item {
  display: flex;
}

.warp .li-item {
  width: 90px;
  height: 24px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.trust-image {
  display: block;
  object-fit: contain;
  flex-shrink: 0;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 0;
}

.text-content {
  font-size: 50px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 60px;
  color: #333;
}

.spacer-1 {
  display: flex;
  flex-wrap: wrap;
  color: #333;
  justify-content: center;
  gap: 40px 140px;
  max-width: 1200px;
  align-items: center;
  flex-direction: row;
  margin-bottom: 120px;
}

.empty-space {
  padding-right: 40px;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 2;
}

/* ============================== */
.content-container {
  display: flex;
  width: 420px;
  flex-direction: column;
  align-items: flex-start;
}
.header-text {
  font-weight: 500;
  font-size: 30px;
}
.carousel-container {
  margin-top: 20px;
  color: #97a0b4;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.carousel-item {
  display: flex;
  gap: 12px;
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;
}
.carousel-item p {
  margin: 0;
  padding: 0;
}
.cta-text {
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #fff;
  padding: 0 60px;
  cursor: pointer;
  background-color: #7530fe;
  height: 50px;
}
.spacer-2 {
  flex-direction: row-reverse;
}
.image-gallery {
  padding-right: 40px;
}
.gallery-row {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 2;
}
.hero-images {
  position: relative;
  overflow: hidden;
  width: 580px;
  height: 420px;
}
.image1 {
  width: 100%;
  height: auto;
  display: block;
}
.image2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.featured-images {
  position: absolute;
  top: 60px;
  border-radius: 20px;
}
.thumbnail-images {
  position: absolute;
  border-radius: 20px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  top: 20px;
  right: -40px;
}
.icon-gallery {
  display: flex;
  gap: 12px;
  margin-top: 26px;
}
.icon-item {
  position: relative;
  cursor: pointer;
}
.icon {
  display: block;
}
.icon-gallery .icon-item:first-child::before {
  content: "";
  position: absolute;
  border: 4px solid #7530fe;
  border-radius: 14px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
/* =============== */
.spacer-3 {
  display: flex;
  gap: 40px;
  margin-top: 20px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.custom-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  max-width: 260px;
}
.custom-main-img {
  display: block;
}
.custom-text-overlay {
  font-size: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
}
.headline {
  font-size: 50px;
  font-weight: 500;
  margin-top: 40px;
  color: #333;
  text-align: center;
}
.content-area {
  margin-top: 20px;
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-wrapper {
  padding: 0 !important;
  border-radius: 38px !important;
  border: 10px solid #f5f7fd !important;
  max-width: 100%;
  overflow: hidden;
  background-color: #f5f7fd !important;
  box-sizing: border-box;
  margin: 0;
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  display: inline-block;
  background: #f5f5f5;
  color: #333;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.card {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-items: flex-start;
  width: 100%;
}
.radio-container {
  position: relative;
  text-align: center;
  cursor: pointer;
  transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  border-radius: 4px;
  transform: translateZ(0);
  margin-right: 18px;
  /* background-color: #ffffff; */
  border-radius: 28px !important;
}
.radio-control {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
.image-label {
  min-height: 28px;
  line-height: 28px;
  padding: 0 11px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.image-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 0 10px;
  background-color: transparent;
  border-radius: 28px;
  cursor: pointer;
  height: 56px;
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
}
.icon-image {
  border-radius: 18px;
}
</style>>
