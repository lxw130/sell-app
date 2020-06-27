<template>
  <div class="order-detail">
    <h1>订单详情</h1>
  </div>
</template>

<script>
export default {
  created() {
    // 获取query方式传递过来的数据 【问题： 传递少量数据 数据量大的话，地址栏过长】
    // console.log(this.$route.query);
    // 获取params方式传递过来的数据 【问题： 不能刷新浏览器 刷新数据就没有了】
    // console.log("params获取到的数据：", this.$route.params);
  },
};
</script>

<style lang="less" scoped></style>
