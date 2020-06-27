<template>
  <div class="shop">
    <Card>
      <div slot="title" class="title">
        <span>店铺管理</span>
        <el-button @click="edit" size="small" type="primary">{{
          disabled ? "编辑" : "保存"
        }}</el-button>
      </div>
      <div slot="content" class="content">
        <el-form
          :disabled="disabled"
          size="small"
          :mode="shopForm"
          label-width="100px"
        >
          <!-- 店铺名称 -->
          <el-form-item label="店铺名称">
            <el-input v-model="shopForm.name"></el-input>
          </el-form-item>

          <!-- 店铺公告 -->
          <el-form-item label="店铺公告">
            <el-input
              type="textarea"
              v-model="shopForm.bulletin"
              rows="5"
            ></el-input>
          </el-form-item>

          <!-- 店铺头像 -->
          <el-form-item label="店铺头像">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:5000/shop/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="imgUrl"
                :src="baseUrl + imgUrl"
                alt="店铺头像"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <!-- 店铺图片 -->
          <el-form-item label="店铺图片">
            <el-upload
              action="http://127.0.0.1:5000/shop/upload"
              list-type="picture-card"
              :on-success="handleImgSuccess"
              :file-list="fileList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>

            <!-- 预览的模态框 -->
            <el-dialog :visible.sync="dialogVisible">
              <!-- 预览的图片 -->
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>

          <!-- 配送费 -->
          <el-form-item label="配送费">
            <el-input-number
              v-model="shopForm.deliveryPrice"
              :min="0"
              :max="100"
            ></el-input-number>
          </el-form-item>

          <!-- 配送时间 -->
          <el-form-item label="配送时间">
            <el-input v-model="shopForm.deliveryTime"></el-input>
          </el-form-item>

          <!-- 配送描述 -->
          <el-form-item label="配送描述">
            <el-input v-model="shopForm.description"></el-input>
          </el-form-item>

          <!-- 店铺评分 -->
          <el-form-item label="店铺评分">
            <el-input v-model="shopForm.score"></el-input>
          </el-form-item>

          <!-- 销量 -->
          <el-form-item label="销量">
            <el-input v-model="shopForm.sellCount"></el-input>
          </el-form-item>

          <!-- 活动 -->
          <el-form-item label="活动">
            <el-checkbox-group v-model="shopForm.supports">
              <el-checkbox label="在线支付满28减5" name="type"></el-checkbox>
              <el-checkbox
                label="VC无限橙果汁全场8折"
                name="type"
              ></el-checkbox>
              <el-checkbox label="单人精彩套餐" name="type"></el-checkbox>
              <el-checkbox label="特价饮品8折抢购" name="type"></el-checkbox>
              <el-checkbox label="单人特色套餐" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <!-- 营业时间 -->
          <el-form-item label="营业时间">
            <el-time-picker
              is-range
              v-model="shopForm.date"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </el-form-item>
        </el-form>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card/Card.vue";
import { getShopInfo } from "@/api/shop";

export default {
  components: {
    Card,
  },
  data() {
    return {
      // 店铺管理表单
      shopForm: {
        supports: [],
        date: [],
      },
      imgUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      baseUrl: "http://127.0.0.1:5000/upload/shop/",
      pics: [], // 图片名字列表
      fileList: [], // 图片列表
      disabled: true, // 是否禁用 默认是禁用的
    };
  },
  methods: {
    // 上传成功的回调
    handleAvatarSuccess(res) {
      let { code, msg, imgUrl } = res;
      if (code === 0) {
        this.imgUrl = imgUrl; // 回填图片
        this.$message({
          type: "success",
          message: msg,
        });
      }
    },
    // 上传之前的限制
    beforeAvatarUpload(file) {
      console.log(file);
      const isJPG = file.type === "image/jpeg"; // 限制上传类型
      const isLt2M = file.size / 1024 / 1024 < 2; // 限制大小

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 删除
    handleRemove(file) {
      this.pics.splice(this.pics.indexOf(file.name), 1); // 删除的时候 把图片的名字 从数组删除
    },

    // 预览
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    },

    // 上传成功
    handleImgSuccess(res) {
      this.pics.push(res.imgUrl); // 添加
    },

    // 编辑
    edit() {
      this.disabled = !this.disabled; // 启用
      // console.log(this.fileList);

      if (this.disabled) {
        console.log("发送ajax");
        console.log(this.pics);
      }
    },

    // 获取店铺信息
    async getShopData() {
      let { data } = await getShopInfo();

      this.shopForm = data; // 回填数据
      this.imgUrl = data.avatar; // 回填店铺头像

      // 保存图片名字
      this.pics = data.pics;

      // 回填店铺图片列表
      let arr = [];
      data.pics.forEach((v) => {
        arr.push({
          name: v,
          url: this.baseUrl + v,
        });
      });
      this.fileList = arr;
    },
  },
  created() {
    this.getShopData(); // 获取店铺信息
  },
};
</script>

<style lang="less" scoped>
.shop {
  .title {
    display: flex;
    justify-content: space-between;
  }
  .el-form {
    width: 450px;
    .el-form-item {
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
        width: 148px;
        height: 148px;
        line-height: 148px;
        text-align: center;
      }
      .avatar {
        width: 148px;
        height: 148px;
        display: block;
      }
      // /deep/.el-upload--picture-card {
      //   width: 120px;
      //   height: 120px;
      //   display: flex;
      //   justify-content: center;
      //   align-items: center;
      // }
    }
  }
}
</style>
