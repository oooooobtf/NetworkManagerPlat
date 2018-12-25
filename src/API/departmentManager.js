import Comm from '../components/Common.vue'

// 新增部门
let addDepartment = function (data) {
  return Comm.API('/department/add', data, 'POST');
}

let getId = function (data) {
  return Comm.API('/department/id', data, 'GET');
}

// 删除部门

let delDept = function (data, parse) {
  return Comm.API('/department/' + parse.departmentId, data, 'DELETE');
}
// 为部门分配人员
// let deliverPerson = function (data, parse) {
//   return Comm.API('/department/' + parse.departmentId, data, 'PUT');
// }
// 角色分配人员
let deliverPersonbyRole = function (data) {
  return Comm.API('/department/disposeCus', data, 'POST');
}

// 部门分配人员
// let deliverPersonByDept = function (data, parse) {
//   return Comm.API('/department/' + parse.departmentId, data, 'PUT');
// }
// 部门分配人员
let deliverPersonByDept = function (data,parse) {
  return Comm.API('/department/distribution/'+parse.id, data, 'PUT');
}

// 获得一级部门
let getDepart = function (data,parse) {
  return Comm.API('/department/tree/'+parse.id, data, 'GET');
}

// 获得下级部门
let getNextDepart = function (data,parse) {
  return Comm.API('/department/tree/'+parse.id, data, 'GET');
}

// 通过人员id获得角色
let getRoleByPersonId = function (data,parse) {
  return Comm.API('/role/user/'+parse.roleId, data, 'GET');
}


// 获得所有部门下的人员
let getAllPersonOfDepart = function (data) {
  return Comm.API('/user/users', data, 'GET');
}

// 编辑部门
let updateDeptName = function (data, parse) {
  return Comm.API('/department/updateDeptName?departmentId=' + parse.departmentId + '&departmentName=' + parse.departmentName, data, 'PUT');
}


// 点击部门获得部门下的人员 包括有角色的
let getDeptPerson = function (data){
  return Comm.API('/department/getDeptCusInfo', data, 'GET');
}

// 获取登陆角色的部门和部门关联的角色
let getRoleIDeptInfo = function (data) {
  return Comm.API('/department/getRoleIDeptnfo', data, 'GET');
}


// 根据角色id和部门id获取人员

let getUserByRoleId = function (data, parse) {
  return Comm.API('/department/getUserByDeptIdAndRoleId?roleId=' + parse.roleId+'&departmentId='+parse.departmentId, data, 'GET');
}


export {
  addDepartment, getId, deliverPersonbyRole, deliverPersonByDept,
  getDepart, getAllPersonOfDepart, delDept, updateDeptName,getNextDepart,
  getRoleIDeptInfo,getDeptPerson,getUserByRoleId,getRoleByPersonId
}
