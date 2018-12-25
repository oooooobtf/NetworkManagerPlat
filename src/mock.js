// 引入mockjs
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;
// mock一组数据
const productData = function() {
  let Data = [];
  for (let i = 0; i < 10; i++) {
    let data = {
      'nickName': Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
      'userName':Random.id(),

    };
    Data.push(data)
  }

  return {
    data: Data
  }
};

// Mock.mock( url, post/get , 返回的数据)；
// Mock.mock('/user/login', 'post', productData );
// Mock.mock('/user/query', 'post', productData);
// Mock.mock('/user/query', 'post', {
//   "user|1-3": [{   // 随机生成1到3个数组元素
//     'name': '@cname',  // 中文名称
//     'id|+1': 88,    // 属性值自动加 1，初始值为88
//     'age|18-28': 0,   // 18至28以内随机整数, 0只是用来确定类型
//     'birthday': '@date("yyyy-MM-dd")',  // 日期
//     'city': '@city(true)',   // 中国城市
//     'color': '@color',  // 16进制颜色
//     'isMale|1': true,  // 布尔值
//     'isFat|1-2': true,  // true的概率是1/3
//     'brother|1': ['jack', 'jim'], // 随机选取 1 个元素
//     'sister|+1': ['jack', 'jim', 'lily'], // array中顺序选取元素作为结果
//     'friends|2': ['jack', 'jim'] // 重复2次属性值生成一个新数组
//   }]
// });
Mock.mock('/user/query', 'post', {
  "user|1-10": [{   // 随机生成1到3个数组元素
    'userName':'@natural',
    'nickName': '@cname',  // 中文名称
    'mobile|1': /^1[0-9]{10}$/,//电话
    'idCard|1': /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    'id|+1': 88,    // 属性值自动加 1，初始值为88
    'address': '@city',  // 日期
    'departmentName|+1': ['研发部门','设计部门','产品部'],
    'departmentId|+1': '1',
    'roleList|1-3': [{
      'roleId|+1':1,
      'roleName|+1':['管理员','普通用户','超级管理员']
    }] // 重复2次属性值生成一个新数组
  }]
});
