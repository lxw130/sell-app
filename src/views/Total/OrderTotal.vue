<template>
  <div class="order-total">
    <Card>
      <span slot="title">订单统计</span>
      <div slot="content" class="content">
        <!-- 时间查询框 -->
        <el-form :inline="true" :model="searchForm" size="small">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="searchForm.date"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button @click="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>

        <!-- 报表容器 -->
        <Chart :options="options" />
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card/Card.vue";
import { getOrder } from "@/api/order";
import Chart from "@/components/Chart/Chart.vue";
import moment from "moment";

export default {
  components: {
    Card,
    Chart,
  },
  data() {
    return {
      // 查询表单
      searchForm: {
        date: [],
      },
      // 报表数据
      options: {
        title: "订单统计",
        lengend: "订单金额",
        xData: [],
        series: [],
      },
    };
  },
  methods: {
    // 获取后端数据
    async getOrderData() {
      let { data } = await getOrder({
        date: this.searchForm.date
          ? JSON.stringify(this.searchForm.date)
          : JSON.stringify([]),
      });

      // x轴的数据
      this.options.xData = data.map((item) => {
        return moment(item.orderTime).format("YYYY-MM-DD HH:mm:ss");
      });

      // y轴数据
      let yData = data.map((item) => {
        return item.orderAmount;
      });
      // 核心数据
      this.options.series = [
        {
          name: "订单金额",
          type: "line",
          data: yData, // 动态数据
        },
      ];
    },

    // 查询
    search() {
      this.getOrderData(); // 重新获数据
    },
  },
  created() {
    this.getOrderData(); // 获取订单接口数据
  },
};
</script>

<style lang="less" scoped>
.el-form {
  margin-bottom: 30px;
}
</style>
