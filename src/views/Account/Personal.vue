<template>
  <div class="personal">
    <Card>
      <span slot="title">管理员信息</span>
      <div slot="content" class="content">
        <p>管理员ID: {{ info.id }}</p>
        <el-divider></el-divider>
        <p>账号: {{ info.account }}</p>
        <el-divider></el-divider>
        <p>用户组: {{ info.userGroup }}</p>
        <el-divider></el-divider>
        <p>创建时间: {{ info.ctime | filterCtime }}</p>
        <el-divider></el-divider>
        <div>
          <h3 class="text">管理员头像:</h3>

          <!-- 头像上传 -->
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            class="avatar-uploader"
            action="http://127.0.0.1:5000/users/avatar_upload"
          >
            <img v-if="imgUrl" :src="baseImgUrl + imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <!-- 修改头像 -->
          <el-button @click="changeAvatar" type="primary" size="mini">修改头像</el-button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card/Card.vue";
// import { getAccInfo } from "@/api/account";
import moment from "moment";
import local from "@/utils/local";
import { updateAvatar } from "@/api/account";

export default {
  components: {
    Card
  },
  data() {
    return {
      // 用户数据对象
      info: {},
      imgUrl: "",
      baseImgUrl: "http://127.0.0.1:5000/upload/imgs/acc_img/"
    };
  },
  methods: {
    // 上传成功
    handleAvatarSuccess(res) {
      console.log("上传成功后后端响应回来的数据:", res);
      let { code, imgUrl, msg } = res;
      if (code == 0) {
        this.imgUrl = imgUrl;
        this.$message({
          type: "success",
          message: msg
        });
      }
    },
    // 上传之前
    beforeAvatarUpload() {},
    // 修改头像
    async changeAvatar() {
      let { code } = await updateAvatar({ imgUrl: this.imgUrl });
      if (code == 0) {
        // 告诉头部 去更新数据
        this.$bus.$emit("updateAvatar");
      }
    }
  },
  async created() {
    // let { accountInfo } = await getAccInfo(); // 获取账号数据
    // 处理时间格式
    // accountInfo.ctime = moment(accountInfo.ctime).format("YYYY-MM-DD HH:mm:ss");

    // 赋值
    this.info = local.get("info");
  },
  filters: {
    // 过滤器
    filterCtime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less" scoped>
.personal {
  .content {
    .text {
      margin-bottom: 30px;
    }
    .el-button {
      margin-top: 20px;
    }
    /deep/.avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
    .avatar {
      width: 120px;
      height: 120px;
      display: block;
    }
  }
}
</style>