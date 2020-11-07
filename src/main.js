import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式表
import './assets/css/global.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//导入axios，用于发起请求
import axios from 'axios'
import qs from 'qs'
//设置请求根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://127.0.0.1:8081/shop'
axios.interceptors.request.use(config => {

  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  config.headers.token = window.sessionStorage.getItem('token')
  //在最后必须return config
  return config
})

//挂载为全局对象
Vue.prototype.$http = axios
Vue.prototype.$qs = qs;

Vue.config.productionTip = false

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

//注册全局时间格式化
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
