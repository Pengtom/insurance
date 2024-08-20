<template>
  <header
    :class="{ header: true, 'header-active': menuChild.showflag || flag }"
  >
    <div class="header-menu">
      <div class="header-nav">
        <div class="logo">
          <img
            :src="
              menuChild.showflag || flag
                ? require('@/assets/indexImage/logo.png')
                : require('@/assets/indexImage/logo1.png')
            "
          />
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
        <div class="logged" v-if="isLogin">
          <router-link to="/index">
            <div class="workButton">我的工作台</div>
          </router-link>
          <div class="avatarArea">
            <img
              loading="lazy"
              src="/girl.png"
              width="40"
              height="40"
              decoding="async"
              data-nimg="1"
              class="avatar"
            />
          </div>
        </div>
        <el-button
          :class="{
            'login-button': true,
            'active-button': menuChild.showflag || flag,
          }"
          @click="showLogin"
          v-if="!isLogin"
        >
          登录
        </el-button>
      </div>
    </div>
    <div v-if="menuChild.showflag" class="header-menu-down">
      <expansionMenu :childMenu="menuChild.childMenu" />
    </div>
    <el-dialog
      :visible.sync="loginDialogVisible"
      width="40%"
      :modal-append-to-body="false"
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
            <a href="#">用户服务协议</a> 和 <a href="#">隐私条款</a>
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
    ...mapGetters(["isLogin"]),
  },
  methods: {
    showLogin() {
      this.loginDialogVisible = true;
      this.$nextTick(() => {
        this.get_wx_qrcode();
      });
    },
    async handleGetCode() {
      const reg = /^[1][3-9][0-9]{9}$/;
      if (!this.loginForm.phone) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!reg.test(this.loginForm.phone) && this.loginForm.phone != "") {
        this.$message.error("请输入正确的电话号码");
        return;
      }
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
      if (this.loginForm.code == "") {
        this.$message.error("验证码不能为空");
      }
      this.$store.dispatch("SMSLogin", this.loginForm).then(() => {
        this.$router.push({ path: this.redirect || "/index" }).catch(() => {});
      });
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
  },
  watch: {
    $route: {
      handler: function (route) {
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
  background-color: #cc17c3;
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
  padding: 0;
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