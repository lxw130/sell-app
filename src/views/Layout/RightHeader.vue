<template>
  <div class="right-header">
    <el-row>
      <el-col :span="12">
        <!-- 左侧面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="item in breadCrumbArr"
            :key="item.title"
            :to="{ path: item.path }"
            >{{ item.title }}</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-col>

      <el-col :span="12" class="right-box">
        <!-- 右侧 -->
        <!-- 下拉菜单 -->
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            欢迎你, {{ info.account }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="personal">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 头像 -->
        <img class="avatar" width="50" height="50" :src="info.imgUrl" alt />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import local from "@/utils/local";
import { getAccInfo } from "@/api/account";

export default {
  data() {
    return {
      info: {}, // 个人中心信息
      breadCrumbArr: [], // 面包屑数组
    };
  },
  methods: {
    handleCommand(command) {
      if (command === "personal") {
        this.$router.push("/account/personal"); // 跳转到个人中心
      } else {
        // 清除本地
        local.clear();
        // 弹出提示
        this.$message({
          type: "success",
          message: "退出登录成功,欢迎再来,哥哥.",
        });
        // 跳转到登录
        this.$router.push("/login");

        // 刷新页面 解决路由重复加载的问题
        location.reload();
      }
    },
    // 获取用户信息
    async getInfo() {
      let { accountInfo } = await getAccInfo(); // 发送请求 获取用户信息
      this.info = accountInfo;
      // 存入本地
      local.set("info", this.info);
    },
    // 计算出面包屑
    calcBreadCrumb(route) {
      let arr = [{ title: "首页", path: "/home" }];

      // 把面包屑算出来
      route.matched.forEach((item) => {
        if (item.meta.title) {
          arr.push({
            title: item.meta.title,
            path: item.path,
          });
        }
      });
      // 赋值
      this.breadCrumbArr = arr;
    },
  },
  created() {
    this.getInfo(); // 获取头部信息

    // 接收更新数据的信息
    this.$bus.$on("updateAvatar", () => {
      this.getInfo(); // 获取头部信息
    });

    this.calcBreadCrumb(this.$route); // 进入页面 调用一次计算面包屑函数
  },
  watch: {
    // 观察路由地址的变化
    "$route.path"() {
      // 数据变化  就会走这里
      this.calcBreadCrumb(this.$route); // 路由变化( 切换导航会变 ) 调用一次计算面包屑的函数
    },
  },
};
</script>

<style lang="less" scoped>
.right-header {
  flex: 0 0 60px;
  line-height: 60px;
  background-color: #ffffff;
  padding: 0 20px;
  box-sizing: border-box;
  .el-row {
    height: 60px;
    .el-col {
      height: 60px;
      display: flex;
      align-items: center;
      .avatar {
        border-radius: 50%;
        margin-left: 10px;
      }
    }
    .right-box {
      justify-content: flex-end;
    }
  }
}
</style>
