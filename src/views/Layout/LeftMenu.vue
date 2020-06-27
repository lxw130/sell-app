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
      <template v-for="(item, i) in menus">
        <!-- 没有儿子的 -->
        <el-menu-item
          v-if="item.children && item.children.length === 1"
          :index="item.path + '/' + item.children[0].path"
          :key="i"
        >
          <i
            class="iconfont"
            :class="
              item.meta && item.meta.icon
                ? item.meta.icon
                : item.children[0].meta.icon
            "
          ></i>
          <!-- <i :class="item.children[0].meta.icon"></i> -->
          <span slot="title">
            {{
              item.meta && item.meta.title
                ? item.meta.title
                : item.children[0].meta.title
            }}</span
          >
        </el-menu-item>

        <!-- 有儿子的 -->
        <el-submenu
          v-if="item.children && item.children.length > 1"
          :index="item.path"
          :key="i"
        >
          <template slot="title">
            <i class="iconfont" :class="item.meta.icon"></i>
            <span>{{ item.meta.title }}</span>
          </template>

          <el-menu-item
            v-for="(v, i) in item.children"
            :key="i"
            :index="item.path + '/' + v.path"
            >{{ v.meta.title }}</el-menu-item
          >
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { getRole } from "@/api/account";
import router, { asyncRoutes } from "@/router"; // 引入路由实例对象 和 路由配置
import local from "@/utils/local";
import { hasPermission, filterRoutes } from "@/utils/premission";

export default {
  computed: {
    // 当前激活
    curActive() {
      if (this.$route.path === "/order/order-detail")
        return "/order/order-list";
      return this.$route.path;
    },
  },
  data() {
    return {
      menus: [],
    };
  },
  async created() {
    // 获取角色 存入本地
    let { role } = await getRole();
    local.set("role", role);

    // 计算出权限路由 挂载动态路由
    let accessRoute = filterRoutes(asyncRoutes, role);
    router.addRoutes(accessRoute);

    // 计算菜单
    this.menus = accessRoute.filter((item) => {
      if (item.children && item.children[0].visible) {
        item.children = item.children.filter((v) => v.visible);
      }
      return item.visible;
    });
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
