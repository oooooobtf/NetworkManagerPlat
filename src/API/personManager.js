import Comm from '../components/Common.vue'

// 导入
let importPerson = function (data) {
  return Comm.API('/user/importUser', data, 'POST', '', true);
}

// 新增用户
let addPerson = function (data) {
  return Comm.API('/user/add', data, 'POST');
}

// 编辑用户
let updatePerson = function (data) {
  return Comm.API('/user/add', data, 'POST');
}

// 重置密码
let resetPsd = function (data,parse) {
  return Comm.API('/user/pwd/'+parse.userId, data, 'PUT');
}


// 删除人员
let deletePerson = function (data,parse) {
  return Comm.API('/user/'+parse.userId, data, 'DELETE');
}


// 屏蔽人员
let shieldPerson = function (data,parse) {
  return Comm.API('/user/'+parse.userId+'/'+parse.status, data, 'PUT');
}

// 获得所有角色
// let getAllRole =function(data){
//   return Comm.API('/user/getRole',data,'GET');
// }

let getAllPerson = function (data) {
  return Comm.API('/user/users', data, 'GET');
}

// 筛选人员
let selectPerson = function (data) {
  return Comm.API('/user/users', data, 'GET');
}

// 获得所有部门
let getAllDept = function (data) {
  return Comm.API('/user/getAllDept', data, 'GET');
}

// 获得所有角色
let getAllRole = function (data) {
  return Comm.API('/role/list', data, 'GET');
}

let getUserDetail = function (data,parse) {
  return Comm.API('/user/detail/'+parse.id, data, 'GET');
}
// let getAllRole = function (data) {
//   return Comm.API('/user/getAllRole', data, 'GET');
// }


export {
  importPerson, addPerson, resetPsd, getAllRole, selectPerson, getAllDept, getAllPerson, updatePerson,shieldPerson,deletePerson,getUserDetail
}
