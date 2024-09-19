<template>
  <div id="app">
    <router-view />
    <theme-picker />
    <div v-if="tops" :class="tops ? 'navbar' : 'navbar-top'">
      <div class="kfShow right" v-if="showKf">
        <span class="showtitle">官方客服</span>
        <el-image
          style="width: 100px; height: 100px; border-radius: 8px"
          :src="require('@/assets/logo/企业微信二维码.jpg')"
          fit="cover"
        >
        </el-image>
      </div>
      <a @mouseover="showKfCode" @mouseleave="hideKfCode"
        ><i class="el-icon-service"></i
      ></a>

      <div class="qrShow right" v-if="showQR">
        <span class="showtitle">关注公众号</span>
        <el-image
          style="width: 100px; height: 100px; border-radius: 8px"
          :src="require('@/assets/logo/艾铂特人工智能公众号二维码.jpg')"
          fit="cover"
        >
        </el-image>
      </div>
      <a @mouseover="showQRCode" @mouseleave="hideQRCode"
        ><i class="el-icon-full-screen"></i
      ></a>
      <el-tooltip
        class="item"
        effect="dark"
        content="返回顶部"
        placement="left"
      >
        <a @click="gotop"
          ><i class="el-icon-caret-top"></i>
          <br />
          <span>顶部</span></a
        >
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";

export default {
  name: "App",
  components: { ThemePicker },
  metaInfo() {
    return {
      title:
        this.$store.state.settings.dynamicTitle &&
        this.$store.state.settings.title,
      titleTemplate: (title) => {
        return title
          ? `${title} - ${process.env.VUE_APP_TITLE}`
          : process.env.VUE_APP_TITLE;
      },
    };
  },
  data() {
    return {
      showQR: false,
      showKf: false,
      tops: false,
      heights: window.innerHeight,
      scrolltop: "",
    };
  },
  mounted() {
    window.addEventListener("scroll", this.scrollToTop);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop);
  },
  methods: {
    showQRCode() {
      this.showQR = true;
    },
    hideQRCode() {
      this.showQR = false;
    },
    showKfCode() {
      this.showKf = true;
    },
    hideKfCode() {
      this.showKf = false;
    },
    scrollToTop() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.scrolltop = scrollTop;
      if (parseInt(this.scrolltop) > parseInt(this.heights) / 3) {
        this.tops = true;
      } else {
        this.tops = false;
      }
    },
    gotop() {
      let timer = setInterval(() => {
        document.documentElement.scrollTop = document.body.scrollTop =
          this.scrolltop - 90;
        if (this.scrolltop === 0) {
          clearInterval(timer);
        }
      }, 15);
    },
  },
};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
.navbar {
  text-align: center;
  background-color: #fff;
  position: fixed;
  top: 68%;
  right: 2%;
  width: 55px;
  height: 165px;
  z-index: 999;
  border-radius: 10px;
}
.navbar-top {
  text-align: center;
  background-color: #fff;
  position: fixed;
  top: 68%;
  right: 2%;
  width: 55px;
  height: 165px;
  z-index: 999;
  border-radius: 10px;
}
.navbar a {
  color: rgb(0, 0, 0);
  text-decoration: none;
  width: 100%;
  height: 55px;
  display: block;
  font-size: 30px;
  padding-top: 5px;
}
.navbar a:last-child {
  color: rgb(0, 0, 0);
  text-decoration: none;
  width: 100%;
  height: 55px;
  display: block;
  font-size: 15px;
  border-radius: 0px 0px 10px 10px;
}
.navbar a:first-child {
  color: rgb(0, 0, 0);
  text-decoration: none;
  width: 55px;
  height: 55px;
  display: block;
  font-size: 30px;
  border-radius: 10px 10px 0px 0px;
}
.navbar a:hover {
  background-color: #d9534f;
  color: white;
}
.navbar-top a {
  color: rgb(0, 0, 0);
  text-decoration: none;
  width: 100%;
  height: 55px;
  display: block;
  font-size: 30px;
  padding-top: 5px;
}
.navbar-top a:last-child {
  color: rgb(0, 0, 0);
  text-decoration: none;
  width: 100%;
  height: 55px;
  display: block;
  font-size: 30px;
  border-radius: 0px 0px 10px 10px;
}
.navbar-top a:first-child {
  color: rgb(0, 0, 0);
  text-decoration: none;
  width: 55px;
  height: 55px;
  display: block;
  font-size: 30px;
  border-radius: 10px 10px 0px 0px;
}
.navbar-top a:hover {
  background-color: #d9534f;
  color: white;
}
.qrShow,
.kfShow {
  position: fixed;
  top: calc(68% + 30px);
  right: calc(3% + 70px);
  z-index: 999;
  background-color: #fff;
  width: 120px;
  height: 150px;
  color: white;
  text-align: center;
  border-radius: 10px;
  font-family: sans-serif;
  padding-top: 5px;
}
.qrShow:after,
.kfShow:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border: 8px solid;
}
.kfShow {
  top: calc(65%);
}
.right:after {
  border-left-color: rgb(179, 179, 179);
  left: 100%;
  top: 50%;
  margin-top: -7px;
}
.showtitle {
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: rgba(4, 17, 51, 0.45);
}
</style>
