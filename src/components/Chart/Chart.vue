<template>
  <div ref="echarBox" class="echart-box" style="height: 420px;"></div>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    // 外部传入的数据
    options: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    // 绘制报表
    drawChart() {
      // 1. 初始化报表
      this.chart = echarts.init(this.$refs.echarBox);

      // 2. 写配置
      const option = {
        title: {
          text: this.options.title, // 1外部传入
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: this.options.legend, // 2外部传入
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
          data: this.options.xData, // 3外部传入
        },
        yAxis: {
          type: "value",
        },
        series: this.options.series, // 4外部传入
      };

      // 3. 生成报表
      this.chart.setOption(option);
    },
  },
  mounted() {
    // 1. 野鸡方式1
    // setTimeout(() => {
    //   this.drawChart(); // 调用方法 创建报表
    // }, 1000);

    // 2. 第二个方式 （正常的方式）
    this.drawChart(); // 调用方法 创建报表
  },
  // 侦听器
  watch: {
    options: {
      handler(newVal, oldVal) {
        // 使用新数据生成报表
        this.chart.setOption({
          title: {
            text: newVal.title, // 1外部传入
          },
          legend: {
            data: newVal.legend, // 2外部传入
          },
          xAxis: {
            data: newVal.xData, // 3外部传入
          },
          series: newVal.series, // 4外部传入
        });
      },
      deep: true, // 深度监听
    },
  },
};
</script>

<style lang="less" scoped>
.echart-box {
  background-color: #fff;
  margin-top: 30px;
  padding: 30px;
  box-sizing: border-box;
}
</style>
