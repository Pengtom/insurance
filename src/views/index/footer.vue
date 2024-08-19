<template>
  <footer class="site-footer">
    <div class="footer-top">
      <div v-for="(menu, index) in items.children" :key="index">
        <div class="menu-title">{{ menu.meta.title }}</div>
        <div class="sub-menu-container">
          <router-link
            :to="subMenu.path"
            v-for="(subMenu, subIndex) in menu.children"
            :key="subIndex"
          >
            <div class="sub-menu-item">
              <div>
                <span>{{ subMenu.meta.title }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="extra-content">
        <div>
          <div class="extra-item">联系我们</div>
          <div class="extra-item-inner">
            <div class="extra-item-content">
                <span>企业微信</span>
            </div>
          </div>
        </div>
        <div>
          <div class="extra-item-group-one">关注我们</div>
          <div class="extra-item-group-two">
            <img
              src="../../assets/indexImage/首页-未登录-image74.png"
              width="24"
              height="24"
            />
            <img
              src="../../assets/indexImage/首页-未登录-image75.png"
              width="24"
              height="24"
            />
            <img
              src="../../assets/indexImage/首页-未登录-image76.png"
              width="24"
              height="24"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="footer-content">
      <div class="footer-info">
        <div class="footer-copy">
          <div>© 2024 艾铂特（珠海）人工智能科技有限公司</div>
        </div>
        <a class="footer-link" href="#">
          <div class="footer-info">
            <p>粤ICP备xxxxxxxx号-x</p>
          </div>
        </a>
        <a class="footer-link" href="#">
          <div class="footer-info">
            <img
              width="16"
              height="16"
              loading="lazy"
              src="../../assets/indexImage/首页-未登录-image77.png"
              style="margin-left: 4px"
            />
            <p>粤公网安备 xxxxxxxxxxxxxxxx号</p>
          </div>
        </a>
        <a class="footer-link" href="#">
          <div class="footer-info">
            <p>网信算备 xxxxxxxxxxxxx号</p>
          </div>
        </a>
        <a href="#">
          <div class="footer-info">
            <p>举报投诉</p>
          </div>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    menuItems: Array,
  },
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.fetchMenuItems().then((data) => {
      this.items = this.findStartData(this.menuItems);
      console.log("Found Items:", this.items);
    });
  },
  methods: {
    fetchMenuItems() {
      // 示例异步请求
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.menuItems);
        }, 1000);
      });
    },
    findStartData(data) {
      for (const item of data) {
        if (item.name === "Start") {
          return item;
        }
        if (item.children) {
          const result = this.findStartData(item.children);
          if (result) {
            return result;
          }
        }
      }
      return null;
    },
  },
};
</script>

<style scoped>
.site-footer {
  background-color: #fafafa;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 40px 20px 20px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}
.footer-top {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  flex-wrap: wrap;
  gap: 30px;
}
.footer-content {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 100px;
  max-width: 1200px;
}
.footer-info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}
.footer-copy {
  color: #97a0b4;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 17px;
  font-weight: 400;
}
.footer-link {
  margin-right: 12px;
}
.footer-info {
  color: #97a0b4;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 17px;
  font-weight: 400;
}

.menu-title {
  color: #97a0b4;
  font-weight: 500;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 20px;
}
.sub-menu-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #333;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}
.sub-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #333;
}
.extra-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.extra-item {
  margin-bottom: 10px;
  color: #97a0b4;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}
.extra-item-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #333;
}
.extra-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.extra-item-group-one{
  color:#97a0b4;
  margin-bottom: 10px;
}
.extra-item-group-two{
  display: flex;
    gap: 14px;
    flex-wrap: wrap;
    width: 100px;
}
</style>