<template>
  <div class="account-add">
    <Card>
      <!-- 插入标题 -->
      <span slot="title">账号添加</span>

      <!-- 插入内容 -->
      <div slot="content" class="content">
        <!-- 添加账号的表单 -->
        <el-form
          :model="accAddForm"
          :rules="rules"
          size="small"
          status-icon
          ref="accAddForm"
          label-width="100px"
        >
          <!-- 账号 -->
          <el-form-item label="账号" prop="account">
            <el-input
              v-model="accAddForm.account"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="accAddForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <!-- 用户组 -->
          <el-form-item label="用户组" prop="userGroup">
            <el-select
              v-model="accAddForm.userGroup"
              placeholder="请选择用户组"
            >
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="普通管理员" value="普通管理员"></el-option>
            </el-select>
          </el-form-item>

          <!-- 添加和重置按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">添加</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card/Card.vue";
import { ACC_REG, PASS_REG } from "@/utils/reg";
import { addAccount } from "@/api/account";

export default {
  components: {
    Card,
  },
  data() {
    // 自定义验证账号
    const checkAcc = (rule, value, callback) => {
      /**
       * rule:  一个对象, 里面有很多验证规则的信息
       * value:  用户输入的值
       * callback: 一个函数
       *    如果成功:  callback()
       *    如果失败:  callback(new Error('失败提示信息'))
       */
      // console.log("rule:", rule);
      // console.log("value:", value);
      // console.log("callback:", callback);

      if (!value) {
        callback(new Error("请输入账号"));
      } else if (!ACC_REG.test(value)) {
        callback(new Error("3 ~ 12位(字母丶数字丶下划线丶减号)"));
      } else {
        callback();
      }
    };

    // 自定义验证密码
    const checkPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (!PASS_REG.test(value)) {
        callback(new Error("3 ~ 12位(字母丶数字丶下划线丶减号)"));
      } else {
        callback();
      }
    };

    return {
      // 添加账号表单
      accAddForm: {
        account: "",
        password: "",
        userGroup: "",
      },
      // 验证规则
      rules: {
        account: { required: true, validator: checkAcc, trigger: "blur" }, // 自定义验证
        password: { required: true, validator: checkPass, trigger: "blur" }, // 自定义验证
        // 内置
        userGroup: {
          required: true,
          message: "请选择用户组",
          trigger: "change",
        },
      },
    };
  },
  methods: {
    // 添加账号
    submitForm() {
      this.$refs.accAddForm.validate(async (valid) => {
        if (valid) {
          // console.log("前端验证通过,可以提交");
          // 发送添加账号的请求
          let { code } = await addAccount(this.accAddForm);
          if (code === 0) {
            this.$router.push("/account/account-list");
          }
        } else {
          console.log("前端验证不通过,不能提交");
          return;
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.accAddForm.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.account-add {
  .content {
    .el-form {
      width: 309px;
      .el-form-item {
        margin-bottom: 35px;
      }
    }
  }
}
</style>
