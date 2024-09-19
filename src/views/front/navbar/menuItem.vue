<template>
  <div>
    <el-menu-item
      @click="test(index)"
      v-if="item.children && item.children.length"
      :index="index"
    >
      <template #title>
        <span>{{ item.meta && item.meta.title ? item.meta.title : "" }}</span>
      </template>
    </el-menu-item>
    <el-menu-item v-else :index="index" @click="test(index)">
      <span>{{ item.meta && item.meta.title ? item.meta.title : "" }}</span>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    index: {
      type: String,
      default: "",
    },
  },
  // components: {
  //   MenuItem: () => import("./menuItem1.vue"), // 确保递归引入自身
  // },
  methods: {
    test(index) {
      console.log(index);
      this.$message({
        message: "❌ 待开发中，敬请期待 ❗",
        type: "",
      });
      return;
      this.$emit("menuChild", this.item, index);
    },
  },
};
</script>
