<template>
  <div>
    <div class="ai-computing-power">
      <div class="spacer">
        <span class="title">我的算力</span>
        <img
          :src="require('@/assets/icons/算力券着色版.png')"
          width="44"
          height="44"
        />
        <span style="color: #2117ff; margin-right: 8px; font-size: 45px">{{
          compPower
        }}</span>
      </div>
      <div class="content">
        <p>
          "AI算力"(AI computingpower)通用于进行人工智能(AI)任务和应用的计算能力.
          AI算力点赋予用户在智启工具中进行生图、渲染、下载以及参与社区等操作的能力.
        </p>
      </div>
      <div class="power-point-info">
        <div class="power-point-details">
          <!-- <img
            :src="require('@/assets/icons/算力券着色版.png')"
            width="20"
            height="20"
          /> -->
          <span><strong>算力点 ≈ 高速生成1张图</strong></span>
        </div>
      </div>
      <div style="width: 60%; margin-top: 2%">
        <el-button round type="primary" @click="findGreater">未过期</el-button>
        <el-button
          round
          type="primary"
          @click="findExpired"
          style="background: #333333"
          >已过期</el-button
        >
        <!-- <el-button round type="primary" @click="findZero"
          >未过期已使用完的</el-button
        > -->
        <el-table
          :data="tableData"
          height="300"
          style="
            width: 100%;
            margin-top: 1%;
            border-radius: 10px;
            border: 1px solid #e3e3e3;
          "
        >
          <el-table-column prop="packageName" label="算力包名" align="center">
          </el-table-column>
          <el-table-column prop="purchaseDate" label="购买时间" align="center">
          </el-table-column>
          <el-table-column prop="expiryDate" label="过期时间" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="支付时间" align="center">
          </el-table-column>
          <el-table-column
            prop="remainingComputePower"
            label="剩余算力点"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="plans-container" id="plan">
      <h1 class="plans-title">
        <span class="plans-title-text"
          >感谢您的支持,请选择适合您的专业版计划</span
        >
      </h1>
      <p class="plans-notice">以下专属权益供专业版用户使用</p>
      <!-- <div class="plans-policy">
        <div>
          <span>️️⚡️高速GPU算力池</span>
        </div>
        <div class="policy-divider"></div>
      </div> -->
      <div class="plans-list">
        <div class="plans-nav">
          <!-- <div
            v-for="(item, index) in navItems"
            :key="index"
            :class="['nav-item', { 'nav-item-active': item.active }]"
          >
            {{ item.label }}
          </div> -->
        </div>
        <div class="monthly-plan">
          <div class="plan-header">
            <img
              alt="monthly"
              loading="lazy"
              width="18"
              height="18"
              decoding="async"
              :src="require('@/assets/icons/日历白.png')"
              style="color: transparent"
            />
            <p class="plan-title">算力加油包</p>
          </div>
          <div class="plan-content">
            <div class="plan-details" style="border: none">
              <div class="plan-price">
                <p class="price-amount">{{ monthPackage[0].price }}</p>
                <span> /</span><span>月</span>
              </div>
              <p class="plan-description">购买后，您将获得</p>
              <div
                class="plan-rights"
                v-html="monthPackage[0].description"
              ></div>
              <div
                class="plan-purchase"
                @click="openDialog(monthPackage[0].id)"
              >
                购买（立即生效）
              </div>
            </div>
          </div>
        </div>
        <div class="yearly-plan">
          <div class="plan-header">
            <img
              alt="yearly"
              loading="lazy"
              width="18"
              height="18"
              decoding="async"
              :src="require('@/assets/icons/图层白.png')"
              style="color: transparent"
            />
            <div class="plan-title">旗舰版算力包</div>
          </div>
          <div class="plan-content">
            <div
              class="plan-details plan-mobile"
              v-for="item in yearPackage"
              :key="item.id"
            >
              <div class="plan-price">
                <p class="price-amount">¥{{ item.price }}</p>
              </div>
              <p class="plan-description">购买后，您将获得</p>
              <div class="plan-rights" v-html="item.description"></div>
              <div class="plan-purchase" @click="openDialog(item.id)">
                <span>购买（立即生效）</span>
                <!-- <div v-if="plan.popular" class="plan-popular">热门</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="auto"
      :before-close="closeDialog"
      center
    >
      <div class="power-package">
        <div class="power-package-title">算力包</div>
        <div class="payment-section">
          <div class="payment-details">
            <div class="payment-amount">
              扫码支付：
              <p class="amount">¥{{ selectPackage.price }}</p>
            </div>
            <div class="payment-methods">
              <div
                class="payment-method"
                @click="selectPay('zfb')"
                :class="{ selected: selectedPayment === 'zfb' }"
              >
                <img
                  :src="require('@/assets/icons/alipay.png')"
                  alt="Alipay"
                  class="payment-icon"
                  width="22"
                  height="22"
                />
                支付宝
              </div>
              <div
                class="payment-method"
                @click="selectPay('wx')"
                :class="{ selected: selectedPayment === 'wx' }"
              >
                <img
                  :src="require('@/assets/icons/wechat.png')"
                  alt="WeChat Pay"
                  class="payment-icon"
                  width="22"
                  height="22"
                />
                微信支付
              </div>
            </div>
            <div class="payment-separator">
              <div
                v-if="qrExpired"
                class="expired-qr-code"
                @click="regenerateQRCode"
              >
                <i class="el-icon-refresh"></i>
                <!-- 显示循环箭头 -->
              </div>
              <img :src="wxImage" width="240" height="240" />
            </div>
            <div class="payment-terms">
              <div class="terms-info">
                支付完成后默认您同意
                <router-link to="/userAgrrement" target="_blank">
                  <p class="terms-text">相关协议条例</p>
                </router-link>
              </div>
              <div class="refund-policy">虚拟商品, 不支持退款</div>
            </div>
          </div>
          <!-- <div class="package-info" v-if="showFlag">
            <div class="package-details">
              <div class="pricing-info">
                <p class="price-amount">¥298</p>
                <p class="points-amount">20000算力点</p>
              </div>
              <div class="pricing-info">
                <p class="validity-period">有效期1年</p>
                <p class="validity-period">约可高速生成2000张图</p>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </el-dialog>
    <div>
      <div
        class="wrapper"
        style="
          --arrow-x: 5px;
          --arrow-y: -2px;
          inset: 117px auto auto 442px;
          box-sizing: border-box;
          z-index: 2050;
          pointer-events: none;
        "
      >
        <div class="box">
          <div class="content-wrapper">
            <div class="pricing-container">
              <div class="pricing-option">连续包月</div>
              <div class="pricing-option">单月购买</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { pay, polling } from "@/api/zhiqi/orders";
import { queryYearPackages, queryPackageById } from "@/api/zhiqi/package";
import { getuserup } from "@/api/zhiqi/userPurchases";
import store from "@/store";
export default {
  data() {
    return {
      dialogVisible: false,
      wxImage: "",
      uuid: "",
      selectedPayment: "wx",
      yearPackage: [],
      monthPackage: [],
      selectPackage: {},
      tableData: [],
      purchases: [],
      intervalId: null,
      qrExpired: false,
      timerId: null,
    };
  },
  computed: {
    ...mapGetters(["compPower"]),
  },
  async mounted() {
    this.init();
  },
  methods: {
    async init() {
      const res = await queryYearPackages("年包");
      this.yearPackage = res.rows;
      const res1 = await queryYearPackages("月包");
      this.monthPackage = res1.rows;
      const res2 = await getuserup();
      this.purchases = res2.data;
      this.tableData = this.purchases.ValidPurchases;
    },
    async openDialog(packageId) {
      const resq = await queryPackageById(packageId);
      this.selectPackage = resq.data;
      await this.generateQRCode(packageId);
      this.dialogVisible = true;
      this.setQRCodeTimer();
      this.intervalId = setInterval(async () => {
        const res = await polling(this.uuid);
        if (res.data.status === "paid") {
          this.$message({
            message: "🎉 支付成功！感谢您的支持！",
            type: "success",
          });
          this.dialogVisible = false;
          this.init();
          store.dispatch("getComputingPower");
          clearInterval(this.intervalId);
        }
      }, 2000);
    },
    async generateQRCode(packageId) {
      const res = await pay({ packagesId: packageId });
      this.wxImage = res.data.base64;
      this.uuid = res.data.uuid;
      this.qrExpired = false; // 重置二维码状态
    },
    setQRCodeTimer() {
      if (this.timerId) {
        clearTimeout(this.timerId);
      }
      this.timerId = setTimeout(() => {
        this.qrExpired = true;
      }, 300000); // 5分钟 = 300000 毫秒
    },
    // 重新生成二维码
    regenerateQRCode() {
      this.generateQRCode(this.selectPackage.id);
      this.setQRCodeTimer(); // 重新设置定时器
    },
    closeDialog() {
      this.dialogVisible = false;
      clearInterval(this.intervalId);
      if (this.timerId) {
        clearTimeout(this.timerId); // 清除定时器
      }
    },
    selectPay(method) {
      if (method) {
        this.$message({
          message: "❌ 暂不支持支付宝！待开发中 ❗",
          type: "",
        });
        return;
      }
      this.selectedPayment = method;
    },
    findGreater() {
      this.tableData = this.purchases.ValidPurchases;
    },
    findZero() {
      this.tableData = this.purchases.UsedUpPurchases;
    },
    findExpired() {
      this.tableData = this.purchases.ExpiredPurchases;
    },
  },
};
</script>

<style>
.plan-details .plan-rights .plan-right {
  display: flex;
  gap: 8px;
}
</style>
<style scoped>
.el-button--primary {
  background-color: rgb(33, 23, 255);
  border-color: transparent;
}
.ai-computing-power {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 200px 20px 110px;
  color: #333;
  background: linear-gradient(180deg, #fff, #f5f7fd);
}
.title {
  font-size: 40px;
  font-weight: 500;
  margin: 0;
}
.spacer {
  font-size: 30px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-weight: 400;
  line-height: 48px;
}
.content {
  margin-top: 30px;
  max-width: 920px;
  width: 100%;
  text-align: center;
  color: #97a0b4;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  margin: 11px;
}
.content p {
  margin: 0;
  font-size: 11px;
}
.power-point-info {
  display: flex;
  align-items: center;
  justify-content: center;
}
.power-point-details {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  color: #333333;
  font-size: 13px;
  line-height: 20px;
}
.plans-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 110px 20px;
}
.plans-title {
  font-size: 40px;
  font-weight: 500;
  text-align: center;
  margin: 0;
}
.plans-title-text {
  font-size: 40px;
  font-weight: 500;
  color: #333333;
}
.plans-title-icon {
  object-fit: cover;
  margin-left: 4px;
  vertical-align: text-top;
}
.plans-notice {
  margin-top: 10px;
  font-weight: 400;
  font-size: 21px;
  line-height: 30px;
  color: #999999;
}
.plans-policy {
  margin-top: 25px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 1280px;
  color: #333;
}
.policy-divider {
  height: 17px;
  border-right: 1px solid #97a0b4;
  opacity: 0.3;
}
.plans-list {
  width: 100%;
  margin-top: 50px;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  gap: 40px;
  min-height: 433px;
}
.monthly-plan {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: #f5f7fd;
  box-shadow: 0 0 20px 0 rgba(219, 214, 250, 0.26);
}
.plan-header {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 24px;
  border-radius: 20px 20px 0 0;
  background: linear-gradient(70deg, #333333, #0a22ed);
  color: #fff;
  font-size: 14px;
  line-height: 20px;
}
.plan-title {
  margin: 0;
  padding: 0;
  margin-left: 8px;
}
.plan-content {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  color: #403d3c;
}
.plan-details {
  width: 292px;
  display: flex;
  flex-direction: column;
  padding: 26px 30px;
  border-right: 1px solid #edeaea;
  position: relative;
}
.plan-price {
  display: flex;
  align-items: baseline;
  color: #403d3c;
  font-weight: 400;
  font-size: 18px;
  line-height: 25px;
}
.price-amount {
  margin: 0;
  margin-right: 8px;
  font-weight: 600;
  font-size: 40px;
  line-height: 48px;
}
.plan-description {
  font-weight: 400;
  font-size: 12px;
  line-height: 17px;
  margin: 0;
  padding: 0;
}
.plan-rights {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
  margin-bottom: 100px;
  color: #333;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}
.plan-right {
  display: flex;
  gap: 8px;
}

.plan-purchase {
  height: 50px;
  position: absolute;
  bottom: 26px;
  left: 26px;
  right: 26px;
  border-radius: 30px;
  color: #fff;
  background-color: rgb(33, 23, 255);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.yearly-plan {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: #f5f7fd;
  box-shadow: 0 0 20px 0 rgba(219, 214, 250, 0.26);
}

.el-dialog__wrapper {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .el-dialog__wrapper .el-dialog {
  border-radius: 20px;
}
::v-deep .el-dialog__header {
  padding: 0;
}
::v-deep .el-dialog__headerbtn {
  z-index: 10;
}
::v-deep .el-dialog__body {
  padding: 0;
  display: inline-flex;
}
.power-package {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  color: #333;
  background-color: #fff;
  border-radius: 20px;
}
.power-package-title {
  font-size: 24px;
  line-height: 28px;
}
.payment-section {
  display: flex;
  margin-top: 30px;
}
.payment-details {
  width: 360px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #f5f7fd;
  padding: 24px 0;
  border-radius: 10px;
}
.payment-amount {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 14px;
  line-height: 20px;
  justify-content: center;
}
.amount {
  font-size: 32px;
  line-height: 40px;
  margin: 0;
  margin-top: 12px;
}
.payment-methods {
  display: flex;
}
.payment-method {
  display: flex;
  margin-top: 24px;
  margin-bottom: 12px;
  width: 116px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e3e3e3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 8px;
}
.payment-method.selected {
  border-color: #2117ff;
}
.payment-icon {
  margin-right: 12px;
}
.payment-separator {
  width: 240px;
  height: 240px;
  margin-top: 12px;
}

.expired-qr-code {
  width: 240px;
  height: 240px;
  position: absolute;
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer; /* 鼠标悬停显示为可点击 */
}

.expired-qr-code .el-icon-loading {
  font-size: 48px;
  color: white;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.payment-terms {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
.terms-info {
  margin-top: 12px;
  color: #97a0b4;
  display: flex;
  font-size: 12px;
  line-height: 17px;
}
.terms-text {
  text-decoration: underline;
  color: #97a0b4;
  margin: 0;
}
.refund-policy {
  color: #97a0b4;
  margin-top: 24px;
  font-size: 12px;
  line-height: 17px;
}
.package-info {
  margin-left: 24px;
  width: 358px;
}
.package-details {
  padding: 20px;
  border-radius: 10px;
  background-color: #f5f7fd;
  margin-bottom: 16px;
  cursor: pointer;
  border: 1px solid #f5f7fd;
}
.pricing-info {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.price-amount {
  font-size: 32px;
  line-height: 40px;
  margin: 0;
}
.points-amount {
  font-size: 26px;
  line-height: 36px;
  margin: 0;
}
.validity-period {
  font-size: 12px;
  line-height: 17px;
  margin: 0;
}
.wrapper {
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  position: absolute;
  top: 0;
  left: 0;
  display: none;
}
.box {
  position: relative;
}
.content-wrapper {
  background-color: #ffffff;
  background-clip: padding-box;
  border-radius: 8px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  padding: 12px;
}
.pricing-container {
  color: rgba(0, 0, 0, 0.88);
  padding: 0;
}
</style>
