import Comm from '../components/Common.vue'
// 管理员获得所有菜单

let getAdminMenu = function (data) {
  return Comm.API('/menu/admin', data, 'GET');
}
//根据角色获取所有菜单
let getAllMenu = function (data, parse) {
  return Comm.API('/menu/all/' + parse.roleId, data, 'GET');
}

//通过父级id获得下级菜单 管理员
let getMenuChild = function (data) {
  return Comm.API('/menu/tree', data, 'GET');
}

// 通过id获得下级菜单 用户

let getMenuChildUser = function (data, parse) {
  return Comm.API('/menu/tree/' + parse.roleId, data, 'GET');
}

// 获取菜单一级
let getMenu = function (data, parse) {
  return Comm.API('/menu/parent/' + parse.roleId, data, 'GET');
}

//修改菜单内容
let updataMenu = function (data) {
  return Comm.API('/menu/updateMenu', data, 'POST')
}

// 获得所有操作权限组
let getAllPermission = function (data) {
  return Comm.API('/menu/operation/list', data, 'GET')
}

// 获得菜单页面的权限
let getPagePermission = function (data, parse) {
  return Comm.API('/menu/operation/' + parse.menuId + '/' + parse.roleId, data, 'GET')
}

let getPageInfo = function (data) {
  return Comm.API('/menu/getMenuById', data, 'GET')
}
// 保存菜单

let submitMenu = function (data) {
  return Comm.API('/menu/updateMenu', data, 'POST')
}
let getId = function (data) {
  return Comm.API('/menu/generateMenuId', data, 'GET')
}


// 获取菜单页面上的操作权限
let getRightButton = function (data, parse) {
  return Comm.API('/menu/operation/' + parse.menuId, data, 'GET')
};

// 新增菜单
let addMenu = function (data) {
  return Comm.API('/menu/add', data, 'POST')
};

let deleteMenu = function (data, parse) {
  return Comm.API('/menu/' + parse.id, data, 'DELETE')
};


export {
  getMenuChild,
  updataMenu,
  addMenu,
  getMenu,
  getAllMenu,
  getAllPermission,
  getPagePermission,
  getAdminMenu,
  getPageInfo,
  submitMenu,
  deleteMenu,
  getId, getRightButton, getMenuChildUser
}
