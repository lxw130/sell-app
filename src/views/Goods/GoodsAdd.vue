<template>
  <div class="goods-add">
    <Card>
      <span slot="title">商品添加</span>
      <div slot="content" class="content">
        <el-form
          :model="goodsAddForm"
          ref="goodsAddForm"
          size="small"
          label-width="100px"
        >
          <!-- 商品名称 -->
          <el-form-item label="商品名称">
            <el-input v-model="goodsAddForm.name"></el-input>
          </el-form-item>
          <!-- 商品分类 -->
          <el-form-item label="商品分类">
            <el-select
              v-model="goodsAddForm.category"
              placeholder="请选择商品分类"
            >
              <el-option
                v-for="item in categories"
                :key="item.cateName"
                :label="item.cateName"
                :value="item.cateName"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 商品价格 -->
          <el-form-item label="商品价格">
            <el-input-number
              v-model="goodsAddForm.price"
              :min="0"
              :max="100000"
              label="描述文字"
            ></el-input-number>
          </el-form-item>
          <!-- 商品图片 -->
          <el-form-item label="商品图片">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:5000/goods/goods_img_upload"
              :show-file-list="false"
              :on-success="handleImgSuccess"
              :before-upload="beforeImgUpload"
            >
              <img
                v-if="goodsAddForm.imgUrl"
                :src="baseImgUrl + goodsAddForm.imgUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <!-- 商品描述 -->
          <el-form-item label="商品描述">
            <el-input
              type="textarea"
              v-model="goodsAddForm.goodsDesc"
            ></el-input>
          </el-form-item>
          <!-- 添加商品按钮 -->
          <el-form-item>
            <el-button @click="submitForm" type="primary" size="mini"
              >添加商品</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card/Card.vue";
import { getCateNameList, addGoods } from "@/api/goods";

export default {
  components: {
    Card,
  },
  data() {
    return {
      // 商品添加表单
      goodsAddForm: {
        price: 0,
        imgUrl: "",
      },
      categories: [], // 分类
      baseImgUrl: "http://127.0.0.1:5000/upload/imgs/goods_img/",
    };
  },
  methods: {
    // 上传成功的函数
    handleImgSuccess(res) {
      console.log(res);
      let { code, imgUrl, msg } = res;
      if (code === 0) {
        this.goodsAddForm.imgUrl = imgUrl; // 回填图片
        // 弹出提示
        this.$message({
          type: "success",
          message: msg,
        });
      }
    },
    beforeImgUpload() {},

    // 获取分类名称
    async getCateNames() {
      let { categories } = await getCateNameList();
      this.categories = categories;
    },
    // 提交添加商品表单
    submitForm() {
      this.$refs.goodsAddForm.validate(async (valid) => {
        if (valid) {
          // 发送添加商品的ajax
          let { code } = await addGoods(this.goodsAddForm);
          if (code === 0) {
            this.$router.push("/goods/goods-list");
          }
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.getCateNames(); // 调用获取分类名称的函数
  },
};
</script>

<style lang="less" scoped>
.el-form {
  width: 420px;
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
</style>
