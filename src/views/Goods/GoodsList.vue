<template>
  <div class="goods-list">
    <Card>
      <span slot="title">商品列表</span>
      <div slot="content" class="content">
        <!-- 表格 -->
        <el-table :data="tableData" height="480" style="width: 100%">
          <!-- 可以展开和收缩的 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <!-- 商品ID -->
                <el-form-item label="商品ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <!-- 商品名称 -->
                <el-form-item label="商品名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <!-- 所属分类 -->
                <el-form-item label="所属分类">
                  <span>{{ props.row.category }}</span>
                </el-form-item>
                <!-- 商品价格 -->
                <el-form-item label="商品价格">
                  <span>{{ props.row.price }}</span>
                </el-form-item>
                <!-- 商品评价 -->
                <el-form-item label="商品评价">
                  <span>{{ props.row.rating }}</span>
                </el-form-item>
                <!-- 商品销量 -->
                <el-form-item label="商品销量">
                  <span>{{ props.row.sellCount }}</span>
                </el-form-item>
                <!-- 创建时间 -->
                <el-form-item label="创建时间">
                  <span>{{ props.row.ctime }}</span>
                </el-form-item>
                <!-- 商品图片 -->
                <el-form-item label="商品图片">
                  <span>{{ props.row.imgUrl }}</span>
                </el-form-item>
                <!-- 商品描述 -->
                <el-form-item label="商品描述">
                  <span>{{ props.row.goodsDesc }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <!-- 商品名称 -->
          <el-table-column label="商品名称" prop="name"> </el-table-column>
          <!-- 商品价格 -->
          <el-table-column label="商品价格" prop="price"> </el-table-column>
          <!-- 所属分类 -->
          <el-table-column label="所属分类" prop="category"> </el-table-column>
          <!-- 商品图片 -->
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <img
                class="goods-img"
                width="50"
                height="50"
                :src="baseImgUrl + scope.row.imgUrl"
                alt="商品图片"
              />
            </template>
          </el-table-column>
          <!-- 商品描述 -->
          <el-table-column label="商品描述" prop="goodsDesc"> </el-table-column>
          <!-- 商品操作 -->
          <el-table-column label="操作">
            <template>
              <el-button size="mini">编辑</el-button>
              <el-button size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 3, 5, 10, 30, 50]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card/Card.vue";
import { getGoodsList } from "@/api/goods";

export default {
  components: {
    Card,
  },
  data() {
    return {
      tableData: [],
      pageSize: 5,
      currentPage: 1,
      total: 28,
      baseImgUrl: "http://127.0.0.1:5000/upload/imgs/goods_img/",
    };
  },
  methods: {
    // 当前页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoodsData();
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.getGoodsData();
    },

    // 获取商品列表数据
    async getGoodsData() {
      let { data, total } = await getGoodsList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });

      // 赋值渲染
      this.tableData = data;
      this.total = total;
    },
  },
  created() {
    this.getGoodsData(); // 调用函数 获取数据
  },
};
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 20px;
}
.goods-img {
  border-radius: 4px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
