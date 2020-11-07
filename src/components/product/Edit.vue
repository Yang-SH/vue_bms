<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="修改商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品详情"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- Tab栏 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="pname">
              <el-input v-model="editForm.pname"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="shop_price">
              <el-input v-model="editForm.shop_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品折扣" prop="discount">
              <el-input v-model="editForm.discount" type="number"></el-input>
            </el-form-item>

            <el-form-item label="是否热门" prop="is_hot">
              <el-switch v-model="editForm.is_hot" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>

            <el-form-item label="二级分类" prop="csid">
              <el-select v-model="editForm.csid" placeholder="请选择">
                <el-option
                  v-for="item in cateSecList"
                  :key="item.csid"
                  :label="item.csname"
                  :value="item.csid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="1">
            <!-- action: 图片上传的API接口地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              list-type="picture"
              :on-success="handleSuccess"
              :multiple="false"
              :limit="1"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品详情" name="2">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="editForm.pdesc"></quill-editor>
            <!-- 添加商品 -->
            <el-button type="primary" class="btnAdd" @click="editProduct">修改商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="picPreviewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      //要修改的商品id
      pid: '',
      // 步骤条默认激活 与左侧Tab联动
      activeIndex: '0',
      // 添加商品的表单对象
      editForm: {
        pname: '',
        shop_price: 0,
        discount: 0,
        // goods_number: 0,
        is_hot: 0,
        // 商品所属分类
        csid: '',
        // 图片的数组
        image: '',
        // 商品详情描述
        pdesc: '',
        // attrs: [],
      },
      editFormRules: {
        pname: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        shop_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        discount: [
          { required: true, message: '请输入商品折扣', trigger: 'blur' },
        ],
        csid: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
      },
      //二级分类列表
      cateSecList: [],
      // 级联选择器配置

      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 图片上传地址
      uploadURL: '/shop/upload',
      // 图片上传组件的请求对象
      headerObj: {
        token: window.sessionStorage.getItem('token'),
      },
      picPreviewPath: '',
      // 图片预览对话框
      previewDialogVisible: false,
    }
  },
  created() {
    //获取路由传过来的参数
    this.pid = this.$route.query.pid
    console.log(this.pid)
    this.getProduct()
    this.getCateSecList()
  },

  methods: {
    async getProduct() {
      var { data: res } = await this.$http.get(`/shop/product/${this.pid}`)

      if (res.code !== 200) {
        //失败
        return this.$message.error('获取商品信息失败！')
      }
      this.editForm = res.data
      console.log(this.editForm)
    },
    //获取二级分类
    async getCateSecList() {
      var { data: res } = await this.$http.get('/shop/cateSec', {
        params: this.queryInfo,
      })

      if (res.code !== 200) {
        //失败
        return this.$message.error('获取一级分类失败！')
      }
      this.cateSecList = res.data
      console.log(this.cateSecList)
    },

    //监听tabs标签切换
    beforeTabLeave(activeName, odlActiveName) {
      // 未选中商品分类阻止Tab标签跳转
      if (odlActiveName === '0' && this.editForm.csid.length == 0) {
        this.$message.error('请先选择商品分类')
        //阻止标签页切换
        return false
      }
    },
    // 点击图片时触发，处理图片预览
    handlePreview(file) {
      //file：会包含已经上传图片的相关信息，包括访问地址
      console.log(file)
      //设置图片预览的地址
      this.picPreviewPath = file.response.data
      //展示预览框
      this.previewDialogVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      console.log(file)
      //删除图片地址
      this.editForm.image = ''
    },
    // 监听图片上传成功事件
    handleSuccess(response) {
      // 1.拼接得到一个图片信息对象 临时路径
      const picInfo = { pic: response.data }
      // 2.将图片信息对象，放到editForm中
      this.editForm.image = picInfo.pic
    },
    // 添加商品
    editProduct() {
      console.log(this.editForm)
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写必要的表单项！')

        // 发起请求修改商品
        const { data: res } = await this.$http.put(
          '/shop/product',
          this.editForm
        )
        if (res.code !== 200) {
          return this.$message.error('修改商品失败！' + res.msg)
        }
        this.$message.success('修改商品成功!')
        this.$router.push('/product')
      })
    },
  },
}
</script>

<style lang='less' scoped>
.el-checkbox {
  margin: 0 8px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>