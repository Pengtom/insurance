<template>
  <header
    :class="{
      header: true,
      'header-active': menuChild.showflag || flag,
      'header-sticky': isSticky,
    }"
  >
    <div class="header-menu">
      <div class="header-nav">
        <div class="logo">
          <router-link to="/">
            <img
              :src="
                menuChild.showflag || flag || headerClassflag
                  ? require('@/assets/indexImage/logo.png')
                  : require('@/assets/indexImage/logo1.png')
              "
              @click="close"
            />
          </router-link>
        </div>
        <el-menu
          :class="{
            'active-menu': menuChild.showflag || flag || headerClassflag,
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
        <div class="logged" v-if="isLogin">
          <router-link to="/index">
            <div class="workButton">我的工作台</div>
          </router-link>
          <el-dropdown trigger="click">
            <div class="avatarArea">
              <img
                loading="lazy"
                :src="require('@/assets/icons/tou.png')"
                width="40"
                height="40"
                decoding="async"
                data-nimg="1"
                class="avatar"
              />
            </div>
            <el-dropdown-menu slot="dropdown">
              <div class="dropdown-main">
                <div class="dropdown-main-header">
                  <img
                    loading="lazy"
                    :src="require('@/assets/icons/hui.png')"
                    width="40"
                    height="40"
                    decoding="async"
                    data-nimg="1"
                    class="avatar"
                  />
                  <div class="dropdown-main-text">
                    ****{{ phone.slice(-4) }}
                  </div>
                </div>
                <div class="parttion"></div>
                <div class="dropdown-main-content">
                  <div class="dropdown-select">
                    <router-link to="/order"> 我的算力 </router-link>
                  </div>
                  <div class="dropdown-select">
                    <router-link to="/order1"> 我的订单 </router-link>
                  </div>
                  <div class="parttion"></div>
                  <div @click="logout">退出登录</div>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-button
          :class="{
            'login-button': true,
            'active-button': menuChild.showflag || flag || headerClassflag,
          }"
          @click="showLogin"
          v-if="!isLogin"
        >
          登录
        </el-button>
      </div>
    </div>
    <div v-if="menuChild.showflag" class="header-menu-down" @click="close">
      <expansionMenu
        id="expansionMenu"
        :childMenu="menuChild.childMenu"
        @click.stop
      />
    </div>
    <el-dialog
      :visible.sync="loginDialogVisible"
      :modal="false"
      class="login-dialog"
      @keyup.enter.native="login"
      @close="loginDialogVisible = false"
    >
      <div class="login-container">
        <div class="login-left">
          <div id="qr-code-img"></div>
        </div>
        <div class="login-right">
          <el-input
            placeholder="请输入手机号"
            v-model="loginForm.phone"
            class="input-field"
          ></el-input>
          <el-input
            placeholder="请输入验证码"
            v-model="loginForm.code"
            class="input-field code-input"
          >
            <template #append>
              <el-button @click="handleGetCode" :disabled="countdown > 0">
                {{
                  countdown > 0 ? `${countdown}秒后可再次获取` : "获取验证码"
                }}
              </el-button>
            </template>
          </el-input>
          <el-button type="primary" class="login-btn" @click="login">
            登录
          </el-button>
          <p class="agreement">
            登录即表示同意
            <router-link to="/userAgrrement" target="_blank"
              >用户服务协议</router-link
            >
            和
            <router-link to="privacypolicy" target="_blank"
              >隐私条款</router-link
            >
          </p>
        </div>
      </div>
    </el-dialog>
  </header>
</template>

<script>
import MenuItem from "./menuItem.vue";
import expansionMenu from "./expansionMenu.vue";
import { getSmsCode } from "@/api/login";
import { mapGetters } from "vuex";
export default {
  components: {
    expansionMenu,
    MenuItem,
  },
  props: {
    menuItems: Array,
    flag: Boolean,
  },
  data() {
    return {
      loginDialogVisible: false,
      loginForm: {
        phone: "",
        code: "",
        uuid: "",
      },
      countdown: 0,
      redirect: undefined,
      timer: null,
      timer2: null,
      state: Math.ceil(Math.random() * 1000),
      menuChild: {
        showflag: false,
        uniqueId: "",
        childMenu: [],
      },
    };
  },
  computed: {
    ...mapGetters(["isLogin", "phone"]),
    headerClassflag() {
      return this.$route.path === "/" ? false : true;
    },
    isSticky() {
      const stickyPaths = ["/order", "/"];
      return !stickyPaths.includes(this.$route.path);
    },
  },
  methods: {
    close(event) {
      const menu = this.$el.querySelector("#expansionMenu");
      if (menu && !menu.contains(event.target)) {
        this.menuChild.showflag = !this.menuChild.showflag;
      }
    },
    showLogin() {
      this.loginDialogVisible = true;
      this.$nextTick(() => {
        this.get_wx_qrcode();
      });
    },
    validatePhoneNumber(phoneNumber) {
      const reg = /^[1][3-9][0-9]{9}$/;

      // 检查是否为空
      if (!phoneNumber) {
        this.$message({
          message: "❌ 请输入手机号 ❗",
          type: "error",
        });
        return false;
      }

      // 检查手机号格式
      if (!reg.test(phoneNumber)) {
        this.$message({
          message: "❌ 请输入正确的电话号码 ❗",
          type: "error",
        });
        return false;
      }

      return true;
    },
    async handleGetCode() {
      if (!this.validatePhoneNumber(this.loginForm.phone)) return;
      this.startCountdown();
      // 发送获取验证码的请求
      await getSmsCode(this.loginForm.phone).then((res) => {
        this.loginForm.uuid = res.uuid;
        console.log(res);
      });
    },
    startCountdown() {
      this.countdown = 60;
      this.timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    login() {
      if (!this.validatePhoneNumber(this.loginForm.phone)) return;
      if (this.loginForm.code == "") {
        this.$message({
          message: "❌ 验证码不能为空 ❗",
          type: "",
        });
        return;
      }
      this.$store.dispatch("SMSLogin", this.loginForm).then(() => {
        this.$router.push({ path: this.redirect || "/index" }).catch(() => {});
      });
      this.loginDialogVisible = false;
      console.log(111);
    },
    get_wx_qrcode() {
      var obj = new WxLogin({
        self_redirect: true, //扫码后默认重新打开的回调地址，不是当前页打开
        id: "qr-code-img",
        appid: "wx03e5710bb6714893",
        scope: "snsapi_login",
        redirect_uri: encodeURIComponent("http://50x8p19381.vicp.fun/wxCheck"),
        state: this.state,
        style: "white",
        href: "data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZXsKd2lkdGg6IDIwMHB4Owp9CmJvZHl7CmNvbG9yOiAjMzMzOwp9",
      });
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
    },
    async logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.href = "/";
      });
    },
  },
  watch: {
    $route: {
      handler: function (route) {
        this.menuChild.showflag = false;
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
    loginDialogVisible(newVal) {
      if (newVal === true) {
        this.timer2 = setInterval(() => {
          this.$store.dispatch("wxLogin", this.state).then((res) => {
            if (res.message === "用户已登录") {
              this.$router
                .push({ path: this.redirect || "/index" })
                .catch(() => {});
            }
          });
        }, 2000);
      } else {
        if (this.timer2) {
          clearInterval(this.timer2);
          this.timer2 = null;
        }
      }
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.timer2) {
      clearInterval(this.timer2);
      this.timer2 = null;
    }
  },
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  display: flex;
  width: 100%;
  height: 80px;
  z-index: 999;
  flex-direction: column;
}
.header-sticky {
  position: sticky;
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

.logged {
  display: flex;
  align-items: center;
  gap: 30px;
}

.workButton {
  padding: 0 24px;
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  background: linear-gradient(70deg, #fd1e49, #8859ee);
  color: #fff;
}
.avatarArea {
  position: relative;
  display: flex;
  align-tems: center;
}
.avatar {
  cursor: pointer;
  border-radius: 50%;
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
.dropdown-main {
  width: 240px;
  border-radius: 10px;
  padding: 30px 30px 8px;
  background-color: #fff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  color: #333;
}
.dropdown-main-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dropdown-main-text {
  margin-top: 10px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}
.parttion {
  height: 1px;
  width: 180px;
  background-color: #e3e3e3;
  margin-bottom: 18px;
  margin-top: 6px;
}
.dropdown-main-content {
  display: flex;
  justify-content: left;
  flex-direction: column;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  margin-bottom: 12px;
}
.dropdown-select {
  margin-bottom: 12px;
}
.header-menu-down {
  height: calc(100vh - 80px);
  background-color: hsla(0, 0%, 100%, 0.6);
  backdrop-filter: blur(30px);
  position: absolute;
  top: 80px;
  width: 100%;
  overflow: hidden;
}
.login-dialog {
  padding: 80px 0;
  backdrop-filter: blur(15px);
}
.login-container {
  display: flex;
}
.login-left {
  width: 50%;
  /* background-color: #f5f5f5; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-right: 1px solid #e0e0e0;
  text-align: center;
}
#qr-code-img {
  width: 300px;
  height: 300px;
  display: flex;
}

.login-right {
  width: 50%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.input-field {
  margin-bottom: 20px;
  width: 100%;
}
.login-btn {
  width: 100%;
  font-size: 16px;
  height: 40px;
  border-radius: 20px;
}
.agreement {
  margin-top: 20px;
  color: #999;
}

.agreement a {
  color: #409eff;
}
</style>