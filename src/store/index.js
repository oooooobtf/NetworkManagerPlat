import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  roles:[], //存储用户角色
  router:[]
}

const getters = {
  getRoles: state => state.roles,
  getRouter: state => state.router
}

