<template>
  <div class="expansionMenu">
    <div class="menuContainer">
      <div class="container">
        <!-- 添加 -->
        <div v-for="(menu, index) in childMenu.children" :key="index" class="menu-item">
          <div class="menu-title">{{ menu.meta.title }}</div>
          <div class="sub-menu-container">
            <div v-for="(subMenu, subIndex) in menu.children" :key="subIndex" class="sub-menu">
              <router-link :to="subMenu.path" class="sub-menu-title">{{ subMenu.meta.title }}</router-link>
              <div v-if="subMenu.children" class="sub-sub-menu">
                <div v-for="(subSubMenu, subSubIndex) in subMenu.children" :key="subSubIndex" class="sub-sub-menu-item">
                  {{ subSubMenu.meta.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "expansionMenu",
  props:{
    childMenu:Object
  },
};
</script>

<style scoped>
.expansionMenu {
  height: 300px;
  width: 100%;
  transform: translateY(0);
  background-color: #fff;
  transition: height 0.2s ease;
  position: absolute;
  z-index: 998;
}

.menuContainer {
  display: flex;
  padding: 40px 0 40px 180px;
  height: 300px;
  font-size: 14px;
  line-height: 20px;
  font-weight: var(--WeightT);
}

.container {
  display: flex;
  height: 100%;
  width: 100%;
  max-width: 1120px;
  justify-content: space-between;
}

.menu-item {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}

.menu-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.sub-menu-container {
  display: flex;
  flex-direction: column;
}

.sub-menu {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.sub-menu-title {
  font-weight: normal;
  margin-bottom: 5px;
}

.sub-sub-menu {
  margin-left: 20px;
}

.sub-sub-menu-item {
  margin-bottom: 5px;
}
</style>
