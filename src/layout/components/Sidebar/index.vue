<template>
    <div style="100px" :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
                :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
                :unique-opened="true"
                :active-text-color="settings.theme"
                :collapse-transition="false"
                mode="vertical"
            >
                <sidebar-item
                    v-for="(route, index) in routers"
                    :key="route.path  + index"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
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
        ...mapGetters(["sidebarRouters", "sidebar"]),
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
        routers:{
            get() {
                // 计算并返回值
                return this.filterAndAdjustPaths(this.sidebarRouters,'',this.getNodesToFilter());
            },
            set(newValue) {
                // 修改计算属性的值
                // 这里的 newValue 是你设置的新值
                this.filterAndAdjustPaths(this.sidebarRouters,'',this.getNodesToFilter())
            }
        }
    },
    methods:{
        getNodesToFilter() {
        return ['Work', 'Imgtoimg'];
        },
        filterAndAdjustPaths(data, parentPath = '',nodesToFilter = []) {
            return data.reduce((result, node) => {
                const currentPath = parentPath
                ? `${parentPath.replace(/\/+$/, '')}/${node.path.replace(/^\/+/, '')}`
                : node.path;

                if (nodesToFilter.includes(node.name)) {
                if (node.children && node.children.length > 0) {
                    const filteredChildren = this.filterAndAdjustPaths(node.children, currentPath,nodesToFilter);
                    result.push(...filteredChildren);
                }
                } else {
                const newNode = { ...node, path: currentPath };
                if (node.children && node.children.length > 0) {
                    newNode.children = this.filterAndAdjustPaths(node.children, currentPath,nodesToFilter);
                }
                result.push(newNode);
                }
                return result;
            }, []);
        },
        test2(){
            const filteredData = this.filterAndAdjustPaths(this.sidebarRouters,'',this.getNodesToFilter());
            console.log(filteredData);
        }
    },
};
</script>

