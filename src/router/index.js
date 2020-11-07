//配置路由的JS
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Admin from '../components/admin/Admin.vue'
// import Rights from '../components/power/Rights.vue'
import Cate from '../components/cate/Cate.vue'
import CateSec from '../components/cateSec/CateSec.vue'
import Product from '../components/product/Product.vue'
import Add from '../components/product/Add.vue'
import Edit from '../components/product/Edit.vue'
import Order from '../components/order/Order.vue'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/admin', component: Admin },
      { path: '/cate', component: Cate },
      { path: '/cateSec', component: CateSec },
      { path: '/product', component: Product },
      { path: '/product/add', component: Add },
      { path: '/product/edit', component: Edit },
      { path: '/order', component: Order },
    ]
  },
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to：将要访问的路径
  //from：代表从哪个路径转跳而来
  //next：是一个函数，表示放行

  if (to.path === '/login') { next() }

  //获取token
  const tokenStr = window.sessionStorage.getItem('token')

  if (!tokenStr) {
    return next('/login')
  }
  next()

})

export default router
