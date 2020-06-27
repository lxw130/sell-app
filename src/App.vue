<template>
  <div class="app">
    <!-- 路由出口 -->
    <router-view />
  </div>
</template>

<script>
import { createRoute } from "@/router";

export default {
  created() {
    createRoute(); // 刷新重新生成路由 挂载动态路由
  },
};
</script>

<style lang="less" scoped>
.app {
  height: 100%;
}
</style>
