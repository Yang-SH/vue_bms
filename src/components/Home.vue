<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <!-- <el-button @click="toggleCollapse" v-show="!isCollapse" type="primary" class="">收起</el-button>
          <el-button @click="toggleCollapse" v-show="isCollapse" type="primary" class="">展开</el-button>-->
          <span v-show="!isCollapse">收起</span>
          <span v-show="isCollapse">展开</span>
        </div> 
        <!-- 侧边栏菜单区域  background-color="#333744" text-color="#fff"-->
        <el-menu
          class="el-menu-vertical-demo"
          active-text-color="#409FFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <!-- index属性可以当作跳转属性 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist: [
        {
          id: '126',
          authName: '管理员用户管理',
          path: null,
          children: [{ id: '126', authName: '管理员列表', path: 'admin' }],
        },
        {
          id: '125',
          authName: '用户管理',
          path: null,
          children: [{ id: '125', authName: '用户列表', path: 'users' }],
        },
        {
          id: '103',
          authName: '一级分类管理',
          path: null,
          children: [{ id: '103', authName: '一级分类列表', path: 'cate' }],
        },
        {
          id: '104',
          authName: '二级分类管理',
          path: null,
          children: [{ id: '103', authName: '二级分类列表', path: 'cateSec' }],
        },
        {
          id: '101',
          authName: '商品管理',
          path: null,
          children: [{ id: '101', authName: '商品列表', path: 'product' }],
        },
        {
          id: '102',
          authName: '订单管理',
          path: null,
          children: [{ id: '102', authName: '订单列表', path: 'order' }],
        },
      ],
      iconsObj: {
        '125': 'iconfont icon-user',
        '126': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '104': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
      //是否折叠
      isCollapse: false,
      //被激活的链接地址
      activePath: '',
      // isCollapse: true
    }
  },
  created() {
    // this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有的菜单
    // async getMenuList() {
    //   const { data: res } = await this.$http.get('menus')
    //   if (res.code !== 200) {
    //     return this.$message.error(res.meta.msg)
    //   }
    //   this.menulist = res.data
    //   console.log(res)
    // },
    //点击按钮，切换菜单的折叠与打开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存当前点击菜单(保存链接的激活状态)
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      //重新赋值
      this.activePath = activePath
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  // background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  // color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  // background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

/*菜单的折叠按钮 */
.toggle-button {
  // background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  // color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>