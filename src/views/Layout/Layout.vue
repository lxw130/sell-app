<template>
  <div class="layout">
    <!-- 左侧导航 -->
    <LeftMenu />

    <!-- 右侧主体 -->
    <div class="main">
      <!-- 右侧头部 -->
      <RightHeader />

      <div class="content">
        <!-- 右侧路由出口(内容) -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// 引入组件
import LeftMenu from "./LeftMenu.vue";
import RightHeader from "./RightHeader.vue";

export default {
  // 注册
  components: {
    LeftMenu,
    RightHeader
  }
};
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  display: flex;
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    .content {
      flex: 1;
      background-color: #f0f2f5;
      padding: 20px;
      box-sizing: border-box;
      overflow: scroll;
    }
  }
}
</style>