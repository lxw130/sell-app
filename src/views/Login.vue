<template>
  <div class="login">
    <el-form
      :model="loginForm"
      :rules="rules"
      class="login-form"
      ref="loginForm"
      label-width="100px"
      size="small"
      status-icon
    >
      <!-- 账号 -->
      <el-form-item label="账号" prop="account">
        <el-input
          prefix-icon="iconfont icon-icon_account"
          v-model="loginForm.account"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input
          @click.native="changeType"
          @keydown.native.13="submitForm"
          :type="isClose ? 'password' : 'text'"
          :suffix-icon="
            isClose ? 'iconfont icon-yanjing_bi' : 'iconfont icon-yanjing_kai'
          "
          prefix-icon="iconfont icon-lock"
          v-model="loginForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button size="mini" type="primary" @click="submitForm">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { checkLogin } from "@/api/account";
import local from "@/utils/local";

export default {
  data() {
    return {
      // 登录表单数据对象
      loginForm: {
        account: "",
        password: ""
      },
      // 验证规则
      rules: {
        // 内置验证:  单条规则
        // account: { required: true, message: "请输入账号", trigger: "blur" },

        // 内置验证: 多条规则
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 6, message: "长度 3 ~ 6 位", trigger: "blur" }
        ],

        password: { required: true, message: "请输入账号", trigger: "blur" }
      },
      isClose: true // 眼睛是否关闭
    };
  },
  methods: {
    // 登录提交表单
    submitForm() {
      // 选中整个登录表单
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 发送登录请求
          let { code, token } = await checkLogin(this.loginForm);
          if (code === 0) {
            local.set("tk", token); // 把token存入本地
            this.$router.push("/"); // 跳转后台首页
          }
        } else {
          console.log("前端验证没有通过");
          return;
        }
      });
    },
    // 切换眼睛的开和闭(切换密码框的type类型)
    changeType(e) {
      if (e.target.className.includes("icon-yanjing")) {
        this.isClose = !this.isClose;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background-color: #2d3a4b;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../assets/imgs/a.gif") no-repeat;
  background-size: 100% 100%;

  .login-form {
    width: 420px;
    .el-form-item {
      /deep/.el-form-item__label {
        color: #fff;
      }
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
