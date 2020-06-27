import Vue from "vue";
import VueRouter from "vue-router";

// 解决跳重复跳转到同一个地址的警告问题
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};

Vue.use(VueRouter);

// 引入组件
import Login from "@/views/Login.vue";
import Layout from "@/views/Layout/Layout.vue";
import local from "@/utils/local";

// 路由配置 ( 改为动态路由 )
export const asyncRoutes = [
  // 登录
  {
    path: "/login",
    component: Login,
    visible: false
  },
  // 默认首页 -- 报表
  {
    path: "",
    component: Layout,
    redirect: "/home",
    visible: true,
    children: [
      {
        meta: { icon: "icon-shouye", title: "后台首页" },
        path: "home",
        component: () => import("@/views/Home.vue"),
      },
    ],
  },
  // 订单管理
  {
    path: "/order",
    component: Layout,
    meta: { title: "订单管理", icon: "icon-dingdan" },
    redirect: "/order/order-list",
    visible: true,
    children: [
      {
        path: "order-list",
        meta: { title: "订单列表" },
        visible: true,
        component: () => import("@/views/Order/OrderList.vue"),
      },
      {
        path: "order-detail",
        name: 'order-detail', // 命名式路由
        meta: { title: "订单详情" },
        visible: false,
        component: () => import("@/views/Order/OrderDetail.vue"),
      },
    ],
  },
  // 商品管理
  {
    path: "/goods",
    component: Layout,
    meta: { title: "商品管理", icon: "icon-shangpin" },
    redirect: "/goods/goods-list",
    visible: true,
    children: [
      {
        path: "goods-list",
        meta: { title: "商品列表" },
        component: () => import("@/views/Goods/GoodsList.vue"),
      },
      {
        path: "goods-add",
        meta: { title: "商品添加" },
        component: () => import("@/views/Goods/GoodsAdd.vue"),
      },
      {
        path: "goods-cate",
        meta: { title: "商品分类" },
        component: () => import("@/views/Goods/GoodsCate.vue"),
      },
    ],
  },
  // 店铺管理
  {
    path: "/shop",
    component: Layout,
    visible: true,
    children: [
      {
        path: "",
        meta: { title: "店铺管理", icon: "icon-dianpu" },
        component: () => import("@/views/Shop.vue"),
      },
    ],
  },
  // 账号管理
  {
    path: "/account",
    component: Layout,
    meta: { title: "账号管理", icon: "icon-icon_account", roles: ['super', 'normal'] },
    redirect: "/account/account-list",
    visible: true,
    children: [
      {
        path: "account-list",
        meta: { title: "账号列表", roles: ['super'] },
        component: () => import("@/views/Account/AccountList.vue"),
      },
      {
        path: "account-add",
        meta: { title: "账号添加", roles: ['super'] },
        component: () => import("@/views/Account/AccountAdd.vue"),
      },
      {
        path: "pass-modify",
        meta: { title: "修改密码" },
        component: () => import("@/views/Account/PassModify.vue"),
      },
      {
        path: "personal",
        meta: { title: "个人中心" },
        component: () => import("@/views/Account/Personal.vue"),
      },
    ],
  },
  // 销售统计
  {
    path: "/total",
    component: Layout,
    meta: { title: "销售统计", icon: "icon-tongji", roles: ['super'] }, // 只有超级管理员 才有权限访问
    redirect: "/total/goods-total",
    visible: true,
    children: [
      {
        path: "goods-total",
        meta: { title: "商品统计" },
        component: () => import("@/views/Total/GoodsTotal.vue"),
      },
      {
        path: "order-total",
        meta: { title: "订单统计" },
        component: () => import("@/views/Total/OrderTotal.vue"),
      },
    ],
  },
  // 404
  {
    path: '/404',
    visible: false,
    component: () => import("@/views/Error404.vue")
  },
  // 只要是路由中不存在的地址 都是404
  {
    path: '*',
    visible: false,
    redirect: '/404'
  },
];


// 初始化路由
const router = new VueRouter({
  routes: [
    // 登录
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/",
      component: Layout,
      redirect: "/home",
      children: [
        {
          meta: { title: "后台首页" },
          path: "home",
          component: () => import("@/views/Home.vue"),
        },
      ],
    },
  ],
});

// 路由守卫
/**
 * 路由守卫,会把所有的路由都守护起来, 你想要访问任务的路由 都需要先经过这个守卫
 * 所以:
 *   1. 我们可以在守卫里面 判断 这个用户到底能否访问路由
 * 参数：有to（去的那个路由）、from（离开的路由）、next（一定要用这个函数才能去到下一个路由，如果不用就拦截）最常用就这几种
 */
router.beforeEach((to, from, next) => {
  let isLogin = local.get("tk") ? true : false; // 是否登录
  if (to.path === "/login") {
    next(); // 放行
  } else {
    if (isLogin) {
      next(); // 放行
    } else {
      next("/login"); // 重置到登录
    }
  }
});


// 引入工具函数
import { hasPermission, filterRoutes } from "@/utils/premission";

/* 生成动态路由 */
export function createRoute() {
  // 获取本地角色
  let role = local.get("role", role);

  // 生成动态路由 重新挂载
  let accessRoute = filterRoutes(asyncRoutes, role);
  router.addRoutes(accessRoute);
}

export default router;
