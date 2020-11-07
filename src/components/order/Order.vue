<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->

      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.key" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <!-- <el-button type="primary" @click="addDialogVisible = true">添加</el-button> -->
        </el-col>
      </el-row>

      <!-- 一级分类列表区域 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="编号" prop="oid"></el-table-column>
        <el-table-column label="总计" prop="total"></el-table-column>
        <el-table-column label="时间" prop="ordertime"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch> -->
            <span v-show="scope.row.state == 1" class="stateSpan">状态：未支付</span>
            <span v-show="scope.row.state == 2" class="stateSpan">状态：已支付</span>
            <span v-show="scope.row.state == 3" class="stateSpan">状态：已发货</span>
            <span v-show="scope.row.state == 4" class="stateSpan">状态：订单完成</span>
            <span v-show="scope.row.state == 5" class="stateSpan">状态：退货</span>
            <span v-show="scope.row.state == 6" class="stateSpan">状态：收到退货</span>
            <span v-show="scope.row.state == 7" class="stateSpan">状态：退款完成</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button
              type="success"
              v-show="scope.row.state == 2"
              class="button"
              @click="setOrderStats(scope.row.oid,3)"
            >发货</el-button>
            <el-button
              type="primary"
              v-show="scope.row.state == 5"
              class="button"
              @click="setOrderStats(scope.row.oid,6)"
            >收到退货</el-button>
            <el-button
              type="success"
              v-show="scope.row.state == 6"
              class="button"
              @click="setOrderStats(scope.row.oid,7)"
            >退款</el-button>
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
      //获取一级分类列表的参数对象
      queryInfo: {
        key: '',
        //当前的页数
        page: 1,
        //当前每页显示多少条数据
        rows: 10,
      },

      //订单列表
      orderlist: [],
      //数据总数
      total: 0,
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //获取订单列表
    async getOrderList() {
      var { data: res } = await this.$http.get('/shop/order/page', {
        params: this.queryInfo,
      })
      if (res.code !== 200) {
        //失败
        return this.$message.error('获取订单列表失败！')
      }
      this.orderlist = res.data.items
      this.total = res.data.total
      console.log(res)
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      //更新当前显示行数
      this.queryInfo.rows = newSize
      //重新获取数据
      this.getOrderList()
    },
    //监听 页面值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.page = newPage
      this.getOrderList()
    },
    //设置订单状态
    async setOrderStats(oid,stats) {
      const { data: res } = await this.$http.put(`/shop/order/${oid}/state/${stats}`)
      this.getOrderList()
    },
  },
}
</script>

<style lang="less" scoped>
</style>