import Comm from '../components/Common.vue'

let login = function (data) {
  return Comm.API('/manage/login', data, 'POST');
}

let loginOut = function (data, parse) {
  return Comm.API('/manage/login/out/'+ parse.token, data, 'GET');
}

let changePsd = function (data,parse) {
  return Comm.API('/user/new/pwd/'+parse.id, data, 'PUT');
}

let roleBack = function (data,parse) {
  return Comm.API('/manage/setRole/'+parse.token+'/'+parse.roleId, data, 'PUT');
}


export {
  login, loginOut,changePsd,roleBack
}

