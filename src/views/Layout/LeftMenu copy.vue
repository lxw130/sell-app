<template>
  <div class="left-menu">
    <!-- 导航 -->
    <el-menu
      :default-active="curActive"
      router
      text-color="#fff"
      background-color="#304156"
      unique-opened
    >
      <!-- 后台首页 -->
      <el-menu-item index="/home">
        <i class="iconfont icon-shouye"></i>
        <span slot="title">后台首页</span>
      </el-menu-item>

      <!-- 订单管理 -->
      <el-menu-item index="/order/order-list">
        <i class="iconfont icon-dingdan"></i>
        <span slot="title">订单管理</span>
      </el-menu-item>

      <!-- 商品管理 -->
      <el-submenu index="goods">
        <template slot="title">
          <i class="iconfont icon-shangpin"></i>
          <span>商品管理</span>
        </template>

        <el-menu-item index="/goods/goods-list">商品列表</el-menu-item>
        <el-menu-item index="/goods/goods-add">商品添加</el-menu-item>
        <el-menu-item index="/goods/goods-cate">商品分类</el-menu-item>
      </el-submenu>

      <!-- 店铺管理 -->
      <el-menu-item index="/shop">
        <i class="iconfont icon-dianpu"></i>
        <span slot="title">店铺管理</span>
      </el-menu-item>

      <!-- 账号管理 -->
      <el-submenu index="account">
        <template slot="title">
          <i class="iconfont icon-icon_account"></i>
          <span>账号管理</span>
        </template>

        <el-menu-item index="/account/account-list">账号列表</el-menu-item>
        <el-menu-item index="/account/account-add">账号添加</el-menu-item>
        <el-menu-item index="/account/pass-modify">修改密码</el-menu-item>
      </el-submenu>

      <!-- 销售统计 -->
      <el-submenu index="total">
        <template slot="title">
          <i class="iconfont icon-tongji"></i>
          <span>销售统计</span>
        </template>

        <el-menu-item index="/total/goods-total">商品统计</el-menu-item>
        <el-menu-item index="/total/order-total">订单统计</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { getRole } from "@/api/account";
import router, { asyncRoutes } from "@/router"; // 引入路由实例对象 和 路由配置

export default {
  computed: {
    // 当前激活
    curActive() {
      if (this.$route.path === "/order/order-detail")
        return "/order/order-list";

      return this.$route.path;
    },
  },
  async created() {
    let { role } = await getRole();
    console.log(role);

    /*
      判断当前路由对象是否有权限
      route: 你要判断的路由对象
      role: 当前角色
    */
    function hasPermission(route, role) {
      if (route.meta && route.meta.roles) {
        return route.meta.roles.includes(role); // 如果配置了 就看roles包不包含当前角色 包含就是有权限 否则就是没有权限
      } else {
        return true; // 如果没有配置meta 里面也没有roles 证明不需要权限 都可以访问 直接return true
      }
    }

    /* 
      封装函数 把可以访问的路由过滤出来
     */
    function filterRoutes(asyncRoutes, role) {
      // 把有权限的路由过滤出来
      let accessRoute = asyncRoutes.filter((item) => {
        if (hasPermission(item, role)) {
          if (item.children && item.children.length) {
            // 递归过滤
            item.children = filterRoutes(item.children, role);
          }
          return true; // 有权限 返回true
        } else {
          return false; // 没有权限返回false
        }
      });

      return accessRoute;
    }

    let accessRoute = filterRoutes(asyncRoutes, role); // 调用函数 过滤路由

    // 动态加载路由 ( 添加算出来的路由 )
    router.addRoutes(accessRoute);

    console.log(accessRoute);

    // 计算菜单
    let menus = accessRoute.filter((item) => {
      return item.visible;
    });

    console.log(menus);
  },
};
</script>

<style lang="less" scoped>
.left-menu {
  flex: 0 0 200px;
  background-color: #304156;
  .el-menu {
    border-right: 0px;
    .el-menu-item {
      .iconfont {
        color: #fff;
        margin-right: 10px;
      }
    }
    .el-submenu {
      .el-submenu__title {
        .iconfont {
          color: #fff;
          margin-right: 10px;
        }
      }
      /deep/.el-menu {
        .el-menu-item {
          background-color: #202f3f !important;
        }
      }
    }
  }
}
</style>
