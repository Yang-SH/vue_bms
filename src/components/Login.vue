<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt srcset />
      </div>

      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //这是表单的验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //点击重置按钮，重置登录表单
    resetLoginForm() {
      // console.log(this)
      this.username = this.password = ''
      //重置表单方法resetFields
      this.$refs.loginFormRef.resetFields()
    },
    async login() {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) {
          //校验失败直接返回
          return
        }

        // console.log(this.loginForm)
        //如果某个方法返回Promise则可以在方法前面使用await简化返回对象
        //await只能用在async修饰的方法中
        //将返回对象中的data属性赋值给res
        const { data: res } = await this.$http.post('/shop/admin/login', this.loginForm)
        console.log(res)
        if (res.code !== 200) {
          //登录失败
          // return console.log('登录失败')
          this.$message.error('登录失败！'+res.msg)
        } else {
          // console.log('登录成功')
          this.$message.success('登录成功')

          //sessionStorage：会话级的保存机制
          //localStorage：持久的保存机制

          //1.登录成功后的token，保存到客户端的sessionStorage中
          //  1.1项目中除了登录之外的其它API接口，必须在登录之后才能访问
          //  1.2token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
          //2.通过编程式导航跳转到后台主页，路由地址/home

          window.sessionStorage.setItem('token', res.data.token)

          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

/* 登录框样式 */
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  /*头像框样式*/
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    /*添加阴影*/
    box-shadow: 0 0 10px #ddd;

    /*移动*/
    position: absolute;
    /*头像框整体向右移动50%*/
    left: 50%;
    /*头像框自身向左移动-50%*/
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
