<template>
  <div class="add">
    <!-- 步骤条的组件 -->
    <el-steps :active="active">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏切换 -->
    <el-tabs tab-position="left" v-model="activeName"  @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="basic">
        <el-form ref="addForm" :model="addForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="options"
              v-model="addForm.goods_cat"
              :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="是否优惠">
            <el-radio v-model="is_promote" label="true">是</el-radio>
            <el-radio v-model="is_promote" label="false">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :on-remove="handleRemove"
          :on-success="handlSuccess"
          :headers="headers"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data () {
    return {
      is_promote: '',
      addForm: { // 添加的数据
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_cat: [],
        goods_number: '',
        goods_introduce: '',
        pics: [],
        attrs: ''
      },
      options: [],
      props: { // 描述商品分类的
        value: 'cat_id',
        label: 'cat_name'
      },
      activeName: 'basic',
      active: 0, // 显示步骤
      headers: {
        Authorization: localStorage.getItem('myToken')
      }
    }
  },
  methods: {
    // 获取商品分类
    async getGoodsCat () {
      // 发送ajax请求
      const res = await this.axios.get('categories?type=3')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.options = data
      }
    },
    // tab栏切换
    handleClick (tab) {
      this.active = tab.index
    },
    // 点击下一步是触发
    next (active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    // 删除图片
    handleRemove (file, fileList) {
      let tmpPath = file.response.data.tmp_path
      let index = this.addForm.pics.findIndex(item => item.pic === tmpPath)
      this.addForm.pics.splice(index, 1)
    },
    // 上传图片成功
    handlSuccess (res, file) {
      if (res.meta.status === 200) {
        this.addForm.pics.push(res.data.tmp_path)
      }
    },
    // 添加商品
    async addGoods () {
      // 发送ajax请求
      const res = await this.axios.post('goods', {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join()
      })
      const {meta} = res.data
      if (meta.status === 201) {
        // 跳转
        this.$router.push('/goods')
        // 提示
        this.$message.success('商品添加成功了')
      }
    }
  },
  created () {
    this.getGoodsCat()
  }
}
</script>
<style>
.quill-editor {
  background-color: #fff;
}
.ql-container {
  min-height: 300px
}
</style>
