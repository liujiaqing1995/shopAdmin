<template>
  <div class="category">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类按钮 -->
    <el-button type="primary" plain @click="showAddDialog">添加分类</el-button>
    <!-- 商品分配列表 -->
    <el-table
      v-loading="loading"
      :data="categoryList"
      style="width: 100%">
      <el-table-tree-column
        tree-key="cat_id"
        child-key="children"
        parent-key="cat_pid"
        level-key="cat_level"
        :intend-size="40"
        prop="cat_name"
        label="分类名称">
      </el-table-tree-column>
      <el-table-column
        label="是否有效"
        width="180">
        <template slot-scope="scope">
          <span v-if="!scope.row.cat_deleted">有效</span>
          <span v-else>无效</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="排序"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteCat(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form ref="addForm" :rules="addRules" :model="addForm" label-width="80px">
        <el-form-item label="分类名称" prop="assignname">
          <el-input v-model="addForm.assignname"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="fathername">
          <el-cascader
            :value="value"
            :props="props"
            :options="options"
            clearable
            v-model="addForm.assignpid"
            change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAssign">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form ref="editForm" :model="editForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入element-tree-grid
import Vue from 'vue'
import ElTreeGrid from 'element-tree-grid'
Vue.component(ElTreeGrid.name, ElTreeGrid)
export default {
  data () {
    return {
      categoryList: [], // 分类信息
      pagenum: 1, // 当前页
      pagesize: 10, // 当前页的条数
      loading: false, // 是否加载
      addDialogVisible: false, // 是否显示添加对话框
      addForm: { // 添加的数据
        assignname: '',
        assignpid: []
      },
      addRules: {
        assignname: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      options: [], // 商品分类的数据
      props: {
        label: 'cat_name',
        value: 'cat_id'
      },
      editDialogVisible: false, // 是否显示修改对话框
      editForm: { // 添加的数据
        cat_name: '',
        cat_id: 0
      },
      value: [], // 选项中绑定值
      total: 0 // 总条数
    }
  },
  methods: {
    // 获取商品分类
    getCategoryList () {
      // 发送ajax请求
      this.loading = true
      setTimeout(async () => {
        const res = await this.axios.get('categories', {
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        console.log(res.data)
        const {meta: {status}, data} = res.data
        if (status === 200) {
          this.categoryList = data.result
          this.total = data.total
        }
        this.loading = false
      }, 500)
    },
    // 每页的条数发生改变时
    handleSizeChange (val) {
      console.log(val)
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    // 当前页发生改变时
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
    },
    // 显示添加分类的对话框
    async showAddDialog () {
      this.addDialogVisible = true
      // 获取商品分类的数据
      const res = await this.axios.get('categories', {
        params: {
          type: 2
        }
      })
      const {meta: {status}, data} = res.data
      if (status === 200) {
        this.options = data
      }
    },
    // 添加分类
    addAssign () {
      try {
        this.$refs.addForm.validate(async valid => {
          if (valid) {
            // 发送ajax请求
            const res = await this.axios.post('categories', {
              cat_pid: this.addForm.assignpid[this.addForm.assignpid.length - 1],
              cat_name: this.addForm.assignname,
              cat_level: this.addForm.assignpid.length
            })
            const {meta: {status}} = res.data
            if (status === 201) {
              // 隐藏
              this.addDialogVisible = false
              // 重置
              this.$refs.addForm.resetFields()
              // 刷新页面
              this.getCategoryList()
              // 显示信息
              this.$message.success('添加分类成功')
            }
          } else {
            return false
          }
        })
      } catch (e) {
        this.$message.info('添加分类失败')
      }
    },
    // 删除分类
    async deleteCat (cat) {
      try {
        await this.$confirm('确定删除这个分类吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`categories/${cat.cat_id}`)
        if (res.data.meta.status === 200) {
          // 刷新列表
          this.getCategoryList()
          // 提示信息
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 显示修改对话框
    showEditDialog (cat) {
      this.editDialogVisible = true
      // 回显数据
      this.editForm.cat_name = cat.cat_name
      this.editForm.cat_id = cat.cat_id
    },
    // 修改数据
    async editCat () {
      try {
        if (!this.editForm.cat_name) {
          this.$message.info('修改分类不能为空')
          return
        }
        this.$refs.editForm.validate(async valid => {
          if (valid) {
            // 发送ajax请求
            const res = await this.axios.put(`categories/${this.editForm.cat_id}`, {
              cat_name: this.editForm.cat_name
            })
            const {meta: {status}} = res.data
            if (status === 200) {
              // 隐藏
              this.editDialogVisible = false
              // 重置
              this.$refs.editForm.resetFields()
              // 刷新页面
              this.getCategoryList()
              // 显示信息
              this.$message.success('修改分类成功')
            }
          } else {
            return false
          }
        })
      } catch (e) {
        this.$message.info('修改分类失败')
      }
    }
  },
  created () {
    this.getCategoryList()
  }
}
</script>
<style>
.el-breadcrumb{
  font-size: 20px
}
.el-button{
  margin: 10px 0;
}
</style>
