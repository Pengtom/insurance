<template>
  <div class="home">
    <el-header class="header">
      <div class="header-content">
        <div class="logo">
          <img src="@/assets/logo/logo.png" alt="WeShop Logo" />
        </div>
        <el-menu mode="horizontal" class="menu">
          <!-- 递归渲染菜单项 -->
          <menu-item
            v-for="(item, index) in menuItems"
            :key="index"
            :item="item"
            :index="'menu-' + index"
            v-on:menuChild = 'menuChild'
          />
        </el-menu>
        <div v-if="!isLogin" class="logged">
          <router-link to="/index">
              <div class="workButton">
                我的工作台
              </div>
          </router-link>
          <div class="avatarArea">
            <img loading="lazy" 
              src="/girl.png" 
              width="40" 
              height="40" 
              decoding="async" 
              data-nimg="1"
              class="avatar">
          </div>  
        </div>
        <el-button v-if="isLogin" type="primary" class="login-button" @click="showLogin">
          登录
        </el-button>
      </div>
      <expansionMenu v-if="showflag" :childMenu="childMenu"/>
    </el-header>

    <el-main class="main-content">
      <div class="banner">
        
      </div>

      <div class="partners">
      </div>
    </el-main>

    <el-footer class="footer">
      <p>© 2024 All Rights Reserved.</p>
    </el-footer>
    
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
          <el-tabs v-model="activeTab" type="card" class="login-tabs">
            <el-tab-pane label="账号密码登录" name="account">
              <el-input
                placeholder="请输入账号"
                v-model="loginForm.username"
                class="input-field"
              ></el-input>
              <el-input
                placeholder="请输入密码"
                v-model="loginForm.password"
                type="password"
                class="input-field"
              ></el-input>
               <el-input
                placeholder="请输入验证码"
                style="width: 63%"
                v-model="loginForm.code"
                class="input-field code-input"
              />
              <img :src="codeUrl" @click="getCode" class="login-code-img"/>
            </el-tab-pane>
            <el-tab-pane label="手机号登录" name="phone">
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
                    {{ countdown > 0 ? `${countdown}秒后可再次获取` : "获取验证码" }}
                  </el-button>
                </template>
              </el-input>
            </el-tab-pane>
          </el-tabs>
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
  </div>
</template>
<script>
import MenuItem from "./menuItem.vue"; // 导入递归组件
import expansionMenu from "./expansionMenu.vue"
import { getDefaultRouters } from "@/api/menu";
import { getSmsCode, getCodeImg } from '@/api/login'
export default {
  components: {
    MenuItem,
    expansionMenu
  },
  data() {
    return {
      showflag:false,
      loginDialogVisible: false,
      loginForm: {
        phone: "",
        code: "",
        uuid:""
      },
      codeUrl: "",
      countdown: 0,
      timer: null,
      timer2: null,
      menuItems: [],
      childMenu:[],
      uniqueId:"",
      redirect: undefined,
      activeTab: "account",
      state: Math.ceil(Math.random() * 1000)
      // isLogin:this.$store.state.user.isLogin
    };
  },
  computed:{
    isLogin: {
    get() {
      return this.$store.state.user.isLogin;
    },
    set(value) {
      // 调用 Vuex store 的 action 来更新状态
      this.$store.commit('SET_ISLOGIN', value);
    }
    }
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
          this.$store.dispatch("wxLogin", this.state).then( res => {
            if(res.message === "用户已登录"){
              this.$router.push({ path: this.redirect || "/index" }).catch(()=>{});
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
  mounted() {
    getDefaultRouters().then((res) => {
      this.menuItems = res.data;
    });
    this.isLogin = this.$store.state.user.isLogin
    console.log(this.isLogin);
  },
  methods: {
    showLogin() {
      this.loginDialogVisible = true;
      this.$nextTick(() => {
        this.get_wx_qrcode();
      });
      this.getCode()
    },
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    async handleGetCode() {
      const reg =/^[1][3-9][0-9]{9}$/;
      if (!this.loginForm.phone) {
        this.$message.error("请输入手机号");
        return;
      }
      if(!reg.test(this.loginForm.phone) && this.loginForm.phone != ''){
        this.$message.error("请输入正确的电话号码")
        return;
      }
      this.startCountdown();
      // 发送获取验证码的请求
      await getSmsCode(this.loginForm.phone).then(res=>{
        this.loginForm.uuid = res.uuid
        console.log(res);
      })
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
      if(this.activeTab === 'phone'){
        if(this.loginForm.code == ''){
          this.$message.error("验证码不能为空")
        }
        this.$store.dispatch("SMSLogin", this.loginForm).then(() => {
        this.$router
          .push({ path: this.redirect || "/index" })
          .catch(() => {});
        });
        console.log(111);
      }

      if(this.activeTab === 'account'){
        this.$store.dispatch("Login", this.loginForm).then(() => {
          this.$router.push({ path: this.redirect || "/index" }).catch(()=>{});
        }).catch(() => {
          if (this.captchaEnabled) {
            this.getCode();
          }
        });
      } 
    },
    get_wx_qrcode() {
      var obj = new WxLogin({
        self_redirect: true,//扫码后默认重新打开的回调地址，不是当前页打开
        id: 'qr-code-img',
        appid: 'wx03e5710bb6714893',
        scope: 'snsapi_login',  
        redirect_uri: encodeURIComponent('http://50x8p19381.vicp.fun/wxCheck'),
        state: this.state,
        style: 'white',
        href:'data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZXsKICB3aWR0aDoyMDBweDsKIG1hcmdpbi10b3A6MHB4Owp9Ci5pbmZvewogICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgIGxlZnQ6IC0xMiU7Cn0KLmxvZ2luUGFuZWx7CiB3aWR0aDoyMDBweDsKfQ==',
      })
    },
    menuChild(data,uniqueId){
      if (this.uniqueId == "") {
        this.uniqueId = uniqueId;
        this.showflag = true;
      } else {
        if (this.uniqueId === uniqueId) {
          this.showflag = !this.showflag
          this.uniqueId = ""
        } else {
          this.uniqueId = uniqueId;
        }
      }
      this.childMenu = data;
    }
  },
  beforeDestroy(){
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }    
    if (this.timer2) {
      clearInterval(this.timer2);
      this.timer2 = null;
    }    
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
}

.menu {
  flex: 1;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  margin-left: 20px;
  border-bottom: 1px;
}

.logged{
  display: flex;
  align-items: center;
  gap: 30px;
}

.workButton{
  padding: 0 24px;
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  background-color: #cc17c3;
  color: #fff;
}

.avatarArea{
  position: relative;
  display: flex;
  align-tems: center;
}
.avatar{
  cursor: pointer;
  border-radius: 50%;
}
.login-button {
  margin-left: auto;
}

.main-content {
  text-align: center;
  background-color: #f5f5f5;
  padding: 0;
  margin: 0;
  margin-top: calc(100vh - var(--HomeHeaderHeight)); /* 确保内容在header下方 */
  /* background-image: url("../../assets/indexImage/首页-未登录-image63.jpg"); */
}

.banner {
  background: url('../../assets/indexImage/首页-未登录-image63.jpg') no-repeat center center;
  background-size: cover;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.partners {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.partners img {
  margin: 0 10px;
  height: 40px;
}

.login-code-img{
  position: absolute;
  height: 38px;
  margin-left: 4%;
}

.footer {
  text-align: center;
  padding: 10px 0;
  background-color: #ffffff;
}

::v-deep .el-dialog{
  background: linear-gradient(to right, #dde0e3, #8dd92c);
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
  padding: 20px;
}

#qr-code-img {
  width: 200px;
  height: 200px;
  display: flex;
}

.login-left-text p {
  font-size: 20px;
  margin-top: 10px;
}

.login-right {
  width: 50%;
  padding: 20px;
  /*  */ display: flex;
  flex-direction: column;
  align-items: center;
}

.login-tabs {
  /* margin-bottom: 20px; */
  width: 100%;
}

.input-field {
  margin-bottom: 20px;
  /*  */width: 100%;
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


::v-deep .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: none; /* 去掉面板的边框 */
  box-shadow: none; /* 去掉可能的阴影效果 */
  background-color: transparent; /* 确保背景透明 */
  padding: 0; /* 去掉内边距，如有需要可调整 */
}

/* 去掉 el-tabs 卡片类型中选项卡面板的外边框 */
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
  border: none; /* 去掉内容区的边框 */
}
</style>
