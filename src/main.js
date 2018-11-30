import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
//import './assets/theme/theme-darkblue/index.css'
//import './assets/theme/theme-red/index.css'
import './assets/theme/theme-blue/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
//import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

import { Message } from 'element-ui'
import BaiduMap from 'vue-baidu-map';
import { pca, pcaa } from 'area-data'; // v5 or higher
import 'vue-area-linkage/dist/index.css'; // v2 or higher
import VueAreaLinkage from 'vue-area-linkage';
Vue.use(VueAreaLinkage)
export default function elementComponent () {
  Vue.prototype.$message = Message
}
Vue.use(BaiduMap, { ak: 'teVMbZgoCb4Q5rK1e9PiINETHPtTEjBt' });
Vue.use(require('vue-moment')); 

Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes
})

// router.beforeEach((to, from, next) => {
//   //NProgress.start();
//   if (to.path == '/login') {
//     sessionStorage.removeItem('user');
//   }
//   let user = JSON.parse(sessionStorage.getItem('user'));
//   if (!user && to.path != '/login'&& to.path !='/indexPage') {
//     next({ path: '/login' })
//   } else {
//     next()
//   }
// })

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

