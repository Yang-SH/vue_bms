<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>一级分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>一级分类列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->

      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.key" clearable @clear="getCateList">
            <el-button slot="append" icon="el-icon-search" @click="getCateList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
        </el-col>
      </el-row>

      <!-- 一级分类列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="编号" prop="cid"></el-table-column>
        <el-table-column label="分类名称" prop="cname"></el-table-column>

        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.cid)"
            ></el-button>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeCateById(scope.row.cid)"
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

    <!-- 添加一级分类的对话框 -->
    <el-dialog title="添加一级分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主题区域 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <!-- 一级分类名 -->
        <el-form-item label="一级分类名" prop="cname">
          <el-input v-model="addForm.cname"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改一级分类的对话框 -->
    <el-dialog title="修改一级分类" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
        <el-form-item label="名称" prop="cname">
          <el-input v-model="editForm.cname"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取一级分类列表的参数对象
      queryInfo: {
        key: '',
        //当前的页数
        page: 1,
        //当前每页显示多少条数据
        rows: 10,
      },

      //一级分类数组
      userlist: [],
      //数据总数
      total: 0,
      //控制添加一级分类对话框的显示与隐藏
      addDialogVisible: false,

      //添加一级分类的表单数据
      addForm: {
        cname: '',
      },
      //添加表单的验证规则对象
      addFormRules: {
        cname: [
          { required: true, message: '请输入一级分类名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '一级分类名的长度在2~10个字符之间',
            trigger: 'blur',
          },
        ],
      },
      //控制修改一级分类对话框的显示与隐藏
      editDialogVisible: false,
      //查询到的一级分类信息对象
      editForm: {
        cname: '',
      },
      //查询出被修改的对象
      // editObj: {},
      //修改页面的校验
      editFormRules: {
        cname: [
          { required: true, message: '请输入一级分类名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '一级分类名的长度在2~10个字符之间',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      console.log('Admin getCateList')
      var { data: res } = await this.$http.get('/shop/cate/page', {
        params: this.queryInfo,
      })
      if (res.code !== 200) {
        //失败
        return this.$message.error('获取一级分类列表失败！')
      }
      this.userlist = res.data.items
      this.total = res.data.total
      console.log(res)
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      //更新当前显示行数
      this.queryInfo.rows = newSize
      //重新获取数据
      this.getCateList()
    },
    //监听 页面值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.page = newPage
      this.getCateList()
    },

    //监听添加一级分类对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，添加新一级分类
    addCate() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) {
          return
        }
        //可以发起添加一级分类的网络请求
        const { data: res } = await this.$http.post('/shop/cate', this.addForm)
        if (res.code != 200) {
          this.$message.error('添加一级分类失败！')
        }
        this.$message.success('添加一级分类成功！')
        //隐藏添加一级分类的对话框
        this.addDialogVisible = false
        //重新获取一级分类列表数据
        this.getCateList()
      })
    },
    //展示一级分类编辑的对话框
    async showEditDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get(`/shop/cate/${id}`)

      if (res.code !== 200) {
        return this.$message.error('查询一级分类信息失败')
      }
      // this.editObj = res.data
      this.editForm = res.data
      // console.log(this.editObj)
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    //监听编辑一级分类对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改一级分类信息并提交
    editCateInfo() {
      //this.$refs.editFormRef.validate方法会校验字段是否正确
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) {
          return
        }

        // this.editObj.password = this.editForm.password
        //可以发起添加一级分类的网络请求
        const { data: res } = await this.$http.put(
          `/shop/cate`,this.editForm
        )

        if (res.code != 200) {
          this.$message.error('更新一级分类信息失败！')
        }
        //隐藏编辑一级分类的对话框
        this.editDialogVisible = false
        //重新获取一级分类列表数据
        this.getCateList()
        this.$message.success('更新一级分类信息成功！')
      })
    },
    //根据ID删除对应的一级分类信息
    async removeCateById(id) {
      //弹框询问一级分类是否确认删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          //确认

          const { data: res } = await this.$http.delete(`/shop/cate/${id}`)
          if (res.code !== 200) {
            return this.$message.error('删除分类失败！')
          }

          this.$message({
            type: 'success',
            message: '删除分类成功!',
          })
          this.getCateList()
        })
        .catch(() => {
          //取消
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })

      //如果一级分类确认删除，则返回值为字符串“confirm”
      //如果一级分类取消删除，则返回值为字符串“cancel”
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