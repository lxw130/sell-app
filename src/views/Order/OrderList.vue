<template>
  <div class="order-list">
    <Card>
      <span slot="title">订单列表</span>
      <div slot="content">
        <!-- 搜索表单 -->
        <el-form
          ref="searchForm"
          :inline="true"
          :model="searchForm"
          size="small"
        >
          <!-- 订单号 -->
          <el-form-item label="订单号">
            <el-input
              v-model="searchForm.orderNo"
              placeholder="订单号"
            ></el-input>
          </el-form-item>

          <!-- 收货人 -->
          <el-form-item label="收货人">
            <el-input
              v-model="searchForm.consignee"
              placeholder="收货人"
            ></el-input>
          </el-form-item>

          <!-- 手机号 -->
          <el-form-item label="手机号">
            <el-input
              v-model="searchForm.phone"
              placeholder="手机号"
            ></el-input>
          </el-form-item>

          <!-- 订单状态 -->
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.orderState" placeholder="订单状态">
              <el-option label="未受理" value="未受理"></el-option>
              <el-option label="已受理" value="已受理"></el-option>
              <el-option label="派送中" value="派送中"></el-option>
              <el-option label="已完成" value="已完成"></el-option>
            </el-select>
          </el-form-item>

          <!-- 下单时间 -->
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="searchForm.date"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>

          <!-- 查询按钮 -->
          <el-form-item>
            <el-button @click="search" type="primary">查询</el-button>
            <el-button @click="reset" type="primary">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 订单表格 -->
        <el-table :data="tableData" border size="mini">
          <!-- 订单号 -->
          <el-table-column fixed prop="orderNo" label="订单号" width="150">
          </el-table-column>

          <!-- 下单时间 -->
          <el-table-column prop="orderTime" label="下单时间" width="150">
          </el-table-column>

          <!-- 手机号 -->
          <el-table-column prop="phone" label="手机号" width="120">
          </el-table-column>

          <!-- 收货人 -->
          <el-table-column prop="consignee" label="收货人" width="120">
          </el-table-column>

          <!-- 配送地址 -->
          <el-table-column prop="deliverAddress" label="配送地址" width="120">
          </el-table-column>

          <!-- 送达时间 -->
          <el-table-column prop="deliveryTime" label="送达时间" width="120">
          </el-table-column>

          <!-- 用户备注 -->
          <el-table-column prop="remarks" label="用户备注" width="120">
          </el-table-column>

          <!-- 订单金额 -->
          <el-table-column prop="orderAmount" label="订单金额" width="120">
          </el-table-column>

          <!-- 订单状态 -->
          <el-table-column prop="orderState" label="订单状态" width="120">
          </el-table-column>

          <!-- 操作 -->
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="showDetail(scope.row)" type="text" size="small"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card/Card.vue";
import { getOrderList } from "@/api/order";
import moment from "moment";

export default {
  components: {
    Card,
  },
  data() {
    return {
      searchForm: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: [],
      },
      tableData: [],
      pageSize: 5,
      currentPage: 1,
      total: 28,
    };
  },
  methods: {
    // 当前页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderData();
    },

    // 获取数据的函数
    async getOrderData() {
      let { data, total } = await getOrderList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,

        // 查询的条件 默认没有条件
        orderNo: this.searchForm.orderNo,
        consignee: this.searchForm.consignee,
        phone: this.searchForm.phone,
        orderState: this.searchForm.orderState,
        date: JSON.stringify(this.searchForm.date),
      });

      // 处理时间格式
      data.forEach((v) => {
        v.orderTime = moment(v.orderTime).format("YYYY-MM-DD HH:mm:ss");
      });

      // 赋值渲染
      this.tableData = data;
      this.total = total;
    },

    // 查询
    search() {
      this.currentPage = 1;
      this.getOrderData();
    },
    // 重置
    reset() {
      // 清空
      this.searchForm = {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: [],
      };

      this.getOrderData(); // 重新获获取数据
    },

    // 查看订单详情
    showDetail(row) {
      console.log(row);
      /**
       * 1. 方案1： 把row数据 存入本地  详情页面 从本地取出来
       *
       * 2. 方案2： 路由传参
       *     query方式
       *     params方式
       */

      this.$router.push("/order/order-detail"); // 跳转到订单详情页面

      // 1. query传递参数  （ 通过浏览器的地址栏传递参数 适用于少量参数 ）
      // this.$router.push({
      //   path: "/order/order-detail",
      //   query: {
      //     // id: row.id,
      //     // orderNo: row.orderNo,
      //     // phone: row.phone,
      //     // row: JSON.stringify(row),
      //   },
      // });

      // 2. params方式传递参数
      // this.$router.push({
      //   name: "order-detail",
      //   params: {
      //     row,
      //   },
      // });
    },
  },
  created() {
    this.getOrderData();
  },
};
</script>

<style lang="less" scoped>
.order-list {
  .content {
    .el-form {
      max-width: 1100px;
    }
    .el-table {
      max-width: 1100px;
      margin-top: 30px;
    }
    .el-pagination {
      margin-top: 30px;
    }
  }
}
</style>
