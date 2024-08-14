<template>
  <div>
    <el-menu-item @click="test(index)" v-if="item.children && item.children.length" :index="index">
      <template #title>
        <span>{{ item.meta && item.meta.title ? item.meta.title : "" }}</span>
      </template>
    </el-menu-item>
    <router-link  v-else :to="item.path">
      <el-menu-item :index="index" @click="test(index)">
          <span>{{ item.meta && item.meta.title ? item.meta.title : "" }}</span>
      </el-menu-item>
    </router-link>
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
  methods:{
    test(index){
      this.$emit('menuChild',this.item,index)
    }
  }
};
</script>
