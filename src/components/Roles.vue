<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <el-table
      :data="roleList"
      style="width: 100%">
      <!-- 展开合并 type="expand" -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="level1 in scope.row.children" :key="level1.id">
            <el-col :span="4">
              <span>{{level1.authName}}</span>
            </el-col>
            <el-col :span="20">
              <el-row v-for="level2 in scope.row.children" :key="level2.id">
                <el-col :span="4"></el-col>
                <el-col :span="20"></el-col>
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
          <el-button type="primary" size="mini" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" circle></el-button>
          <el-button type="success" size="mini" icon="el-icon-check" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: []
    }
  },
  methods: {
    async getRoleList () {
      const res = await this.axios.get('roles')
      const {meta, data} = res.data
      console.log(meta, data)
      if (meta.status === 200) {
        this.roleList = data
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
</style>
