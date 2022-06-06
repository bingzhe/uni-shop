import App from './App'
import Util from './static/js/utils.js'
import store from './store/index'
import Vue from 'vue'
import {VueJsonp} from 'vue-jsonp'
Vue.use(VueJsonp)

// if (process.env.NODE_ENV == 'development') { // 开发环境
// 	// #ifdef H5
// 	// 提交前需要注释  本地调试使用
// 	const vconsole = require('vconsole')
// 	Vue.prototype.$vconsole = new vconsole() // 使用vconsole
// 	// #endif
// }

// // #ifdef H5
// // 提交前需要注释  本地调试使用
// const vconsole = require('vconsole')
// Vue.prototype.$vconsole = new vconsole() // 使用vconsole
// // #endif

Vue.config.productionTip = false
Vue.prototype.$util = Util

App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
