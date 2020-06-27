<template>
  <div class="pass-modify">
    <Card>
      <span slot="title">修改密码</span>
      <div slot="content">
        <el-form
          :model="passForm"
          :rules="rules"
          ref="passForm"
          status-icon
          label-width="100px"
          size="small"
        >
          <!-- 原密码 -->
          <el-form-item label="原密码" prop="oldPwd">
            <el-input v-model="passForm.oldPwd"></el-input>
          </el-form-item>

          <!-- 新密码 -->
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="passForm.newPwd"></el-input>
          </el-form-item>

          <!-- 确认新密码 -->
          <el-form-item label="确认新密码" prop="confirmPwd">
            <el-input v-model="passForm.confirmPwd"></el-input>
          </el-form-item>

          <!-- 按钮 -->
          <el-form-item>
            <el-button @click="submitForm" type="primary">确定</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </Card>
  </div>
</template>

<script>
// 引入组件
import Card from "@/components/Card/Card.vue";
import { PASS_REG } from "@/utils/reg";
import { validateOldPwd, editPwd } from "@/api/account";
import local from "@/utils/local";

export default {
  components: {
    Card
  },
  data() {
    // 自定义验证
    // 旧密码
    const checkOldPwd = async (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入旧密码"));
      } else {
        // 发送ajax
        let { code, msg } = await validateOldPwd({ oldPwd: value });
        console.log(code, msg);
        if (code == "11") {
          callback(new Error(msg));
        } else {
          callback();
        }
      }
    };

    // 新密码
    const checknewPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else if (!PASS_REG.test(value)) {
        callback(new Error("3 ~ 12位(字母丶数字丶下划线丶减号)"));
      } else {
        // 反向一致性
        if (this.passForm.confirmPwd) {
          this.$refs.passForm.validateField("confirmPwd");
        }
        callback();
      }
    };

    // 确认新密码
    const checkConfirmPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请确认新密码"));
      } else if (value !== this.passForm.newPwd) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      passForm: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: ""
      },
      // 验证规则
      rules: {
        oldPwd: { required: true, validator: checkOldPwd, trigger: "blur" }, // 自定义验证
        newPwd: { required: true, validator: checknewPwd, trigger: "blur" }, // 自定义验证
        confirmPwd: {
          required: true,
          validator: checkConfirmPwd,
          trigger: "blur"
        } // 自定义验证
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.passForm.validate(async valid => {
        if (valid) {
          let { code } = await editPwd({ newPwd: this.passForm.newPwd });
          if (code === 0) {
            local.clear(); // 清除本地token等数据
            this.$router.push("/login"); // 跳转到登录
          }
        } else {
          console.log("不可以哦~~~");
          return;
        }
      });
    },
    resetForm() {
      this.$refs.passForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.pass-modify {
  .content {
    .el-form {
      width: 360px;
    }
  }
}
</style>