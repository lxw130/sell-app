<template>
  <div class="goods-cate">
    <Card>
      <span slot="title">商品分类</span>
      <div slot="content" class="content">
        <!-- 表格组件 -->
        <el-table :data="tableData" style="width: 100%">
          <!-- 序号 -->
          <el-table-column label="序号" width="180">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>

          <!-- 分类名称 -->
          <el-table-column label="分类名称" width="180">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">
                {{ scope.row.cateName }}
              </span>
              <el-input
                v-else
                size="mini"
                v-model="scope.row.cateName"
              ></el-input>
            </template>
          </el-table-column>

          <!-- 是否启用 -->
          <el-table-column label="是否启用" width="180">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.state"
                :disabled="!scope.row.isEdit"
                active-color="#13ce66"
              >
              </el-switch>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="edit(scope.row)"
                v-if="!scope.row.isEdit"
                size="mini"
                >编辑</el-button
              >
              <el-button @click="saveEdit" v-else size="mini" type="success"
                >完成</el-button
              >
              <el-button size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
        >
        </el-pagination>

        <!-- 模态框 -->
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card/Card.vue";
import { getCateList, editCate } from "@/api/goods";

export default {
  components: {
    Card,
  },
  data() {
    return {
      tableData: [], // 表格数据
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 28, // 总条数
    };
  },
  methods: {
    // 当前页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCateData();
    },

    // 获取数据
    async getCateData() {
      let { data, total } = await getCateList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });

      // 处理数据格式
      data.forEach((item) => {
        item.state = item.state === 1 ? true : false;
        item.isEdit = false; // 每一项添加一个字段 是否可以编辑 默认false
      });

      // 赋值渲染
      this.tableData = data;
      this.total = total;
    },

    // 编辑
    edit(row) {
      row.isEdit = !row.isEdit; // 当前行可编辑状态取反
      console.log(row);
      this.row = row;
    },

    // 完成
    async saveEdit() {
      // 发送修改分类请求
      let { code } = await editCate({
        id: this.row.id,
        cateName: this.row.cateName,
        state: this.row.state,
      });

      if (code === 0) this.getCateData(); // 刷新
    },
  },
  created() {
    this.getCateData(); // 进入页面 调用一次
  },
};
</script>

<style lang="less" scoped></style>
