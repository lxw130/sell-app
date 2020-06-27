<template>
  <div class="account-list">
    <Card>
      <!-- 插入标题 -->
      <span slot="title">账号列表</span>

      <!-- 插入内容 -->
      <div slot="content" class="content">
        <!-- 表格组件 -->
        <el-table
          @selection-change="selectChange"
          :data="tableData"
          ref="accTable"
          style="width: 100%"
        >
          <!-- 选择框 -->
          <el-table-column type="selection" width="55"></el-table-column>

          <!-- 账号 -->
          <el-table-column
            prop="account"
            label="账号"
            width="160"
          ></el-table-column>

          <!-- 用户组 -->
          <el-table-column
            prop="userGroup"
            label="用户组"
            width="160"
          ></el-table-column>

          <!-- 创建时间 -->
          <el-table-column
            prop="ctime"
            label="创建时间"
            width="180"
          ></el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" size="mini">编辑</el-button>
              <el-button @click="del(scope.row)" size="mini" type="danger"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div class="pagination-wrap">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1, 3, 5, 10, 20, 30, 50]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </div>

        <!-- 批量删除 和 取消选择 -->
        <div class="del-cancel">
          <el-button @click="batchDel" type="danger" size="mini"
            >批量删除</el-button
          >
          <el-button @click="cancel" type="primary" size="mini"
            >取消选择</el-button
          >
        </div>

        <!-- 编辑的时候弹出的模态框 -->
        <el-dialog
          class="dialog"
          title="账号编辑"
          :visible.sync="dialogVisible"
          width="360px"
        >
          <!-- 表单 -->
          <el-form
            :model="editForm"
            :rules="rules"
            size="small"
            status-icon
            ref="editForm"
            label-width="70px"
          >
            <!-- 账号 -->
            <el-form-item label="账号" prop="account">
              <el-input
                v-model="editForm.account"
                class="acc-input"
                autocomplete="off"
              ></el-input>
            </el-form-item>

            <!-- 用户组 -->
            <el-form-item label="用户组" prop="userGroup">
              <el-select
                v-model="editForm.userGroup"
                placeholder="请选择用户组"
              >
                <el-option label="超级管理员" value="超级管理员"></el-option>
                <el-option label="普通管理员" value="普通管理员"></el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from "@/components/Card/Card.vue";
import { getAccList, delAcc, delAccBatch, editAcc } from "@/api/account";
import moment from "moment";

export default {
  components: {
    Card,
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      currentPage: 1, // 当前页
      pageSize: 3, // ,每页条数
      total: 0, // 总条数
      dialogVisible: false, // 编辑模态框是否显示
      // 编辑表单
      editForm: {
        account: "",
        userGroup: "",
      },
      // 验证规则
      rules: {
        account: {},
        userGroup: {},
      },
    };
  },
  methods: {
    // 获取数据的函数
    async getAccData() {
      let { data, total } = await getAccList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });

      // 边界判断
      if (!data.length && this.currentPage !== 1) {
        this.currentPage -= 1; // 页码-1
        this.getAccData(); // 调用自己
      }

      // 处理时间格式
      data.forEach((v) => {
        v.ctime = moment(v.ctime).format("YYYY-MM-DD HH:mm:ss");
      });

      // 赋值渲染
      this.tableData = data;
      this.total = total;
    },
    // pageSize[每页条数] 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAccData();
    },
    // currentPage[当前页码] 改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAccData();
    },
    // 取消选择
    cancel() {
      this.$refs.accTable.clearSelection();
    },
    // 当选择发生变化
    selectChange(rows) {
      this.ids = rows.map((row) => row.id); // 把选中的id获取到 存起来
    },
    // 批量删除
    batchDel() {
      if (!this.ids || !this.ids.length) {
        this.$message.error("请选择以后再操作!清醒一点~");
        return;
      }

      // 优化体验
      this.$confirm("确定批量删除吗?很危险哦~~~", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 如果用户点击确定 就会走then
          let { code } = await delAccBatch({
            ids: JSON.stringify(this.ids),
          });
          if (code === 0) {
            this.getAccData(); // 重新获取一次数据
          }
        })
        .catch(() => {
          // 如果用户点击取消 走 catch
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 删除
    del(row) {
      // 优化删除体验
      this.$confirm("确认删除该账号吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        // 用户点击确定
        .then(async () => {
          let { code } = await delAcc({ id: row.id }); // 发送删除请求
          if (code === 0) {
            this.getAccData(); // 重新调用接口 获取数据 就是最新的数据
          }
        })
        // 用户点击取消
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑
    edit(row) {
      console.log("要编辑的数据", row);
      this.dialogVisible = true; // 显示模态框
      this.editForm = { ...row }; // 回填数据
    },
    // 确定编辑
    async saveEdit() {
      this.dialogVisible = false;
      let { code } = await editAcc({
        id: this.editForm.id,
        account: this.editForm.account,
        userGroup: this.editForm.userGroup,
      });
      if (code === 0) {
        this.getAccData(); // 刷新
      }
    },
  },
  created() {
    this.getAccData();
  },
};
</script>

<style lang="less" scoped>
.account-list {
  .box-card {
    .content {
      .pagination-wrap {
        margin-top: 20px;
      }
      .del-cancel {
        margin-top: 20px;
      }
      .dialog {
        .acc-input {
          width: 209px;
        }
      }
    }
  }
}
</style>
