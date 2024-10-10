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
            <div class="workButton">AIGC工作台</div>
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
                  <div class="dropdown-select">
                    <router-link to="/order2"> 使用记录 </router-link>
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
      width="400px"
      class="login-dialog"
      @keyup.enter.native="login"
      :before-close="closeDialog"
    >
      <div class="login-container">
        <div class="login-left" v-if="phoneFlag">
          <div class="qrcode_tips">
            <i class="qrcode_logo"></i>
            使用微信扫一扫登录
          </div>
          <div class="qrcode_app_wrp">
            「<strong class="qrcode_app">AI智启</strong>」
          </div>
          <div>
            <div
              v-if="qrExpired"
              class="expired-qr-code"
              @click="regenerateQRCode"
            >
              <i class="el-icon-refresh"></i>
              <!-- 显示循环箭头 -->
            </div>
            <img id="qr-code-img" :src="wxImage" />
          </div>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
            height: 100%;
          "
          v-if="!phoneFlag"
        >
          <div
            style="
              font-size: 24px;
              line-height: 28px;
              margin-bottom: 10px;
              white-space: nowrap;
              font-weight: 400;
            "
          >
            开启与AI智启的创作之旅
          </div>
          <div style="width: 70%">
            <el-input
              placeholder="请输入手机号"
              v-model="loginForm.phone"
              class="input-field"
            ></el-input>
          </div>
          <div style="width: 70%; position: relative">
            <el-input v-model="loginForm.code" class="input-field code-input">
            </el-input>
            <div @click="handleGetCode" class="securityCode">
              {{ countdown > 0 ? `${countdown}秒后可再次获取` : "获取验证码" }}
            </div>
          </div>

          <el-button type="primary" class="login-btn" @click="login">
            登录
          </el-button>
        </div>
        <div>
          <p class="agreement">
            登录即表示同意AI智启
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
import { getSmsCode, generateWxImage } from "@/api/login";
import { setIsLogin, setToken } from "@/utils/auth";
import { updateUserById } from "@/api/system/user";
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
      menuChild: {
        showflag: false,
        uniqueId: "",
        childMenu: [],
      },
      wxImage: null,
      phoneFlag: true,
      userInfo: {},
      qrExpired: false,
      timerId: null,
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
      this.$nextTick(async () => {
        await this.generateQRCode();
        this.setQRCodeTimer();
        // this.get_wx_qrcode();
      });
    },
    closeDialog() {
      this.phoneFlag = true;
      this.userInfo = {};
      this.loginDialogVisible = false;
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
    async login() {
      if (!this.validatePhoneNumber(this.loginForm.phone)) return;
      if (this.loginForm.code == "") {
        this.$message({
          message: "❌ 验证码不能为空 ❗",
          type: "",
        });
        return;
      }
      const res = await updateUserById(
        this.userInfo.user.userId,
        this.loginForm
      );
      if (res.code !== 200) {
        this.$message({
          message: "❌ 手机号异常或验证码出错 ❗",
          type: "",
        });
      }
      setToken(this.userInfo.toekn);
      setIsLogin(true);
      this.$store.commit("SET_TOKEN", this.userInfo.toekn);
      this.$store.commit("SET_ISLOGIN", true);
      this.loginDialogVisible = false;
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
    async generateQRCode() {
      const res = await generateWxImage();
      this.wxImage = res.img;
      this.loginForm.uuid = res.uuid;
      this.qrExpired = false; // 重置二维码状态
    },
    setQRCodeTimer() {
      if (this.timerId) {
        clearTimeout(this.timerId);
      }
      this.timerId = setTimeout(() => {
        this.qrExpired = true;
        clearInterval(this.intervalId);
        this.intervalId = null;
      }, 180000); // 3分钟
    },
    // 重新生成二维码
    regenerateQRCode() {
      this.generateQRCode();
      this.setQRCodeTimer(); // 重新设置定时器
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
          this.$store.dispatch("wxLogin", this.loginForm.uuid).then((res) => {
            if (res.message === "用户已登录") {
              console.log(res, "==================");
              if (!res.user.phonenumber) {
                this.userInfo = { toekn: res.token, user: res.user };
                console.log(this.userInfo);
                this.phoneFlag = false;
                if (this.timer2) {
                  clearInterval(this.timer2);
                  this.timer2 = null;
                }
                return;
              }
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
  height: 30px;
  margin-right: 5px;
  margin-top: 5px;
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
  gap: 6px;
}

.workButton {
  padding: 0 30px;
  height: 36px;
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
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .el-dialog {
  border-radius: 15px;
}
::v-deep .el-dialog__body {
  padding: 10px 0;
  height: 520px;
}
.login-container {
  display: flex;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.login-left {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.qrcode_tips {
  margin-right: 10px;
  font-size: 17px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qrcode_logo {
  display: inline-block;
  vertical-align: bottom;
  font-size: 24px;
  width: 1em;
  height: 1em;
  margin-right: 8px;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("../../../assets/icons/download.png");
}
.qrcode_app_wrp {
  font-size: 22px;
  margin-top: 24px;
  margin-bottom: 32px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  letter-spacing: 1px;
}
.expired-qr-code {
  width: 160px;
  height: 160px;
  position: absolute;
  backdrop-filter: blur(5px);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.el-icon-refresh{
  font-size: 30px;
}
#qr-code-img {
  width: 160px;
  height: 160px;
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
::v-deep .el-input__inner {
  height: 50px;
  border-radius: 12px;
}
.securityCode {
  position: absolute;
  right: 14px;
  top: 40%;
  transform: translateY(-60%);
  cursor: pointer;
  color: #c0c4cc;
}
.login-btn {
  width: 70%;
  font-size: 16px;
  height: 40px;
  border-radius: 12px;
}
.agreement {
  display: flex;
  justify-content: center;
  margin: 0;
  margin-top: 20px;
  font-size: 12px;
  color: #999;
}

.agreement a {
  text-decoration: underline;
}
</style>