<template>
  <div>
    <div class="order-record">
      <h1 class="order-title">订单记录</h1>
      <div class="support-online-invoice">支持在线开票</div>
      <el-table
        :data="tableData"
        style="
          width: 100%;
          max-width: 1200px;
          margin: 50px 0 80px;
          border: 1px solid #e3e3e3;
          border-radius: 10px;
        "
      >
        <el-table-column prop="date" label="订单号" align="center" width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="订单创建时间"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="province"
          label="算力套餐"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="city"
          label="到期时间"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="订单金额"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column prop="zip" label="订单状态" align="center" width="120">
        </el-table-column>
        <el-table-column label="是否自动续订" align="center" width="160">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.autoRenew"
              active-text="续订"
              inactive-text="不续订"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick(row) {
      console.log(row);
    },
  },

  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1517 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1519 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333,
        },
      ],
    };
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