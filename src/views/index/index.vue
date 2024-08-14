<template>
  <div>
    <header :class="{'header': true, 'header-active': menuChild.showflag || flag}">
      <div class="header-menu">
        <div class="header-nav">
          <div class="logo">
            <img :src="menuChild.showflag || flag?'../../assets/indexImage/logo1.png':'../../assets/indexImage/logo.png'" alt="Logo" />
          </div>
          <el-menu 
            :class="{
              'active-menu': menuChild.showflag || flag,
            }"            
          >
            <menu-item
                v-for="(item, index) in menuItems"
                :key="index"
                :item="item"
                :index="'menu-' + index"
                v-on:menuChild="menuChildItem"
              />
          </el-menu>
          <el-button :class="{'login-button': true, 'active-button': menuChild.showflag || flag}">
              登录
          </el-button>
        </div>
      </div>
      <div v-if="menuChild.showflag" class="header-menu-down">
        <expansionMenu :childMenu="menuChild.childMenu"/>
      </div>
    </header>

    <div class="main-content">
      <div class="content-wrapper">
        <h1 class="content-wrapper">
          <p class="primary-text">
            专注电商需求的AI商拍工具
          </p>
          <p class="secondary-text">
            鼠标就是快门 点击即看成片
          </p>
        </h1>
        <div class="description">
          打破模特、经纪、摄影、后期、场租、机酒的限制
        </div>
       <div class="info-sections">
          <div class="info-item">
            <img class="info-img-large" loading="lazy" width="91" height="106" src="https://www.weshop.com/ic_home_ai_model.webp">
            <p class="info-text">免费试用</p>
            <img class="info-img-small" loading="lazy" width="20" height="20" src="https://www.weshop.com/ic_home_try_arrow.svg">
          </div>
          <div class="info-item info-right">
            <img class="info-img-medium" loading="lazy" width="40" height="40" src="https://www.weshop.com/ic_home_play.svg">
            <div class="info-details">
              <div class="info-detail-title">想了解更多?</div>
              <div class="info-detail-item">观看演示视频</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div style="width:200px;height:500px;background:green"></div>
      <div style="width:200px;height:500px;background:red"></div>
    </div>
  </div>
</template>

<script>
import MenuItem from "./menuItem.vue";
import expansionMenu from "./expansionMenu.vue";
import { getDefaultRouters } from "@/api/menu";

export default {
  components: {
    MenuItem,
    expansionMenu
  },
  data() {
    return {
      menuItems: [],
      menuChild: {
        showflag: false,
        uniqueId: "",
        childMenu: []
      },
      flag:false, //窗口显示头部字体颜色
    };
  },
  computed:{
    scrollThreshold(){
      return window.innerHeight * 0.3
    }
  },
  mounted() {
    getDefaultRouters().then((res) => {
      this.menuItems = res.data;
    });
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
     handleScroll() {
      if (window.scrollY > this.scrollThreshold) {
        this.flag = true;
      }else{
        this.flag = false
      }
    },
    menuChildItem(data, uniqueId) {
      if (this.menuChild.uniqueId === "") {
        this.menuChild.uniqueId = uniqueId;
        this.menuChild.showflag = true;
      } else {
        if (this.menuChild.uniqueId === uniqueId) {
          this.menuChild.showflag = !this.menuChild.showflag;
          this.menuChild.uniqueId = "";
        } else {
          this.menuChild.uniqueId = uniqueId;
        }
      }
      this.menuChild.childMenu = data;
    }
  }
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #000;
  color: #fff;
  overflow-x: hidden;
  height: 100%; /* Ensure the body and html take the full height */
}

.header {
  position: fixed;
  top: 0;
  display: flex;
  width: 100%;
  height: 80px;
  z-index: 999;
  flex-direction: column;
}

.header-active .header-nav {
  background-color: #fff;
}

::v-deep .active-menu .el-menu-item {
  color: #333 !important;
}

.header-menu {
  position: absolute;
  z-index: 999;
  width: 100%;
  height: 100%;
}

.header-nav {
  color: #fff;
  background: hsla(0, 0%, 100%, 0);
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 50px;
}

.header-nav .logo {
  display: flex;
  align-items: center;
}

.header-nav .logo img {
  height: 40px;
  margin-right: 10px;
}


.el-menu {
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 20px;
  border-bottom: 1px;
  background-color: transparent;
  border-right: none;
}

::v-deep .el-menu-item {
  font-size: 16px;
  color: #fff !important;
}

::v-deep .el-menu-item:hover {
  background-color: transparent;
}

::v-deep .el-menu-item.is-active {
  background-color: transparent; /* 默认焦点背景色 */
}

.login-button {
  border: 1px solid #fff;
  padding: 0 24px;
  height: 40px;
  color: #fff;
  display: flex;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
  background-color: transparent;
}

.active-button {
  border-color: #333;
  color: #333;
}

.header-menu-down {
  height: calc(100vh - 80px);
  background-color: hsla(0, 0%, 100%, .6);
  backdrop-filter: blur(30px);
  position: absolute;
  top: 80px;
  width: 100%;
  overflow: hidden;
}

.main-content {
  position: relative;
  text-align: center;
  padding: 100px 20px;
  background: url('../../assets/indexImage/首页-未登录-image63.jpg') no-repeat center center/cover;
  opacity: 0.9;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
  margin: 0;
  padding: 10px;
}

.primary-text {
  font-size: 24px;
  font-weight: 500;
  color: #fff;
  margin: 0;
  padding: 3px;
}

.secondary-text {
  line-height: 56px;
  font-size: 40px;
  font-weight: 500;
  margin: 0;
  margin-top: 4px;
}

.description {
  font-size: 16px;
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
  background-color: #7530fe;
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

.info-img-small{
  margin-left: 4px;
  height: 18px;
  width: 18px;
}

.info-right{
  background-color: hsla(0, 0%, 100%, .35);
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

</style>
