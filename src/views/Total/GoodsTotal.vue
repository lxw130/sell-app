<template>
  <div class="goods-total">
    <Card>
      <span slot="title">商品统计</span>
      <div slot="content" class="content">
        <!-- 时间查询框 -->
        <el-form :inline="true" :model="searchForm" size="small">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="searchForm.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>

        <!-- 报表容器 -->
        <div ref="echarBox" class="echart-box" style="height: 420px;"></div>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card/Card.vue";
import echarts from "echarts";

export default {
  components: {
    Card,
  },
  data() {
    return {
      searchForm: {},
    };
  },
  methods: {
    // 绘制报表
    drawChart() {
      const chart = echarts.init(this.$refs.echarBox);
      const option = {
        title: {
          text: "数据统计",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: ["订单", "销售额"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "5%",
          top: "12%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "订单",
            type: "line",
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: "销售额",
            type: "line",
            data: [220, 182, 191, 234, 290, 330, 310],
          },
        ],
      };
      chart.setOption(option);
    },
  },
  mounted() {
    this.drawChart();
  },
};
</script>

<style lang="less" scoped>
.el-form {
  margin-bottom: 30px;
}
</style>
