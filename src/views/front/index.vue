<template>
  <div>
    <headerVue :menuItems="menuItems" :flag="flag" />
    <!-- <contentVue/> -->
    <app-main/>
    <footerVue :menuItems="menuItems" />
  </div>
</template>

<script>
import headerVue from "./navbar/header.vue";
import { getDefaultRouters } from "@/api/menu";
import footerVue from "./footer/footer.vue";
import { AppMain } from "@/layout/components";


export default {
  components: {
    headerVue,
    AppMain,
    footerVue,
  },
  data() {
    return {
      menuItems: [],
      flag: false, //窗口显示头部字体颜色
    };
  },
  computed: {
    scrollThreshold() {
      return window.innerHeight * 0.3;
    },
  },
  mounted() {
    getDefaultRouters().then((res) => {
      this.menuItems = res.data;
    });
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (window.scrollY > this.scrollThreshold) {
        this.flag = true;
      } else {
        this.flag = false;
      }
    },
  },
};
</script>
