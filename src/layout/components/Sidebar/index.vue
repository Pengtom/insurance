<template>
  <div
    style="100px"
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor:
        settings.sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground,
    }"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuBackground
            : variables.menuLightBackground
        "
        :text-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor
        "
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in routers"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
      <div
        style="
          position: absolute;
          bottom: 0;
          width: 100%;
          padding-bottom: 16px;
          pointer-events: none;
        "
      >
        <div class="text">
          <div class="text-info">
            <img
              width="24"
              height="16"
              :src="require('@/assets/icons/pro_points.webp')"
              loading="lazy"
            />
            <span
              style="
                font-weight: 500;
                margin-left: 4px;
                font-size: 14px;
                line-height: 20px;
                color: #7530fe;
              "
              >{{compPower}}</span
            >
            <span
              style="
                margin-left: 4px;
                font-size: 14px;
                line-height: 20px;
                color: #333;
              "
              >算力点</span
            >
          </div>
          <router-link to="/order">
            <div class="button">去购买</div>
          </router-link>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["sidebarRouters", "sidebar","compPower"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    routers: {
      get() {
        // 计算并返回值
        return this.filterAndAdjustPaths(
          this.sidebarRouters,
          "",
          this.getNodesToFilter()
        );
      },
      set(newValue) {
        // 修改计算属性的值
        // 这里的 newValue 是你设置的新值
        this.filterAndAdjustPaths(
          this.sidebarRouters,
          "",
          this.getNodesToFilter()
        );
      },
    },
  },
  methods: {
    getNodesToFilter() {
      return ["Work", "Imgtoimg"];
    },
    filterAndAdjustPaths(data, parentPath = "", nodesToFilter = []) {
      return data.reduce((result, node) => {
        const currentPath = parentPath
          ? `${parentPath.replace(/\/+$/, "")}/${node.path.replace(/^\/+/, "")}`
          : node.path;

        if (nodesToFilter.includes(node.name)) {
          if (node.children && node.children.length > 0) {
            const filteredChildren = this.filterAndAdjustPaths(
              node.children,
              currentPath,
              nodesToFilter
            );
            result.push(...filteredChildren);
          }
        } else {
          const newNode = { ...node, path: currentPath };
          if (node.children && node.children.length > 0) {
            newNode.children = this.filterAndAdjustPaths(
              node.children,
              currentPath,
              nodesToFilter
            );
          }
          result.push(newNode);
        }
        return result;
      }, []);
    },
    test2() {
      const filteredData = this.filterAndAdjustPaths(
        this.sidebarRouters,
        "",
        this.getNodesToFilter()
      );
      console.log(filteredData);
    },
  },
};
</script>

<style scoped>
.text {
  display: flex;
  align-items: center;
  border-radius: 10px;
  background-color: hsla(0, 0%, 100%, 0.6);
  z-index: 2;
  pointer-events: visible;
  flex-direction: column;
  padding: 8px 0 12px;
  margin-left: 10px;
  margin-right: 10px;
}
.text-info {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: left;
  cursor: pointer;
  margin-top: 8px;
  margin-bottom: 6px;
}
.button {
  width: 138px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #7530fe;
  color: #7530fe;
  margin-top: 4px;
  border-radius: 6px;
  font-weight: 500;
  margin-right: 12px;
  margin-left: 12px;
  font-size: 14px;
  line-height: 20px;
}
::v-deep .scrollbar-wrapper .el-scrollbar__view {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
</style>
