<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加商品 -->
    <el-button type="primary" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <!-- 列表 -->
    <el-table
      :data="goodsData"
      style="width: 100%">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          {{scope.row.add_time | dataFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" circle></el-button>
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      goodsData: [], // 商品列表的数据
      pagenum: 1, // 当前页
      pagesize: 10, // 每页的条数
      total: 0, // 总条数
      query: '' // 搜索内容
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsData () {
      // 发送ajax请求
      const res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      const {data, meta} = res.data
      console.log(data, meta)
      if (meta.status === 200) {
        this.goodsData = data.goods
        this.total = data.total
      }
    },
    // 每页条数改变时
    handleSizeChange (val) {
      this.pagenum = 1
      this.pagesize = val
      this.getGoodsData()
    },
    // 页码改变时
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodsData()
    },
    // 自定义编号
    indexMethod (index) {
      return (this.pagenum - 1) * this.pagesize + 1 + index
    }
  },
  created () {
    this.getGoodsData()
  }
}
</script>
<style>
.el-breadcrumb{
  font-size: 20px
}
.el-button{
  margin: 10px 0
}
</style>
