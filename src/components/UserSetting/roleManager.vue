<template>
  <el-container style="padding: 20px">
    <el-header class="table-header" style="padding: 0;">
      <p class="table-h-title">
        筛选及功能项
      </p>
      <div style="margin-top: 20px;margin-left: 15px;width: 50%;display: inline-block">
        <el-button size="small" v-if="permission.indexOf('ADD')>=0" @click="addAndEdit('add')"
                   style="margin-right: 10px;"><i class="icon wb-plus"
                                                  style="margin-right: 5px;"></i>新增角色
        </el-button>
      </div>
    </el-header>
    <el-main class="table-main">
      <div style="height: 550px;">
        <table class="person-list" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed">
          <thead>
          <tr>

            <th>角色名称</th>
            <th>角色说明</th>
            <th width="15%">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="role in roleList">
            <td>{{role.roleName}}</td>
            <td>{{role.roleDescription}}</td>
            <td>
              <el-tooltip effect="dark" content="编辑" placement="top">
                <span title="编辑" v-if="permission.indexOf('EDIT')>=0" @click="addAndEdit('edit',role)"><i
                  class="icon wb-pencil"></i></span>
              </el-tooltip>
              <el-tooltip effect="dark" content="分配人员" placement="top">
                <span title="分配人员" v-if="permission.indexOf('DISTRIBUTIONSTAFF')>=0" @click="deliverPeople(role)"><i
                  class="icon wb-user-add"
                  style="font-size: 20px;"></i></span>
              </el-tooltip>
              <el-tooltip effect="dark" content="分配权限" placement="top">
                <span title="分配权限" v-if="permission.indexOf('ASSIGNPERMISSIONS')>=0" @click="gotoRight(role)"><i
                  class="icon wb-bookmark"></i></span>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <span title="删除" v-if="permission.indexOf('DELETE')>=0" @click="handleDelete(role)"><i
                  class="icon wb-trash"></i></span>
              </el-tooltip>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!--<div class="footer clearfix" style="margin-top: 100px;">-->
        <!--<div style="position: fixed;bottom: 0;width: 86%;">-->
          <!--<div class="fl" style="margin-left: 17px;">共{{total}}项</div>-->
          <!--<div id="paging" class="fr" style="padding:0 20px 20px 0"></div>-->
        <!--</div>-->
        <!--&lt;!&ndash;<div class="fl" style="margin-left: 8px;">共{{total}}项</div>&ndash;&gt;-->
        <!--&lt;!&ndash;<div id="paging" class="fr" style="padding:0 20px 20px 0"></div>&ndash;&gt;-->
      <!--</div>-->

    </el-main>
    <el-footer style="background-color: #ffffff;padding-top: 20px;height: calc(58vh)">
      <div class="footer clearfix">
        <div>
          <div class="fl" style="margin-left: 17px;">共{{total}}项</div>
          <div id="paging" class="fr" style="padding:0 20px 20px 0"></div>
        </div>
      </div>
    </el-footer>

    <el-dialog class="dialogPop" :before-close="clearInfo" :visible.sync="dialogAdd" width="25%">
      <div slot="title" class="dialog-title">
        {{title}}
      </div>
      <div class="pop-col" style="width: 50%;">
        <p>角色名称</p>
        <div class="dialogPop-input">
          <input type="text" v-model="form.roleName"/>
        </div>
      </div>
      <div class="pop-col" style="display: block;width: 95%;">
        <p>角色描述</p>
        <div class="dialogPop-input roleText">
										<textarea maxlength="150" @focus="inputFocus"
                              @blur="inputBlur"
                              @input="addScroll($event)" v-model="form.roleDesc"></textarea>
          <span class="text-limite">{{form.roleDesc.length}}/150</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-right: 9%;">
        <el-button type="success" size="medium" @click="submitForm('pop-form')">提 交</el-button>
        <el-button type="info" size="medium" @click="clearInfo('pop-form')">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog class="dialogPop-deliver" :visible.sync="dialogDeliver" width="30%">
      <div slot="title" class="dialog-title">
        分配人员{{roleName}}

      </div>
      <template>
        <el-transfer
          filterable
          :filter-method="filterMethod"
          :titles="['全部人员', '已选人员']"
          filter-placeholder="按姓名搜索"
          v-model="value2"
          @change="changeDeliver"
          :data="data2">
        </el-transfer>
      </template>
      <div slot="footer" class="dialog-footer" style="margin-right: 2%;">
        <el-button type="success" size="medium" @click="submitForm('pop-deliver')">提 交</el-button>
        <el-button type="info" size="medium" @click="clearInfo('pop-deliver')">取 消</el-button>
      </div>

    </el-dialog>


  </el-container>
</template>
<script>
  import {
    getAllRoles,
    addRole,
    getPersonByRoleId,
    deliverPersonByRoleId,
    deleteRole
  } from '../../../src/API/roleManager'
  import {getAllPerson} from '../../../src/API/personManager'

  import {loginOut} from '../../../src/API/login'

  export default {
    name: 'RoleManager',
    data() {
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
        pageSize: 15,
        CurrentPage: 1,
        totalPage: 0,
        total: 0,
        headers: {
          'Authorization': 'token',
        },
        data2: [],
        value2: [],
        backValue: [], //回显的人员数据
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1;
        },
        roles: ["管理员", "队长", "组长"],
        roleList: [],
        delId: [],
        roleId: null,
        roleName: "",
        title: "新增角色",
        formLabelWidth: '120px',
        dialogAdd: false,
        dialogDeliver: false,
        form: {
          roleId: null,
          roleName: "",
          roleDesc: ""
        }
      }
    },
    created() {

    },
    mounted() {

      this.getAllRoles()
    },
    methods: {
      gotoRight(data) {
//        this.$route.push({
//          path:'../Settingg',
//          params:{status:1}
//        });
        this.$router.push({
          path: '../Settingg/RightsManager',
          query: {
            status: 1,
            name: data.roleName
          }
        });
      },
//      分页
      createPage() {
        $("#paging").CreatePage({
          pageCount: this.totalPage,//总页数
          current: this.CurrentPage,//当前页码
          backFn: function (page) {
            this.CurrentPage = page
            //page:点击时返回的点击的页码，拿到该页码过后执行翻页的逻辑操作
          }
        });
      },
//      获得所有角色
      async getAllRoles() {
        let self = this;
        let result = {
          pageSize: self.pageSize,
          CurrentPage: self.CurrentPage,
          queryName: ''
        };
        let data = await getAllRoles(result).then((e) => {
          if (e.status === 200) {
            self.roleList = e.data.items;
            self.currentPage = e.data.currentPage;
            self.pageSize = e.data.pageSize;
            self.total = e.data.totalNum;
            self.totalPage = e.data.totalPage
            if (JSON.parse(sessionStorage.getItem('permission')) === null) {
            }else{
              self.permission = JSON.parse(sessionStorage.getItem('permission'))
            }
            self.createPage()

          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!",
              duration: 2000
            });
            this.LoginOut()

          }
        }).catch(() => {
        });
      },

//      获取角色详细
      async getRoleDetail(queryName) {
        let self = this;
        let result = {
          queryName: queryName
        };
        let data = await getAllRoles(result).then((e) => {
          if (e.status === 200) {
            self.form.roleId = e.data.items[0].roleId;
            self.form.roleName = e.data.items[0].roleName;
            self.form.roleDesc = e.data.items[0].roleDescription
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!",
              duration: 2000
            });
          }
        }).catch(() => {
        });
      },

      //      退出
      async LoginOut() {
        let self = this;
        let result;
        let parse = {
          token: sessionStorage.getItem('token')
        };
        let data = await loginOut(result, parse).then((e) => {
          if (e.status === 200) {
            self.$router.push({
              path: "/"
            });
            sessionStorage.clear()
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!",
              duration: 2000
            });
          }
        }).catch(() => {
        });
      },

//      分配人员
      deliverPeople(role) {
        this.roleId = role.roleId;
        this.roleName = '（' + role.roleName + '）'
        this.getPersonByRoleId(role.roleId)
        this.getAllPeople();

      },

//      获取所有已经分配人员
      async getPersonByRoleId(roleId) {
        let self = this;
//        self.getAllPeople()
        self.dialogDeliver = true;
        let result;
        let parse = {
          roleId: roleId
        };
        let data = await getPersonByRoleId(result, parse).then((e) => {
          if (e.status === 200) {
            let newArray = []
            for (let i = 0; i < e.data.length; i++) {
              newArray.push(e.data[i].id)
            }
            self.backValue = newArray;
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!",
              duration: 2000
            });
          }
        }).catch(() => {
        });
      },

      changeDeliver(data, direction, movedKeys) {
        if (direction === 'left') {
          for (let i in movedKeys) {
            for (let j in this.backValue) {
              if (movedKeys[i] === this.backValue[j]) {
                this.delId.push(movedKeys[i])
                break;
              }
            }
          }
        } else {
        }
      },

//      获取所有可分配人员
      async getAllPeople() {
        let self = this;
        let result = {
          pageSize: 10000,
          currentPage: 1,
        };
        let data = await getAllPerson(result).then((e) => {
          if (e.status === 200) {
            let newArray = []
            for (let i = 0; i < e.data.items.length; i++) {
              newArray.push({
                label: e.data.items[i].nickName + '（' + e.data.items[i].userName + '）',
                key: e.data.items[i].id
              })
            }
            self.data2 = newArray

            self.value2 = self.backValue;

          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!",
              duration: 2000
            });
          }
        }).catch(() => {
        });
      },


      inputFocus() {
        $('.roleText').css('border-color', 'rgb(98, 168, 234)')
      },
      inputBlur() {
        $('.roleText').css('border-color', '#dcdfe6')
      },

      addScroll: function (e) {
//        if ($(e.target).context.scrollHeight > 118) {
//          $(e.target).css('overflow-y', 'scroll')
//        } else {
//          $(e.target).css('overflow-y', 'hidden')
//        }
      },
      //下拉框弹出
      popSelect(e) {
        let ul = $(e.currentTarget).siblings('ul')
        if (ul.css('display') === 'none') {
          ul.show()
        } else {
          ul.hide()
        }
      },

      //下拉框选择
      chooseSelect(e, type, data) {
        let self = this;
        let ul = $(e.currentTarget).parent('ul')
        switch (type) {
          case 'department':
            self.department = data;
            break;
          case 'role':
            self.role = data;
            break;
        }
        ul.hide()
      },

      //提交表单
      submitForm(type) {
        if (type === 'pop-deliver') {
          this.submitDeliver()
        } else {
          this.validate()
        }

      },

      //      验证提交
      validate() {
        let regSpace = /^\s+|\s+$/g; //空格
        let regZh = /[^\u4E00-\u9FA5A-Za-z]/g //中文
        let self = this;
        if (self.form.roleName === '') {
          self.$message({
            type: 'error',
            message: "角色名不能为空!",
            duration: 2000
          });
          return
        } else {
          if (regSpace.test(self.form.roleName)) {
            self.$message({
              type: 'error',
              message: "错误的角色名!",
              duration: 2000
            });
            return;
          }
        }
        if (self.form.roleDesc === '') {
          self.$message({
            type: 'error',
            message: "角色描述不能为空!",
            duration: 2000
          });
          return
        } else {
          if (regSpace.test(self.form.roleDesc)) {
            self.$message({
              type: 'error',
              message: "错误的描述字符!",
              duration: 2000
            });
            return;
          }
        }
        self.addRole()
      },

//      添加角色
      async addRole() {
        let self = this;
        let result = {
          roleId: self.form.roleId === null ? null : self.form.roleId,
          roleName: self.form.roleName,
          roleStatus: 'Y',
          roleDescription: self.form.roleDesc,
//          departmentId:JSON.parse(sessionStorage.getItem('hisiManagerUser')).departmentId
        };
        let data = await addRole(JSON.stringify(result)).then((e) => {
          if (e.status === 200) {
            self.$message({
              type: 'success',
              message: "提交成功!",
              duration: 2000
            });
            self.dialogAdd = false;
            self.getAllRoles()
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!",
              duration: 2000
            });
          }
        }).catch(() => {
        });
      },


//      分配人员提交
      async submitDeliver() {
        let self = this;
        let arr = [];
        for (let i = 0; i < self.value2.length; i++) {
          arr.push({
            roleId: self.roleId,
            userId: self.value2[i]
          })
        }
        let temp = []; //一个新的临时数组
        for (let i = 0; i < self.delId.length; i++) {
          if (temp.indexOf(self.delId[i]) === -1) {
            temp.push(self.delId[i]);
          }
        }
        self.delId = temp;
        let parse = {
          roleId: self.roleId
        };
        let result = {
//          userIdList: {
          delList: self.delId,
          userToRoleList: arr
//          }
        };
        let data = await deliverPersonByRoleId(JSON.stringify(result), parse).then((e) => {
          if (e.status === 200) {
            this.dialogDeliver = false;
            this.$message({
              type: 'success',
              message: "分配成功!",
              duration: 2000
            });
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!",
              duration: 2000
            });
            arr = []
          }
        }).catch(() => {
        });
      },

      //清空数据
      clearInfo(type) {
        if (type === 'pop-deliver') {
//          this.data2 = [];
//          this.value2 = [];
          this.dialogDeliver = false
        } else {
          this.form.roleId = null;
          this.form.roleName = '';
          this.form.roleDesc = '';
          this.dialogAdd = false;
        }
      },

      //新增编辑
      addAndEdit(type, data) {
        if (type === 'add') {
          this.title = "新增角色"
          this.form.roleName = '';
          this.form.roleDesc = '';
        } else {
          this.title = "编辑角色"
          this.getRoleDetail(data.roleName)

        }
        this.dialogAdd = true;
      },


      //操作人员
      handleDelete(data) {
        this.$confirm('确定删除' + data.roleName + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRole(data.roleId)
        }).catch(() => {
        });
      },

      async deleteRole(id) {
        let self = this;
        let result;
        let parse = {
          roleId: id
        };
        let data = await deleteRole(result, parse).then((e) => {
          if (e.status === 200) {
            self.$message({
              type: 'success',
              message: "删除成功!",
              duration: 2000
            });
            self.getAllRoles()
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!",
              duration: 2000
            });
          }
        }).catch(() => {
        });
      },


      loseFocus(e) {
//        $(e.currentTarget).parent().siblings('ul').hide()

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

  .table-main {
    height: calc(62vh);
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

  .dialogPop div > input {
    height: 30px;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    outline: none;
    padding-left: 10px;
    cursor: default;
    width: 100%;
    vertical-align: middle;
    color: #606266
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

  .roleText {
    display: block;
    font-family: '微软雅黑';
    height: 120px;
    padding: 5px 10px;
    line-height: 1.5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    font-size: inherit;
    color: #606266;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  }

  .roleText textarea {
    resize: none;
    display: block;
    overflow: hidden;
    font-family: '微软雅黑';
    height: 86px;
    line-height: 1.5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    font-size: inherit;
    color: #606266;
    background-color: #fff;
    background-image: none;
    border: none;
  }

  textarea:focus {
    outline: none
  }

  .roleText:focus {
    outline: none;
    border: 1px solid rgb(98, 168, 234);
  }

  .text-limite {
    position: absolute;
    right: 5px;
    bottom: 5px;
    font-size: 13px;
    color: #666666;
  }

  @media screen and (min-width: 1366px) {

  }
  @media screen and (min-width: 1440px) {

  }
  @media screen and (min-width: 1600px) {

  }
  @media screen and (min-width: 1920px) {

  }


</style>
