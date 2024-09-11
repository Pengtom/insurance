<template>
  <div>
    <div class="order-record">
      <h1 class="order-title">订单记录</h1>
      <div class="support-online-invoice">支持在线开票</div>
      <div>
        <el-table
          :data="tableData"
          style="
            width: 100%;
            margin: 50px 0 80px;
            border: 1px solid #e3e3e3;
            border-radius: 10px;
          "
        >
          <el-table-column
            prop="orderNo"
            label="订单号"
            align="center"
            width="160"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="订单创建时间"
            align="center"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="packageName"
            label="算力套餐"
            align="center"
            width="120"
          >
          </el-table-column>
          <!-- <el-table-column
            prop="expiryDate"
            label="到期时间"
            align="center"
            width="150"
          >
          </el-table-column> -->
          <el-table-column
            prop="amount"
            label="订单金额"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="订单状态"
            align="center"
            width="120"
            :formatter="statusFormatter"
          >
          </el-table-column>
          <el-table-column label="是否自动续订" align="center" width="160">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.autoRenew"
                active-text="续订"
                inactive-text="取消"
              >
              </el-switch>
            </template>
          </el-table-column>
          <!-- <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column> -->
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserOrder } from "@/api/zhiqi/orders";
export default {
  data() {
    return {
      tableData: [],
      statusMap: {
        pending: "等待",
        paid: "支付成功",
        failed: "失败",
        cancel: "取消",
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    async init() {
      const res = await getUserOrder();
      console.log(res);

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