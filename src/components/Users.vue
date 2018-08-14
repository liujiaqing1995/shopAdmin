<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索添加按钮 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select" @keyup.enter.native="searchUser">
      <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
    </el-input>
    <el-button type="success" plain @click="showAddDialog">添加用户</el-button>
    <!-- 列表 -->
    <el-table
      :data="userData"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        width="180">
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUser(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="delUser(scope.row)"></el-button>
          <el-button type="success" size="mini" icon="el-icon-check" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="userSizeChange"
      @current-change="userCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户的模态框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form ref="addForm" :rules="addRules" :model="addForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 修改用户的模态框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form ref="editForm" :rules="addRules" :model="editForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userData: [],
      query: '', // 关键字
      pagenum: 1, // 当前页码
      pagesize: 2, // 每页显示条数
      total: 0, // 显示总条数
      addDialogVisible: false, // 是否显示添加用户的对话框
      addForm: { // 添加用户的数据
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '你输入的密码需长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '你输入的邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /^1\d{10}$/, message: '你输入的手机号格式不正确', trigger: 'blur' }
        ]
      },
      editDialogVisible: false, // 是否显示修改用户的对话框
      editForm: { // 添加用户的数据
        username: '',
        mobile: '',
        email: '',
        userId: ''
      }
    }
  },
  methods: {
    // 获取用户数据
    async getUserList () {
      const res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(res.data)
      const {meta: {status}, data: {total}, data: {users}} = res.data
      if (status === 200) {
        this.userData = users
        this.total = total
      }
    },
    // 每页的条数改变时
    userSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    // 页码发生改变时
    userCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    // 搜索用户功能
    searchUser () {
      this.getUserList()
    },
    // 用户状态发生改变
    async changeUser (user) {
      const res = await this.axios.put(`users/${user.id}/state/${user.mg_state}`)
      const {meta: {status}} = res.data
      if (status === 200) {
        // 渲染页面
        this.getUserList()
      }
    },
    // 显示添加用户的对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 添加用户
    async addUser () {
      // 二次校验表单
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          // 发送ajax
          // 如果是get请求的参数，要不就拼到url后面
          // 使用params参数，不能使用data
          // 如果是post请求的参数，不要拼到url后面
          // 使用data参数
          this.axios({
            method: 'post',
            url: 'users',
            data: this.addForm
          }).then(res => {
            const {meta: {status}} = res.data
            if (status === 201) {
              // 关闭对话框
              this.addDialogVisible = false
              // 让按钮回到最后显示
              this.total++
              this.pagenum = Math.ceil(this.total / this.pagesize)
              // 重新渲染页面
              this.getUserList()
              // 重置表单
              this.$refs.addForm.resetFields()
              // 显示提示信息
              this.$message.success('添加用户成功!')
            } else {
              this.$message.success('添加用户失败!')
            }
          })
        } else {
          return false
        }
      })
    },
    // 删除用户
    async delUser (user) {
      this.$confirm('确定删除该用户吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        this.axios.delete(`users/${user.id}`)
          .then(res => {
            console.log(res.data)
            const {meta: {status}} = res.data
            if (status === 200) {
              // 如果当前页只有一条数据了，需要让页数减1
              if (this.userData.length === 1) {
                this.pagenum--
              }
              // 重新渲染页面
              this.getUserList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 显示修改的对话框
    showEditDialog (user) {
      console.log(user)
      this.editDialogVisible = true
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
      this.editForm.userId = user.id
    },
    // 确定修改用户
    async editUser () {
      // 二次校验表单
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          // 发送ajax
          // 如果是get请求的参数，要不就拼到url后面
          // 使用params参数，不能使用data
          // 如果是post请求的参数，不要拼到url后面
          // 使用data参数
          this.axios({
            method: 'put',
            url: `users/${this.editForm.userId}`,
            data: {
              id: this.editForm.userId,
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
          }).then(res => {
            console.log(res)
            const {meta: {status}} = res.data
            if (status === 200) {
              // 关闭对话框
              this.editDialogVisible = false
              // 重新渲染页面
              this.getUserList()
              // 重置表单
              this.$refs.editForm.resetFields()
              // 显示提示信息
              this.$message.success('修改用户成功!')
            } else {
              this.$message.success('修改用户失败!')
            }
          })
        } else {
          return false
        }
      })
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style>
.input-with-select{
  width: 300px;
  margin: 10px 0;
}
</style>
