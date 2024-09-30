<template>
  <div>
    <div class="order-record">
      <h1 class="order-title">算力使用记录</h1>
      <div>
        <el-table
          :data="tableData"
          height="400"
          style="
            width: 100%;
            margin: 50px 0 80px;
            border: 1px solid #e3e3e3;
            border-radius: 10px;
          "
        >
          <el-table-column
            prop="packageName"
            label="价格包名称"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="computeType"
            label="使用类型"
            align="center"
            width="200"
            :formatter="statusFormatter"
          >
          </el-table-column>
          <el-table-column
            prop="computePowerUsed"
            label="使用的算力点数"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="usageDate"
            label="使用日期"
            align="center"
            width="220"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { queryUsage } from "@/api/zhiqi/computeUsage";
export default {
  data() {
    return {
      tableData: [],
      statusMap: {
        1: "抠图",
        2: "图生图",
        3: "gpt",
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const res = await queryUsage();
      this.tableData = res.data;
    },
    statusFormatter(row, column, cellValue, index) {
      return this.statusMap[cellValue] || cellValue;
    },
  },
};
</script>

<style scoped>
.order-record {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #333;
}
.order-title {
  font-weight: 600;
  font-size: 50px;
  margin-top: 80px;
}
.support-online-invoice {
  padding-top: 10px;
  color: #97a0b4;
  font-weight: 400;
  font-size: 24px;
  line-height: 28px;
}
::v-deep .el-table thead {
  height: 80px;
}
</style>