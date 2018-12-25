import Vue from 'vue'
import Router from 'vue-router'

// 登录
import Login from '../components/Login/login.vue'

// 人员设置
/*
* 角色管理
* 人员管理
* 权限管理
* 部门管理
* */
import RoleManager from '../components/UserSetting/roleManager.vue'
import PersonManager from '../components/UserSetting/PersonManager.vue'
import RightsManager from '../components/UserSetting/RightsManager.vue'
import DepartmentManager from '../components/UserSetting/DepartmentManager.vue'

// 菜单设置
/*菜单管理*/
import MenuManager from '../components/MenuSetting/MenuManager.vue'


import iframeMode from '../components/iframe.vue'
// 公用的头部和导航
import Setting from '../components/Setting.vue'
import Settingg from '../components/Settingg.vue'

// 1、无权限的页面路由在router中定义。
// 2、有权限的页面路由根据用户的权限在store中生成并存储，动态添加到router中。
// 3、主页（home.vue）从store中读取带权限路由信息，并渲染到页面上。

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path:'/Settingg',
      name:'Settingg',
      // redirect: '/Setting/PersonManager',
      component: Settingg,
      children:[
        {
          path:'RoleManager',
          name:'RoleManager',
          component: RoleManager,
        },
        {
          path:'PersonManager',
          name:'PersonManager',
          component: PersonManager,
        },
        {
          path:'RightsManager',
          name:'RightsManager',
          component: RightsManager,
        },
        {
          path:'DepartmentManager',
          name:'DepartmentManager',
          component: DepartmentManager,
        },
        {
          path:'MenuManager',
          name:'MenuManager',
          component: MenuManager,
        },
        {
          path:'iframeMode',
          name:'iframeMode',
          component: iframeMode,
          meta:{
            keepAlive: false
          }
        }
      ]
    },
    { path:'/Setting',
      name:'Setting',
      // redirect: '/Setting/PersonManager',
      component: Setting

    }
  ]
})
