<template>
  <div class="error-404">
    <h1>你访问的页面不存在</h1>
    <p @click="$router.go(-1)">返回上一页</p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.error-404 {
  color: red;
  text-align: center;
  margin: 100px;
  p:hover {
    color: green;
  }
}
</style>
