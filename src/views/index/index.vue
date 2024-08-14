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
      <div>
        <h1>
          <p>
            专注电商需求的AI商拍工具
          </p>
          <p>
            鼠标就是快门 点击即看成片
          </p>
        </h1>
        <div>打破模特、经纪、摄影、后期、场租、机酒的限制</div>
        <div>
          <a href="#">免费试用</a>
          <a href="#">观看演示视频</a>
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
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

</style>
