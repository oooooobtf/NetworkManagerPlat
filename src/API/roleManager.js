import Comm from '../components/Common.vue'


// 获取所有角色
let getAllRoles = function (data) {
  return Comm.API('/role/list', data, 'GET');
}

// 新增角色
let addRole = function (data) {
  return Comm.API('/role/add', data, 'POST');
}

// 根据角色id获取用户
let getPersonByRoleId = function (data, parse) {
  return Comm.API('/role/' + parse.roleId + '/user', data, 'GET');
}

// 通过角色id分配用户
let deliverPersonByRoleId = function (data, parse) {
  return Comm.API('/role/' + parse.roleId, data, 'PUT');
}

let getRoleByPeopleId = function (data, parse) {
  return Comm.API('/role/user/' + parse.userId, data, 'GET');
}
// 删除角色
let deleteRole = function (data, parse) {
  return Comm.API('/role/del/' + parse.roleId, data, 'DELETE');
}

export {
  getAllRoles, addRole, getPersonByRoleId, deliverPersonByRoleId, getRoleByPeopleId, deleteRole
}
