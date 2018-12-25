import Comm from '../components/Common.vue'

let getAllRole = function (data) {
  return Comm.API('/role/list', data, 'GET');
}

let getSearchRole = function (data) {
  return Comm.API('/role/list', data, 'GET');
}

// 根据角色id获得菜单勾选
let getCheckMenuByRoleId = function (data,parse) {
  return Comm.API('/menu/tree/'+parse.roleId, data, 'GET');
}


// 根据角色id和菜单id获得权限勾选
let getPermissionById = function (data,parse) {
  return Comm.API('/permission/' + parse.roleId + '/' + parse.menuId, data, 'GET');
}

let savePermission = function (data,parse) {
  return Comm.API('/permission/distribution/'+parse.roleId, data, 'PUT');
}

export {
  getAllRole, getSearchRole, getCheckMenuByRoleId, getPermissionById, savePermission
}
