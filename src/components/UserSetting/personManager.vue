<template>
  <el-container style="padding: 20px">
    <el-header class="table-header" style="padding: 0;">
      <p class="table-h-title">
        筛选及功能项
      </p>
      <div class="tool-left">
        <el-button plain size="small" v-if="permission.indexOf('ADD')>=0" @click="addAndEdit('add')"
                   style="margin-right: 10px;"
        >
          <!--v-if="permissionNameList.indexOf('nmp-user-add')>0"-->
          <i class="icon wb-plus" style="margin-right: 5px;"></i>新增
        </el-button>
        <!--<template>-->
        <!--&lt;!&ndash;:on-change="importPerson"&ndash;&gt;-->
        <!--&lt;!&ndash;:auto-upload="false"&ndash;&gt;-->
        <!--<el-upload-->
        <!--class="upload-demo"-->
        <!--:action="uploadUrl"-->
        <!--:headers="headers"-->
        <!--:show-file-list="false"-->
        <!--multiple-->

        <!--:before-upload="beforeUpload"-->
        <!--:on-success="uploadSuccess"-->

        <!--:limit="1"-->
        <!--style="margin-right: 10px;display: inline-block"-->
        <!--&gt;-->
        <!--<el-button plain size="small"><i class="icon wb-download" style="margin-right: 5px;"></i>导入</el-button>-->
        <!--</el-upload>-->
        <!--</template>-->
        <!--<el-button size="small"><i class="icon wb-download" style="margin-right: 5px;"></i>导入</el-button>-->
        <!--<el-button plain size="small"><i class="icon wb-upload" style="margin-right: 5px;"></i>下载模板</el-button>-->
        <!--<el-button plain size="small" @click="dialogDeliver=true"><i class="icon wb-list"-->
        <!--style="margin-right: 5px;"></i>分配字段-->
        <!--</el-button>-->
      </div>
      <div class="tool-right">
        <!--下拉框-->
        <!--<div class="select-container">-->
        <!--<span style="margin-right: 5px;">部门</span>-->
        <!--<div style="display: inline-block" @click="popSelect($event)">-->
        <!--<input type="text" v-model="department" readonly unselectable="on" placeholder="全部"-->
        <!--@blur="loseFocus($event)">-->
        <!--<i class="icon wb-triangle-down select-icon1"></i>-->
        <!--</div>-->
        <!--<ul class="pop-select depart" style="margin-left: 38px;overflow-y: scroll">-->
        <!--<li @click="chooseSelect($event,'department')">全部</li>-->
        <!--<li @click="chooseSelect($event,'department',department)" v-for="department in departments">-->
        <!--{{department.departmentName}}-->
        <!--</li>-->

        <!--</ul>-->
        <!--</div>-->

        <!--<div class="select-container">-->
        <!--<span style="margin-right: 5px;">角色名</span>-->
        <!--<div style="display: inline-block" @click="popSelect($event)">-->
        <!--<input type="text" v-model="role" readonly unselectable="on" placeholder="全部" @blur="loseFocus($event)">-->
        <!--<i class="icon wb-triangle-down select-icon1"></i>-->
        <!--</div>-->
        <!--<ul class="pop-select role" style="margin-left: 52px;overflow-y: scroll">-->
        <!--<li @click="chooseSelect($event,'role')">全部</li>-->
        <!--<li @click="chooseSelect($event,'role',role)" v-for="role in roles">{{role.roleName}}</li>-->
        <!--</ul>-->
        <!--</div>-->

        <div class="search-input">
          <div style="display: inline-block" v-if="permission.indexOf('SELECT')>=0">
            <input type="text" v-model="conditions" placeholder="按账号、姓名、电话查询" @keyup.enter="selectPerson()">
            <i class="icon wb-search search-icon" @click="selectPerson"></i>
          </div>
        </div>


      </div>
    </el-header>
    <el-main class="table-main">
      <div style="height: 550px;">
        <table class="person-list" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed">
          <thead>
          <tr>
            <!--<tr v-if="fileds.length>0">-->
            <!--<th v-for="filed in fileds">{{filed.name}}</th>-->
            <th>账号</th>
            <th>姓名</th>
            <th>电话</th>
            <th>部门</th>
            <th width="20%">角色</th>
            <th width="15%">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in personList">
            <!--<tr v-if="fileds.length>0" v-for="item in personList">-->
            <!--<td v-for="key in fileds">-->
            <!--&lt;!&ndash;<td v-for="key in Object.keys(item)">&ndash;&gt;-->
            <!--<template>-->
            <!--<template v-if="key.key=='roleName'">-->
            <!--<template v-for="(name,index) in item.roleList">-->
            <!--{{name.roleName}}<i style="font-style: normal;" v-if="index!==item.roleList.length-1">,</i>-->
            <!--</template>-->
            <!--</template>-->
            <!--<template v-else>-->
            <!--{{item[key.key]}}-->
            <!--</template>-->
            <!--</template>-->
            <!--</td>-->
            <td>{{item.userName}}</td>
            <td>{{item.nickName}}</td>
            <td>{{item.mobile}}</td>
            <td>{{item.departmentName}}</td>
            <td>
              {{item.roleName}}
              <!--<template v-for="(name,index) in item.roleList">-->
              <!--&lt;!&ndash;<el-tooltip placement="top">&ndash;&gt;-->
              <!--&lt;!&ndash;<div slot="content">&ndash;&gt;-->
              <!--{{name.roleName}}<i style="font-style: normal;" v-if="index!==item.roleList.length-1">,</i>-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-tooltip>&ndash;&gt;-->
              <!--</template>-->
            </td>
            <td width="15%">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <span title="编辑" v-if="permission.indexOf('EDIT')>=0" @click="addAndEdit('edit',item)"><i
                  class="icon wb-pencil"></i></span>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top" :disabled="disabled">
                <span title="删除" v-if="permission.indexOf('DELETE')>=0" @click="handlePeople('delete',item)"><i
                  class=" icon wb-trash"></i></span>
              </el-tooltip>
              <template v-if="item.userStatus=='Y'">
                <el-tooltip class="item" effect="dark" content="屏蔽" placement="top" :disabled="disabled">
                  <span title="屏蔽" v-if="permission.indexOf('SHIELDINGPERSONNEL')>=0"
                        @click="handlePeople('shield',item)"><i class="icon wb-eye-close"></i></span>
                </el-tooltip>
              </template>
              <template v-else>
                <el-tooltip class="item" effect="dark" content="解除屏蔽" placement="top" :disabled="disabled">
                  <span title="解除屏蔽" v-if="permission.indexOf('SHIELDINGPERSONNEL')>=0"
                        @click="handlePeople('allow',item)"><i class="icon wb-eye"></i></span>
                </el-tooltip>
              </template>
              <el-tooltip class="item" effect="dark" content="重置密码" placement="top" :disabled="disabled">
                <span title="重置密码" v-if="permission.indexOf('RESETPWD')>=0" @click="handlePeople('reset',item)"><i
                  class="icon wb-unlock"></i></span>
              </el-tooltip>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </el-main>
    <el-footer style="background-color: #ffffff;padding-top: 20px;height: calc(58vh)">
      <div class="footer clearfix">
        <div>
          <div class="fl" style="margin-left: 17px;">共{{total}}项</div>
          <div id="paging" class="fr" style="padding:0 20px 20px 0"></div>
        </div>
      </div>
    </el-footer>

    <el-dialog class="dialogPop" :before-close="clearInfo" :visible.sync="dialogAdd" width="37%">
      <div slot="title" class="dialog-title">
        {{title}}
      </div>
      <!--<template v-for="field in fileds">-->
      <!--<template v-for="people in diaPersonList">-->
      <!--<template v-if="field.type==='text'">-->
      <!--<div class="pop-col">-->
      <!--<p>{{field.name}}</p>-->
      <!--<div class="dialogPop-input">-->
      <!--<input type="text" v-model="people[field.key]"/>-->
      <!--</div>-->
      <!--</div>-->
      <!--</template>-->
      <!--<template v-if="field.type==='select'">-->
      <!--<div class="pop-col">-->
      <!--<div class="select-container">-->
      <!--<p>{{field.name}}</p>-->
      <!--<div class="dialogPop-input" @click="popSelect($event)">-->
      <!--<input type="text" readonly unselectable="on" :placeholder="'请选择'+field.name"-->
      <!--@blur="loseFocus($event)"-->
      <!--v-model="people[field.key]">-->
      <!--<i class="icon wb-triangle-down select-icon"></i>-->
      <!--</div>-->
      <!--<ul class="pop-select">-->
      <!--<li v-if="field.name==='部门'" @click="chooseSelect($event,'popDepartment',department)"-->
      <!--v-for="department in departments">-->
      <!--{{department.departmentName}}-->
      <!--</li>-->
      <!--<li v-else class="select-dropdown" :data-id="role.roleId"-->
      <!--@click="chooseSelect($event,'popRole',role,index)"-->
      <!--v-for="(role,index) in roles">-->
      <!--<span>{{role.roleName}}</span>-->
      <!--<i class="icon wb-check" style="float: right;display: none"></i>-->
      <!--</li>-->
      <!--</ul>-->
      <!--</div>-->
      <!--</div>-->
      <!--</template>-->
      <!--<template v-if="field.type==='selectTag'">-->
      <!--<div class="pop-col">-->
      <!--<div class="select-container">-->
      <!--<p>角色</p>-->
      <!--<div class="dialogPop-input" @click="TagPopSelect($event)">-->
      <!--<div class="select-tag-container" aria-readonly="true" tabindex="0" @blur.stop="loseSelect">-->
      <!--<span class="select-tag" v-for="tag in selectTag">-->
      <!--<span style="margin-right: 2px;">{{tag.name}}</span><i class="icon wb-close-mini"-->
      <!--@click.stop="delectTag(tag)"></i>-->
      <!--</span>-->
      <!--</div>-->
      <!--<i class="icon wb-triangle-down select-icon"></i>-->
      <!--</div>-->
      <!--<ul class="pop-select">-->
      <!--<li class="select-dropdown" :data-id="role.roleId" @click="chooseSelect($event,'popRole',role,index)"-->
      <!--v-for="(role,index) in roles">-->
      <!--<span>{{role.roleName}}</span>-->
      <!--<i class="icon wb-check" style="float: right;display: none"></i>-->
      <!--</li>-->
      <!--</ul>-->
      <!--</div>-->
      <!--</div>-->
      <!--</template>-->
      <!--</template>-->
      <!--</template>-->

      <div class="pop-col">
        <p>账号</p>
        <div class="dialogPop-input">
          <input type="text" v-if="isEdit===true" readonly style="cursor: not-allowed" v-model="form.account"/>
          <input type="text" v-model="form.account" maxlength="11" v-else/>
        </div>
      </div>
      <div class="pop-col">
        <p>姓名</p>
        <div class="dialogPop-input">
          <input type="text" v-model="form.name"/>
        </div>
      </div>
      <div class="pop-col">
        <p>电话</p>
        <div class="dialogPop-input">
          <input type="text" v-model="form.tel" maxlength="11"/>
        </div>
      </div>
      <div class="pop-col">
        <div class="select-container">
          <p>部门</p>
          <div class="dialogPop-input" @click="popSelect($event)">
            <input type="text" readonly unselectable="on" placeholder="请选择部门" @blur="loseFocus($event)"
                   v-model="form.popDepart">
            <i class="icon wb-triangle-down select-icon"></i>
          </div>
          <ul class="pop-select">
            <li @click="chooseSelect($event,'popDepartment',department)" v-for="department in departments">
              {{department.departmentName}}
            </li>
          </ul>
        </div>
      </div>
      <div class="pop-col">
        <div class="select-container">
          <p>角色</p>
          <div class="dialogPop-input" @click="TagPopSelect($event)">
            <div class="select-tag-container" aria-readonly="true" tabindex="0" @blur.stop="loseSelect">
      <span class="select-tag" v-for="tag in selectTag">
      <span style="margin-right: 2px;">{{tag.name}}</span><i class="icon wb-close-mini"
                                                             @click.stop="delectTag(tag)"></i>
      </span>
            </div>
            <i class="icon wb-triangle-down select-icon"></i>
          </div>
          <ul class="pop-select">
            <li class="select-dropdown" :data-id="role.roleId" @click="chooseSelect($event,'popRole',role,index)"
                v-for="(role,index) in roles">
              <span>{{role.roleName}}</span>
              <i class="icon wb-check" style="float: right;display: none"></i>
            </li>
          </ul>
        </div>
      </div>

      <div slot="footer" class="dialog-footer" style="margin-right: 9%;">
        <el-button type="success" size="medium" @click="validate()">提 交</el-button>
        <el-button type="info" size="medium" @click="clearInfo('pop-form')">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog class="dialogPop-deliver" :visible.sync="dialogDeliver" width="30%">
      <div slot="title" class="dialog-title">
        分配字段
      </div>
      <template>
        <el-transfer
          filterable
          :filter-method="filterMethod"
          :titles="['全部字段', '已选字段']"
          filter-placeholder="请输入字段名"
          v-model="value2"
          :data="data2">
        </el-transfer>
      </template>
      <div slot="footer" class="dialog-footer" style="margin-right: 9%;">
        <el-button type="success" size="medium" @click="submitForm('pop-deliver')">提 交</el-button>
        <el-button type="info" size="medium" @click="clearInfo('pop-deliver')">取 消</el-button>
      </div>

    </el-dialog>


  </el-container>
</template>
<script>
  import {
    importPerson,
    getAllRole,
    resetPsd,
    addPerson,
    selectPerson,
    getAllDept,
    getAllPerson,
    updatePerson,
    shieldPerson,
    deletePerson,
    getUserDetail
  } from '../../../src/API/personManager'
  import {getDepart} from '../../../src/API/departmentManager'
  import Comm from '../../components/Common.vue'


  export default {
    name: 'PersonManager',
    data() {
      const generateData2 = _ => {
        const data = [];
        const cities = ['账号', '姓名', '电话', '部门', '角色', 'ID卡号', '身份证号', '邮箱', '地址'];
        cities.forEach((city, index) => {
          data.push({
            label: city,
            key: index,
          });
        });
        return data;
      };
      return {
        permission: JSON.parse(sessionStorage.getItem('permission')) === null ?
          [
            'ADD',
            'SELECT',
            'CHECK',
            'PAGE',
            'SELECT',
            'CHECK',
            'ADD',
            'EDIT',
            'DELETE',
            'DISTRIBUTIONSTAFF',
            'ASSIGNPERMISSIONS',
            'FILTER',
            'RESETPWD',
            'SHIELDINGPERSONNEL'
          ] : JSON.parse(sessionStorage.getItem('permission')),
        disabled: false,
        headers: {
          'Authorization': sessionStorage.getItem('token'),
        },
        uploadUrl: Comm.URL + "/user/importUser",
        data2: generateData2(),
        value2: [
          1, 2, 3
        ],
//        fileds: [],

        fileds: [{
          name: '账号',
          key: 'userName',
          type: 'text'
        }, {
          name: '姓名',
          key: 'nickName',
          type: 'text'
        }, {
          name: '电话',
          key: 'mobile',
          type: 'text'
        }, {
          name: '身份证号',
          key: 'idCard',
          type: 'text'
        },
          {
            name: '部门',
            key: 'departmentName',
            type: 'select'
          }, {
            name: '角色',
            key: 'roleName',
            type: 'selectTag'
          }, {
            name: '地址',
            key: 'address',
            type: 'text'
          }],
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1;
        },
        roles: [{
          roleId: 1,
          roleName: "管理员"
        }, {
          roleId: 2,
          roleName: "普通用户"
        }],
        departments: [
          {
            departmentId: "1",
            departmentName: "研发部"
          },
          {
            departmentId: "2",
            departmentName: "设计部"
          }
        ],
        title: "新增人员",
        formLabelWidth: '120px',
        dialogAdd: false,
        dialogDeliver: false,
        role: "",
        roleId: "",
        departmentId: "",
        department: "",
        conditions: "",
        person: {},
        personList: [
//          {
//            userName: "123",
//            nickName: "测试",
//            mobile: "1234567899",
//            idCard: "500234199802211236",
//            departmentName: "研发部",
//            roleName: "普通用户",
//            roleList: [{
//              roleId: 1,
//              roleName: "管理员"
//            }, {
//              roleId: 2,
//              roleName: "普通用户"
//            }],
//            address: "重庆市沙坪坝区"
//          }
        ],
        //分配字段里获取到的弹框字段
        diaPersonList: [{
          userName: "",
          nickName: "",
          mobile: "",
          idCard: "",
          departmentName: "",
          roleName: ""
        }],
        form: {
          id: "",
          name: "",
          tel: "",
          account: "",
          popDepart: "",
          popDepartId: "",
          popRole: ""
        },
        isEdit: false,
        selectTag: [],
        delectRoleId: [],
        backRoleId: [],
        pageSize: 15,
        currentPage: 1,
        totalPage: 0,
        total: 0,
        permissionNameList: (sessionStorage.getItem('permissionNameList'))
      }
    },
    created() {

    },
    mounted() {
      let self = this;
      self.getAllRole()
//      self.getdata()
      self.getAllPerson();
      self.getAllDepart()
    },
    methods: {
      getdata() {
        let self = this;
        Comm.mockdata('/user/query', '', 'POST').then(res => {
          self.personList = JSON.parse(res).user
        })

      },


//      筛选人员
      async selectPerson() {
        let self = this;
        let result = {
          queryName: this.conditions,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
        };
        let data = await selectPerson(result).then((e) => {
          if (e.status === 200 && e.data !== null) {
            this.personList = e.data.items
            this.total = e.data.totalNum
            this.pageSize = e.data.pageSize;
            this.currentPage = e.data.currentPage
            this.totalPage = e.data.totalPage
            if (JSON.parse(sessionStorage.getItem('permission')) === null) {
            } else {
              self.permission = JSON.parse(sessionStorage.getItem('permission'))
            }
          } else {
            this.personList = []
            this.total = 0
            this.currentPage = 1
            this.totalPage = 0
          }
        }).catch(() => {
        });
      },


//      关闭前清空
      clearInfo() {
        this.form.name = '';
        this.form.tel = '';
        this.form.account = '';
        this.form.popDepart = '';
        this.form.popRole = '';
        this.selectTag = [];
        this.form.id = '';
        this.dialogAdd = false;
      },

//      验证提交
      validate() {
        let regSpace = /^\s+|\s+$/g; //空格
        let regZh = /[^\u4E00-\u9FA5A-Za-z]/g //中文
        let regNum = /[^0-9-]/g //数字
        let self = this;
        if (self.form.account === '') {
          self.$message({
            type: 'error',
            message: "账号不能为空！",
            duration: 2000
          });
          return
        } else {
          if (regSpace.test(self.form.account)) {
            self.$message({
              type: 'error',
              message: "错误的账号！",
              duration: 2000
            });
            return
          }
        }

        if (self.form.name === '') {
          self.$message({
            type: 'error',
            message: "姓名不能为空！",
            duration: 2000
          });
          return
        } else {
          if (regSpace.test(self.form.name) || regZh.test(self.form.name)) {
            self.$message({
              type: 'error',
              message: "错误的名字！",
              duration: 2000
            });
            return
          }
        }

        if (self.form.tel === '') {
          self.$message({
            type: 'error',
            message: "电话不能为空！",
            duration: 2000
          });
          return
        } else {
          if (regSpace.test(self.form.tel) || regNum.test(self.form.tel)) {
            self.$message({
              type: 'error',
              message: "错误的电话！",
              duration: 2000
            });
            return
          }
        }
        if (self.form.popDepart === '') {
          self.$message({
            type: 'error',
            message: "部门不能为空！",
            duration: 2000
          });
          return
        }
        if (self.selectTag.length === 0) {
          self.$message({
            type: 'error',
            message: "角色不能为空！",
            duration: 2000
          });
          return
        }
        if (self.isEdit === true) {
          self.updatePerson()
        } else {
          self.addPerson()
        }

      },

//      分页
      creatPage() {
        let self = this;
        $("#paging").CreatePage({
          pageCount: self.totalPage,//总页数
          current: self.currentPage,//当前页码
          backFn: function (page) {
            self.currentPage = page
            self.getAllPerson();
            //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
          }
        });
      },

      getHandle(type, data) {
        let self = this;
        switch (type) {
          case 'reset':
            self.resetPsd(data);
            break;
          case 'shield':
            self.shieldPerson(data, 'N');
            break;
          case 'allow':
            self.shieldPerson(data, 'Y');
            break;
          case 'delete':
            self.deletePerson(data);
            break;
        }
      },

//      获取所有部门
      async getAllDepart() {
        let self = this;
        let result;
        let parse = {
          id: 0
        };
        let data = await getDepart(result, parse).then((e) => {
          if (e.status === 200) {
            self.departments = e.data.departmentList
          } else {

          }
        }).catch(() => {
        });
      },

//      屏蔽人员
      async shieldPerson(value, status) {
        let self = this;
        let result;
        let parse = {
          userId: value.id,
          status: status
        };
        let data = await shieldPerson(result, parse).then((e) => {
          if (e.status === 200) {
            self.$message({
              type: 'success',
              message: '操作成功!'
            });
            self.getAllPerson();
          } else {
          }
          self.disabled = true;
          setTimeout(function () {
            self.disabled = false;
          }, 300)
        }).catch(() => {
        });
      },

//      删除人员
      async deletePerson(value) {
        let self = this;
        let result;
        let parse = {
          userId: value.id
        };
        let data = await deletePerson(result, parse).then((e) => {
          if (e.status === 200) {
            self.$message({
              type: 'success',
              message: '操作成功!'
            });
            self.getAllPerson();

          } else {
            self.disabled = true;
            setTimeout(function () {
              self.disabled = false;
            }, 100)

          }
        }).catch(() => {
        });
      },


//      获得人员列表
      async getAllPerson() {
        let self = this;
        let result = {
          pageSize: self.pageSize,
          currentPage: self.currentPage,
        };
        let data = await getAllPerson(result).then((e) => {
          if (e.status === 200) {
            this.personList = e.data.items
            this.total = e.data.totalNum
            this.pageSize = e.data.pageSize;
            this.currentPage = e.data.currentPage
            this.totalPage = e.data.totalPage
            if (JSON.parse(sessionStorage.getItem('permission')) === null) {
            } else {
              self.permission = JSON.parse(sessionStorage.getItem('permission'))
            }
            self.creatPage()
          } else {

          }
        }).catch(() => {
        });
      },


      // 添加人员
      async addPerson() {
        let self = this;
        let arr = [];
        for (let i = 0; i < self.selectTag.length; i++) {
          arr.push(self.selectTag[i].id)
        }
        let result = {
          delRoleIdList: [],
          departmentId: self.form.popDepartId,
          nickName: self.form.name,
          mobile: self.form.tel,
          userName: self.form.account,
          roleIdList: arr,
          userStatus: "on",
        };
        let data = await addPerson(JSON.stringify(result)).then((e) => {
          if (e.status === 200) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            });
            this.dialogAdd = false;
            self.getAllPerson()
          } else {

            this.$message({
              type: 'error',
              message: e.msg + '!'
            });
          }
        }).catch(() => {
        });
      },

      // 编辑提交人员
      async updatePerson() {
        let self = this;
        let arr = [];
        let name = []
        for (let i = 0; i < self.selectTag.length; i++) {
          arr.push(self.selectTag[i].id
//            {
//            departmentId: self.form.popDepartId,
//            roleId: self.selectTag[i].id,
//            roleName: self.selectTag[i].name,
//            roleStatus: 'on'
//          }
          )
          name.push(self.selectTag[i].name)
        }
        let temp = []; //一个新的临时数组
        for (let i = 0; i < self.delectRoleId.length; i++) {
          if (temp.indexOf(self.delectRoleId[i]) === -1) {
            temp.push(self.delectRoleId[i]);
          }
        }
        self.delectRoleId = temp;

        let result = {
          id: self.form.id,
          delRoleIdList: self.delectRoleId,
          departmentId: self.form.popDepartId,
          departmentName: self.form.popDepart,
          nickName: self.form.name,
          mobile: self.form.tel,
          userName: self.form.account,
          roleName: name.join(','),
          roleIdList: arr,
          userStatus: "Y",
        };
        let data = await updatePerson(JSON.stringify(result)).then((e) => {
          if (e.status === 200) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            });
            this.dialogAdd = false;
            self.getAllPerson()
          } else {

            this.$message({
              type: 'error',
              message: e.msg + '!'
            });
          }
        }).catch(() => {
        });
      },


      //重置密码
      async resetPsd(value) {
        let self = this;
        let result;
        let parse = {
          userId: value.id
        }
        let data = await resetPsd(result, parse).then((e) => {
          if (e.status === 200) {
            this.$message({
              type: 'success',
              message: '重置密码成功!'
            });
          } else {
            this.$message({
              type: 'success',
              message: e.msg + '!'
            });
            self.disabled = true;
            setTimeout(function () {
              self.disabled = false;
            }, 100)
          }
        }).catch(() => {

        });
      },

//      导入人员
      async importPerson(file) {
        let self = this;
        let formData = new FormData()
        formData.append('file', file.raw)
        let data = await importPerson(formData).then((e) => {
          if (e.status === 200) {

          } else {
            self.$message({
              type: 'error',
              message: e.msg + "!",
              duration: 2000
            });
          }
        }).catch(() => {
        });
      },

//      获得所有角色
      async getAllRole() {
        let self = this;
        let result;
        let data = await getAllRole(result).then((e) => {
          if (e.status === 200) {
            let newArray = [];
            for (let i in e.data.items) {
              newArray.push({
                roleId: e.data.items[i].roleId,
                roleName: e.data.items[i].roleName
              })
            }
            self.roles = newArray;
          } else {

          }
        }).catch(() => {
        });
      },

//      导入前验证
      beforeUpload(file) {
        let Xls = file.name.split('.');
        if (Xls[1] === 'xls' || Xls[1] === 'xlsx') {
          return file
        } else {
          this.$message.error('上传文件只能是 xls/xlsx 格式!')
          return false
        }

      },
      uploadSuccess(response, file, fileList) {
        if (response.status === 200) {
          this.$message({
            type: 'success',
            message: '导入成功!'
          });
          this.getAllPerson()
        } else {
          this.$message({
            type: 'error',
            message: e.msg + '!'
          });
        }
      },

//      部门标签下拉框弹出
      popSelect(e) {

        let ul = $(e.currentTarget).siblings('ul')
        if (ul.css('display') === 'none') {
          let width = $(e.currentTarget).find('input').get(0).offsetWidth - 1;
          ul.css('width', width + 'px')
          ul.show()
        } else {
          ul.hide()
        }
      },

      TagPopSelect(e) {
        $('.select-tag-container').css('border', '1px solid #62a8ea')
        let ul = $(e.currentTarget).siblings('ul')
        $('.select-dropdown').removeClass('select')
        $('.select-dropdown').find('i').hide()
        if (ul.css('display') === 'none') {
          if (this.selectTag.length > 0) {
            for (let i = 0; i < this.selectTag.length; i++) {
              for (let j = 0; j < $('.select-dropdown').length; j++) {
                if ($('.select-dropdown').eq(j).attr('data-id') == this.selectTag[i].id) {
                  $('.select-dropdown').eq(j).addClass('select');
                  $('.select-dropdown').eq(j).find('i').show()
                  break;
                }
              }
            }
          }

          ul.show()
        } else {
          ul.hide()
        }
      },

//      删除角色标签
      delectTag(data) {
        for (let i = 0; i < $('.select-dropdown').length; i++) {
          if ($('.select-dropdown').eq(i).attr('data-id') == data.id) {
            $('.select-dropdown').eq(i).removeClass('select');
            $('.select-dropdown').eq(i).find('i').hide()
          }
        }
        for (let i = 0; i < this.selectTag.length; i++) {
          if (this.selectTag[i].id === data.id) {
            this.selectTag.splice(i, 1)
          }
        }
        for (let j = 0; j < this.backRoleId.length; j++) {
          if (data.id === this.backRoleId[j]) {
            this.delectRoleId.push(data.id)
          }
        }
      },

//      下拉框选择
      chooseSelect(e, type, data, index) {
        let self = this;
        let ul = $(e.currentTarget).parent('ul')
        switch (type) {
          case 'department':
            if (data === undefined) {
              self.department = '全部';
              self.departmentId = ''
              self.selectPerson();
            } else {
              self.department = data.departmentName;
              self.departmentId = data.departmentId
              self.selectPerson()
            }

            ul.hide()
            break;
          case 'role':
            if (data === undefined) {
              self.role = '全部';
              self.roleId = ''
              self.selectPerson();
            } else {
              self.role = data.roleName;
              self.roleId = data.roleId
              self.selectPerson()
            }

            ul.hide()
            break;
          case 'popDepartment':
            self.form.popDepart = data.departmentName;
            self.form.popDepartId = data.departmentId;
            ul.hide();
            break;
          case 'popRole':
            if ($(e.target).hasClass('select')) {
              $(e.target).removeClass('select')
              $(e.target).find('i').hide()
              for (let i = 0; i < this.selectTag.length; i++) {
                if (this.selectTag[i].id === data.roleId) {
                  this.selectTag.splice(i, 1)
                }
              }
              for (let j = 0; j < this.backRoleId.length; j++) {
                if (data.roleId === this.backRoleId[j]) {
                  this.delectRoleId.push(data.roleId)
                }
              }
//              this.delectRoleId.push(data.roleId)
            } else {
              $(e.target).addClass('select')
              $(e.target).find('i').show()
              this.selectTag.push({
                id: data.roleId,
                name: data.roleName
              })
            }
            break;
        }

      },

//      提交表单
      submitForm(type) {

//        this.addPerson()
      },

//    清空数据
      clearInfo(type) {
        if (type === 'pop-deliver') {
//          this.data2 = [];
//          this.value2 = [];
          this.dialogDeliver = false
        } else {
          this.dialogAdd = false;
        }
      },


      async getUserDetail(Data) {
        let self = this;
        if (Data.userName == JSON.parse(sessionStorage.getItem('hisiManagerUser')).userName) {
          self.dialogAdd = false;
          self.$message({
            type: 'error',
            message: '不能编辑自己的信息!'
          });
          return;
        } else {

        }
        let result;
        let parse = {
          id: Data.id
        };
        let data = await getUserDetail(result, parse).then((e) => {
          if (e.status === 200) {
            self.dialogAdd = true;
            self.form.id = e.data.id;
            self.form.name = e.data.nickName;
            self.form.tel = e.data.mobile;
            self.form.account = e.data.userName;
            self.form.popDepart = e.data.departmentName;
            self.form.popDepartId = e.data.departmentId;
            self.selectTag = [];
            if (e.data.roleList) {
              for (let i = 0; i < e.data.roleList.length; i++) {
                self.selectTag.push({
//                  index: '',
                  id: e.data.roleList[i].roleId,
                  name: e.data.roleList[i].roleName
                })
                self.backRoleId.push(e.data.roleList[i].roleId)
              }
            }
          } else {
            self.$message({
              type: 'error',
              message: e.msg + '!'
            });

          }
        }).catch(() => {
        });
      },

//    新增编辑
      addAndEdit(type, data) {

        if (type === 'add') {
          this.dialogAdd = true;
          this.title = "新增人员"
//          for (let i = 0; i < this.fileds.length; i++) {
//            this.diaPersonList[0][this.fileds[i].key] = '';
//          }
          this.form.name = '';
          this.form.id = '';
          this.form.tel = '';
          this.form.account = '';
          this.form.popDepart = '';
          this.form.popRole = '';
          this.selectTag = []
          this.isEdit = false;
        } else {



//          $('input').props('cursor', 'not-allowed')
//          attr('contenteditable', 'false')
          this.isEdit = true;
          this.title = "编辑人员";
          this.delectRoleId = [];
//          for (let i = 0; i < this.fileds.length; i++) {
//            this.diaPersonList[0][this.fileds[i].key] = data[this.fileds[i].key];
//          }
          this.getUserDetail(data)

        }

      },


//    操作人员
      handlePeople(type, data) {
        let str = '';
        let self = this;

        switch (type) {
          case 'delete':
            str = '删除';
            break;
          case 'shield':
            str = '屏蔽';
            break;
          case 'allow':
            str = '解除屏蔽';
            break;
          case 'reset':
            str = '重置';
            break;
        }

        if (data.userName == JSON.parse(sessionStorage.getItem('hisiManagerUser')).userName) {
          self.$message({
            type: 'error',
            message: '不能' + str + '自己!'
          });
          return;
        }

        self.$confirm('确定' + str + data.nickName + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          self.getHandle(type, data)

        }).catch(() => {
          self.disabled = true;
          setTimeout(function () {
            self.disabled = false;
          }, 100)
        });
      },

//      下拉框失去焦点清空样式
      loseFocus(e) {
        setTimeout(function () {
          $(e.target).parents('.select-container').find('ul').hide()
        }, 150)
      },

//      角色标签下拉失去焦点
      loseSelect() {
        $('.select-tag-container').css('border', '1px solid #dcdfe6')
        setTimeout(function () {
          $('.select-tag-container').parent().siblings('ul').hide()
        }, 150)
      }
    }
  }


</script>
<style scoped>
  .table-header {
    margin-bottom: 12px;
    background: #fff;
    border-radius: 3px;
    border-top: 5px solid #e7eaec;
    min-height: 120px;
  }

  .table-h-title {
    padding: 10px 15px;
    font-weight: bold;
    color: #666;
    border-bottom: 1px solid #E8EDEF;

  }

  .tool-left {
    margin-top: 20px;
    margin-left: 15px;
    /*width: 50%;*/
    width: 400px;
    display: inline-block;
  }

  .tool-right {
    display: inline-block;
    margin-top: 20px;
    /*width: 770px;*/
    float: right;
  }

  /*搜索框*/
  .search-input {
    position: relative;
    display: inline-block;
    margin-right: 20px;
    float: right;
  }

  .search-input .search-icon {
    position: absolute;
    right: 9px;
    top: 9px;
    color: #606266;
  }

  .search-input div > input {
    height: 30px;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    outline: none;
    padding-left: 10px;
    cursor: default;
    width: 250px;
  }

  /*下拉*/
  .select-container {
    position: relative;
    display: inline-block;
    margin-right: 30px;
  }

  .select-container .select-icon1 {
    position: absolute;
    right: 9px;
    top: 9px;
    color: #606266;
  }

  .select-container div > input {
    height: 30px;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    outline: none;
    padding-left: 10px;
    cursor: default;
    width: 150px;
    vertical-align: middle
  }

  .select-container div > input:focus, .search-input div > input:focus {
    border: 1px solid #62a8ea;
    transition: all 0.5s;
  }

  .select-container .pop-select {
    z-index: 10;
    overflow-y: scroll;
    display: none;
    max-height: 170px;
    /*overflow-y: scroll;*/
    position: absolute;
    list-style: none;
    margin: 0;
    padding: 0;
    margin-top: 4px;
    width: 159px;
    border-radius: 3px;
    background-color: #FFFFFF;
    transition: all .3s;
    border: 1px solid #E8EDEF
  }

  .select-container .pop-select li {
    padding: 10px;
  }

  .select-container .pop-select li:hover {
    background-color: #f3f7f9;
  }

  .pop-col div > .pop-select {
    width: 100%;
    margin-left: 0;
  }

  .pop-col div > .select-icon {
    top: 9px;
    position: absolute;
    right: 9px;
    color: #606266;
  }

  .table-main {
    height: calc(62vh);
    /*height: calc(100vh - 60px);*/
    /*min-height: 680px;*/
    border-top: 5px solid #e7eaec;
    background: #fff;
    padding: 0;
    overflow: auto;

  }

  table > thead > tr > th, table > tbody > tr > td {
    /*padding: 10px;*/
  }

  table.person-list {
    width: 100%;

  }

  table.person-list tr {
    height: 37px;
    line-height: 36px;
  }

  table.person-list th {

    border-bottom: 1px solid #e7eaec;
  }

  table.person-list th,
  table.person-list td {
    padding-left: 16px;
    text-align: left;
    border-right: 1px solid #e7eaec;
    border-bottom: 1px solid #e7eaec;
    font-size: 14px;
  }

  table.person-list tr > th:last-child,
  table.person-list tr > td:last-child {
    border-right: none;
  }

  table.person-list th {
    color: #3f494f;
    font-weight: normal;
  }

  table.person-list td {
    color: #76838f;
    width: 1px;
    white-space: nowrap;
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 16px;
  }

  table.person-list td > span {
    cursor: pointer;
    margin-right: 12px;
    outline: none;
  }

  table.person-list td.operation > span {
    display: inline-block;
    margin-right: 3%;
    cursor: pointer;
  }

  .pop-col div > input {
    height: 30px;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    outline: none;
    padding-left: 10px;
    cursor: default;
    width: 100%;
    vertical-align: middle;
    color: #606266;
  }

  .dialogPop .dialogPop-input {
    margin-top: 8px;
    vertical-align: middle;
    position: relative;
  }

  .pop-col {
    display: inline-block;
    width: 40%;
    margin-right: 4%;
    margin-left: 3%;
    margin-bottom: 15px;
  }

  .select-dropdown.select {
    color: #409eff;
  }

  .select-tag {
    border-color: transparent;
    margin: 2px 0 2px 6px;
    background-color: #f0f2f5;
    height: 24px;
    line-height: 24px;
    vertical-align: -webkit-baseline-middle;;
    color: #909399;
    padding: 2px 5px;
    border-radius: 3px;
    display: inline-block;
  }

  .select-tag-container {
    min-height: 26px;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    outline: none;
    padding-left: 10px;
    padding-right: 20px;
    cursor: default;
    width: 230px;
    padding-bottom: 2px;
    padding-top: 2px;
    vertical-align: middle;
    display: inline-block;

  }

  .select-tag > i:hover {
    color: #333333;
    cursor: pointer;
  }

  /*@media (max-width: 1920px) {*/
  /*.table-header {*/
  /*height: 60px !important;*/
  /*}*/

  /*.tool-right > .search-input {*/
  /*display: inline-block;*/
  /*!*float: right;*!*/
  /*margin-top: 0;*/
  /*!*margin-right: 53px;*!*/

  /*}*/

  /*.tool-right {*/
  /*width: 800px;*/
  /*clear: both;*/
  /*margin-top: 20px;*/
  /*margin-left: 0;*/
  /*}*/

  /*}*/

  /*@media (max-width: 1660px) {*/
  /*.tool-right {*/
  /*width: 500px;*/
  /*clear: both;*/
  /*margin-top: 20px;*/
  /*margin-left: 0;*/
  /*}*/

  /*.tool-right > .search-input {*/
  /*display: block;*/
  /*float: right;*/
  /*margin-top: 10px;*/
  /*margin-right: 53px;*/

  /*}*/

  /*.table-header {*/
  /*height: 150px !important;*/
  /*}*/

  /*}*/

  /*@media (max-width: 1366px) {*/
  /*.tool-right {*/
  /*width: 500px;*/
  /*clear: both;*/
  /*margin-top: 20px;*/
  /*margin-left: 0;*/
  /*}*/

  /*.tool-right > .search-input {*/
  /*display: block;*/
  /*float: right;*/
  /*margin-top: 10px;*/
  /*margin-right: 53px;*/

  /*}*/

  /*.table-header {*/
  /*height: 150px !important;*/
  /*}*/

  /*}*/

  /*@media (max-width: 1200px) {*/
  /*.tool-right {*/
  /*float: left;*/
  /*margin-left: 15px;*/
  /*margin-top: 10px;*/
  /*width: 800px;*/
  /*}*/

  /*.tool-right > .search-input {*/
  /*display: inline-block;*/
  /*!*float: right;*!*/
  /*margin-top: 0;*/
  /*margin-right: 53px;*/

  /*}*/

  /*.table-header {*/
  /*height: 150px !important;*/
  /*}*/

  /*}*/


</style>
