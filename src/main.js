// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'

//引入字体库
import '../static/font/7-stroke/7-stroke.css'
import '../static/font/font-awesome/font-awesome.css'
import '../static/font/glyphicons/glyphicons.css'
import '../static/font/ionicons/ionicons.css'
import '../static/font/material-design/material-design.css'
import '../static/font/octicons/octicons.css'
import '../static/font/themify/themify.css'
import '../static/font/weather-icons/weather-icons.css'
import '../static/font/web-icons/web-icons.css'

//引入js
import $ from 'jquery'
import '../static/js/yfslPageControl'
import '../static/js/bootstrap'
import '../static/js/popDialogue/popDialogue'

//引入css
import '../static/css/com.css'
import '../static/js/popDialogue/popDialogue.css'

// 引入mockjs
require('./mock.js')
// import '../static/css/bootstrap.css'
import VueDND from 'awe-dnd'
//
Vue.use(VueDND)

Vue.config.productionTip = false
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
