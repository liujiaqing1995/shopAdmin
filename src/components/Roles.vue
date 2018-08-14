<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="primary" plain class="mb_10" @click="addShowDialog">添加角色</el-button>
    <!-- 权限列表 -->
    <el-table
      :data="roleList"
      style="width: 100%">
      <!-- 展开合并 type="expand" -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-if="scope.row.children.length === 0">该角色没有任何权限</el-row>
          <el-row class="bb mb_10" v-for="level1 in scope.row.children" :key="level1.id">
            <el-col :span="4">
              <el-tag
                :disable-transitions="false"
                @close="delRight(scope.row, level1.id)"
                closable>
                {{level1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row class="mb_10" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag
                    type="success"
                    :disable-transitions="false"
                    @close="delRight(scope.row, level2.id)"
                    closable>
                    {{level2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-row class="mb_10">
                    <el-tag
                      closable
                      type="warning"
                      :disable-transitions="false"
                      @close="delRight(scope.row, level3.id)"
                      v-for="level3 in level2.children" :key="level3.id">{{level3.authName}}</el-tag>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 显示索引号 type="index" -->
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="描述">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteRole(scope.row)"></el-button>
          <el-button type="success" size="mini" icon="el-icon-check" plain @click="showAssignDialog(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form ref="addForm" :rules="addRules" :model="addForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form ref="editForm" :rules="addRules" :model="editForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的模态框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignDialogVisible"
      width="40%">
      <!-- 树形控件 -->
      <el-tree
        :data="assignRoleList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addDialogVisible: false, // 是否显示添加角色的对话框
      addForm: { // 添加角色的数据
        roleName: '',
        roleDesc: ''
      },
      addRules: { // 添加角色的表单验证
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false, // 是否显示编辑角色的对话框
      editForm: {}, // 编辑角色的数据
      assignDialogVisible: false, // 是否显示分配角色的对话框
      assignRoleList: [], // 获取分配角色的数据列表
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      assignRoleId: '', // 需要分配权限的角色id
      roleList: [] // 角色列表
    }
  },
  methods: {
    // 获取角色列表
    async getRoleList () {
      const res = await this.axios.get('roles')
      const {meta, data} = res.data
      console.log(meta, data)
      if (meta.status === 200) {
        this.roleList = data
      }
    },
    // 删除角色
    async deleteRole (role) {
      try {
        await this.$confirm('确定删除吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 发送请求
        const res = await this.axios.delete(`roles/${role.id}`)
        const {meta: {status}} = res.data
        if (status === 200) {
          // 重新渲染
          this.getRoleList()
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
    // 显示添加角色模态框
    addShowDialog () {
      this.addDialogVisible = true
    },
    // 添加角色
    addRole () {
      // 表单的二次验证
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 发送ajax请求
          const res = await this.axios.post('roles', this.addForm)
          const {meta: {status}} = res.data
          if (status === 201) {
            // 隐藏模态框
            this.addDialogVisible = false
            // 重置表单
            this.$refs.addForm.resetFields()
            // 重新渲染
            this.getRoleList()
            // 提示信息
            this.$message.success('添加角色成功')
          }
        } else {
          return false
        }
      })
    },
    // 显示编辑角色的对话框
    showEditDialog (role) {
      console.log(role)
      this.editForm = role
      this.editDialogVisible = true
    },
    // 编辑角色
    editRole () {
      // 表单的二次验证
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          // 发送ajax请求
          const res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
          console.log(res)
          const {meta: {status}} = res.data
          if (status === 200) {
            // 隐藏模态框
            this.editDialogVisible = false
            // 重置表单
            this.$refs.editForm.resetFields()
            // 重新渲染
            this.getRoleList()
            // 提示信息
            this.$message.success('修改角色成功')
          }
        } else {
          return false
        }
      })
    },
    // 删除指定权限
    async delRight (role, rightId) {
      // 发送ajax请求
      const res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res.data.data)
      role.children = res.data.data
    },
    // 显示分配角色的对话框
    async showAssignDialog (role) {
      this.assignDialogVisible = true
      // 发送ajax请求
      const res = await this.axios.get('rights/tree')
      // 总的权限
      this.assignRoleList = res.data.data
      // 获取当前角色的id
      this.assignRoleId = role.id
      // 收集默认选中的三级列表id
      let defaulCheckedtkeys = []
      role.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            defaulCheckedtkeys.push(level3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(defaulCheckedtkeys)
    },
    // 分配角色
    async assignRole () {
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // 发送ajax请求
      const res = await this.axios.post(`roles/${this.assignRoleId}/rights`, {
        rids: [...checkedKeys, ...halfCheckedKeys].join()
      })
      const {meta: {status}} = res.data
      if (status === 200) {
        // 隐藏
        this.assignDialogVisible = false
        // 重新渲染
        this.getRoleList()
        // 提示信息
        this.$message.success('分配权限成功')
      }
    }
  },
  created () {
    this.getRoleList()
  }
}
</script>

<style>
.el-breadcrumb{
  height: 30px;
  line-height: 30px;
  font-size: 16px;
}
.mb_10{
  margin-bottom: 10px;
}
.mr_10{
  margin-right: 10px;
}
.bb{
  border-bottom: 1px solid #ddd
}
</style>
