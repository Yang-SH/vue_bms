<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 gutter间隔 -->

      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.key" clearable @clear="getProductList">
            <el-button slot="append" icon="el-icon-search" @click="getProductList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <!-- <el-button type="primary" @click="addDialogVisible = true">添加</el-button> -->
          <el-button type="primary" @click="goAddPage">添加</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="productlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <!-- <el-table-column label="编号" prop="pid"></el-table-column> -->
        <el-table-column label="商品名称" prop="pname"></el-table-column>
        <!-- <el-table-column label="商品介绍" prop="pdesc"></el-table-column> -->
        <el-table-column label="价格(元)" prop="shop_price"></el-table-column>
        <el-table-column label="折扣" prop="discount"></el-table-column>
        <!-- <el-table-column label="是否热点" prop="is_hot ? 1 : 0"></el-table-column> -->
        <el-table-column label="是否热点">
          <template slot-scope="scope">
            <!-- <el-switch v-model="scope.row.is_hot"></el-switch> -->
            <span v-show="scope.row.is_hot">是</span>
            <span v-show="!scope.row.is_hot">否</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="二级分类" prop="csid"></el-table-column> -->

        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="goEditPage(scope.row.pid)"
            ></el-button>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.pid)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取商品列表的参数对象
      queryInfo: {
        key: '',
        //当前的页数
        page: 1,
        //当前每页显示多少条数据
        rows: 10,
      },

      //商品数组
      productlist: [],
      //数据总数
      total: 0,
      //控制添加商品对话框的显示与隐藏
      // addDialogVisible: false,

      //添加商品的表单数据
      addForm: {
        pname: '',
        shop_price: '',
        pdesc: '',
        is_hot: '',
        csid: '',
      },
      //添加表单的验证规则对象
      addFormRules: {
        pname: [
          { required: true, message: '请输入商品名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '商品名的长度在2~10个字符之间',
            trigger: 'blur',
          },
        ],
        pdesc: [
          { required: true, message: '请输入商品名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '商品名的长度在2~10个字符之间',
            trigger: 'blur',
          },
        ],
      },
      //控制修改商品对话框的显示与隐藏
      editDialogVisible: false,
      //查询到的商品信息对象
      editForm: {
        pname: '',
        shop_price: '',
        pdesc: '',
        is_hot: '',
        csid: '',
      },

      //修改页面的校验
      editFormRules: {
        pname: [
          { required: true, message: '请输入商品名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '商品名的长度在2~10个字符之间',
            trigger: 'blur',
          },
        ],
        pdesc: [
          { required: true, message: '请输入商品名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '商品名的长度在2~10个字符之间',
            trigger: 'blur',
          },
        ],
      },
      cateSecList: [],
    }
  },
  created() {
    this.getProductList()
    this.getCateSecList()
  },
  methods: {
    async getProductList() {
      console.log('Admin getProductList')
      var { data: res } = await this.$http.get('/shop/product/page', {
        params: this.queryInfo,
      })
      if (res.code !== 200) {
        //失败
        return this.$message.error('获取商品列表失败！')
      }
      this.productlist = res.data.items
      this.total = res.data.total
      console.log(res)
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
      console.log(this.cateList)
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      //更新当前显示行数
      this.queryInfo.rows = newSize
      //重新获取数据
      this.getProductList()
    },
    //监听 页面值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.page = newPage
      this.getProductList()
    },
    //转跳到商品添加页面
    goAddPage() {
      this.$router.push('/product/add')
    },
    goEditPage(pid) {
      this.$router.push({ path: '/product/edit', query: { pid: pid } })
    },
    //根据ID删除对应的商品信息
    async removeUserById(id) {
      //弹框询问商品是否确认删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          //确认

          const { data: res } = await this.$http.delete(`/shop/product/${id}`)
          if (res.code !== 200) {
            return this.$message.error('删除商品失败！')
          }

          this.$message({
            type: 'success',
            message: '删除商品成功!',
          })
          this.getProductList()
        })
        .catch(() => {
          //取消
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })

      //如果商品确认删除，则返回值为字符串“confirm”
      //如果商品取消删除，则返回值为字符串“cancel”
      console.log(confirmResult)
      // if (confirmResult !== 'confirm') {
      //   return this.$message.info('已取消删除')
      // }
      // this.$message.success('确认删除')
    },
  },
}
</script>

<style lang="less" scoped>
</style>