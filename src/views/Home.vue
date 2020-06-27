<template>
  <div class="home">
    <!-- 数据列表 -->
    <el-row :gutter="20">
      <el-col v-for="(item, i) in dataList" :span="6" :key="i"
        ><div class="item">
          <div class="icon">
            <img width="60" height="60" :src="item.iconSrc" />
          </div>
          <div class="count">
            <p>{{ item.title }}</p>
            <h1>{{ item.count }}</h1>
          </div>
        </div></el-col
      >
    </el-row>

    <!-- 报表 -->
    <!-- <Chart v-if="visible" :options="options" /> -->
    <Chart :options="options" />
  </div>
</template>

<script>
import Chart from "@/components/Chart/Chart.vue";
import { getTotalData } from "@/api/totalData";

export default {
  components: {
    Chart,
  },
  data() {
    return {
      // 数据列表
      dataList: [
        {
          iconSrc: require("@/assets/imgs/order-icon01.png"),
          title: "总订单",
          count: 102400,
        },
        {
          iconSrc: require("@/assets/imgs/sale-icon01.png"),
          title: "总销售额",
          count: 102400,
        },
        {
          iconSrc: require("@/assets/imgs/order-icon02.png"),
          title: "今日订单",
          count: 102400,
        },
        {
          iconSrc: require("@/assets/imgs/sale-icon02.png"),
          title: "今日销售额",
          count: 102400,
        },
      ],
      // 报表配置 [数据从后端来 发送ajax]
      options: {
        title: "数据统计",
        legend: ["订单", "销售额"],
        xData: [],
        series: [],
      },
      // visible: false,
    };
  },
  methods: {
    async fetData() {
      let {
        // 卡片数据
        totalOrder,
        totalAmount,
        todayOrder,
        totayAmount,

        // 报表数据
        xData,
        orderData,
        amountData,
      } = await getTotalData();

      // 卡片数据
      let arr = [totalOrder, totalAmount, todayOrder, totayAmount];
      arr.forEach((v, i) => {
        this.dataList[i].count = v;
      });

      // 报表数据
      this.options.xData = xData;
      this.options.series = [
        {
          name: "订单",
          type: "line",
          data: orderData,
        },
        {
          name: "销售额",
          type: "line",
          data: amountData,
        },
      ];
    },
  },
  mounted() {
    // 发送请求 获取首页数据
    this.fetData();
  },
};
</script>

<style lang="less" scoped>
.home {
  .el-row {
    .item {
      background-color: #fff;
      max-width: 260px;
      height: 100px;
      display: flex;
      .icon {
        flex: 0 0 100px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .count {
        flex: 1;
        padding: 20px;
        box-sizing: border-box;
        p {
          color: #97a8be;
          margin-bottom: 20px;
        }
        h1 {
          font-weight: 700;
          color: orange;
        }
      }
    }
  }
  .echart-box {
    background-color: #fff;
    margin-top: 30px;
    padding: 30px;
    box-sizing: border-box;
  }
}
</style>
