<template>
  <div class="login">
    <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px">
      <img src="../assets/1.jpg" alt="">
      <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const res = await this.axios({
            method: 'post',
            url: 'http://localhost:8888/api/private/v1/login',
            data: this.form
          })
          if (res.data.meta.status === 200) {
            this.$message({
              message: '恭喜你，登录成功',
              type: 'success'
            })
            // 保存token
            localStorage.setItem('myToken', res.data.data.token)
            // 跳转到首页
            this.$router.push('home')
          } else {
            this.$message.error('用户名或者密码错误')
          }
        } else {
          return false
        }
      })
    },
    reset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px 40px;
    border-radius: 20px;
    position: relative;
    img{
      width: 100px;
      height: 100px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: -30%;
      transform: translate(-50%,30%);
    }
  }
}
</style>
