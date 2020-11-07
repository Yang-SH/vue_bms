import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// //导入弹框提示组件
// import { Message } from 'element-ui'

//简化导入
import {
    Button, Form, FormItem, Input,
    Message, Container, Header, Aside, Main, Menu,
    Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card,
    Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,
    Dialog,MessageBox,Tag,Select,Option,Alert,Steps,Step,
    Tabs,TabPane,Cascader,Upload,RadioGroup,RadioButton
} from 'element-ui'

//element-ui是按需导入的所以需要手动导入Form等组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Select)
Vue.use(Option)
Vue.use(Alert)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Cascader)
Vue.use(Upload)
Vue.use(RadioGroup)
Vue.use(RadioButton)

//将弹框组件挂载到VUE对象上
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm