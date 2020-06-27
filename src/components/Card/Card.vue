<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 1这里预留位置 将来插入标题 -->
      <slot name="title"></slot>
    </div>

    <div class="content">
      <!-- 2这里预留位置 将来插入内容 -->
      <slot name="content"></slot>
    </div>
  </el-card>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
</style>