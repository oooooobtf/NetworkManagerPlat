<template>
  <el-container style="padding: 20px;">
    <el-main>
      <div style="width: 40%;" class="depart-main">
        <div class="depart-main-title">
          部门信息
          <span style="float: right;color: #62a8ea;cursor: pointer;font-weight: normal" @click="addDepart(1)" v-if="permission.indexOf('ADD')>=0">
            <span class="addept-icon"><i
              class="icon wb-plus"></i> </span>新增同级部门</span>
        </div>

        <el-scrollbar height="100%">
          <template>
            <!--:props="props1"-->
            <!--lazy-->
            <!--:load="loadNode"-->
            <el-tree
              ref="tree"
              :data="data5"
              default-expand-all
              :highlight-current="true"
              :expand-on-click-node="true"
              @node-click="handleNodeClick"
              class="menu-tree"
              style="padding-top: 20px;"
              node-key="id2"
              draggable
            >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span style="padding-left: 5px;">
          <i class="el-tree-node__loading-icon el-icon-loading tree-loading" style="display: none"></i>
          {{ node.label }}
        </span>
        <span class="addChild-icon" style="display: none">
          <el-tooltip effect="dark" content="添加子级部门" placement="top" offset="0">
              <el-button
                style="margin-right:10px;"
                type="text"
                size="mini"
                v-if="permission.indexOf('ADD')>=0"
                @click.stop="addDepart(2)"
              >
                 <!--@click="openAddMenuDialog(2)"-->
              <i class="icon wb-plus"></i>
              </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="编辑部门" placement="top" offset="0">
              <el-button
                style="margin-right: 10px;"
                type="text"
                size="mini"
                v-if="permission.indexOf('EDIT')>=0"
                @click.stop="editDepartment()"
              >
                 <!--@click="openAddMenuDialog(2)"-->
              <i class="icon wb-edit"></i>
              </el-button>
          </el-tooltip>
          <el-tooltip effect="dark" :disabled="tooltipShow" content="删除部门" placement="top" offset="0">
              <el-button
                style="margin-right: 10px;"
                type="text"
                size="mini"
                v-if="permission.indexOf('DELETE')>=0"
                @click.stop="deleteMenu()"
              >
                 <!--@click="openAddMenuDialog(2)"-->
              <i class="icon wb-close"></i>
              </el-button>
          </el-tooltip>
          <!--<el-button-->
          <!--type="text"-->
          <!--size="mini"-->
          <!--@click="() => remove(node, data)">-->
          <!--<i class="icon fa-trash-o"></i>-->
          <!--</el-button>-->
        </span>
      </span>
            </el-tree>

          </template>
        </el-scrollbar>
        <!--<div style="position: absolute;padding-right: 20px;bottom: 20px;right: 0;">-->
        <!--<el-button size="small" @click="submitInfo()">保存</el-button>-->
        <!--</div>-->
      </div>

      <div style="width: 37%;" class="depart-setting">
        <div class="depart-setting-title">
          <span>人员信息</span>
          <span class="deliver-btn" v-if="permission.indexOf('DISTRIBUTIONSTAFF')>=0" @click="popDeliver">分配人员</span>
        </div>
        <table class="team-table" style="width: 100%;padding: 10px 10px 0 10px;table-layout: fixed;" cellspacing="0"
               cellpadding="0"
               border="0">
          <thead>
          <tr>
            <th style="color: #a3afb7;">账号</th>
            <th style="color: #a3afb7;">姓名</th>
            <th style="color: #a3afb7;">电话</th>
          </tr>
          </thead>
        </table>
        <el-scrollbar height="100%">
          <table class="team-table" style="width: 100%;padding:0 10px;table-layout: fixed" cellspacing="0"
                 cellpadding="0"
                 border="0">
            <!--<thead>-->
            <!--<tr>-->
            <!--<th>账号</th>-->
            <!--<th>姓名</th>-->
            <!--<th>电话</th>-->
            <!--</tr>-->
            <!--</thead>-->
            <tbody>
            <tr v-if="person" v-for="person in personList" v-cloak @click="showRoleList($event,person)">
              <td>{{person.userName}}</td>
              <td>{{person.nickName}}</td>
              <td>{{person.mobile}}</td>
            </tr>
            </tbody>
          </table>
        </el-scrollbar>

      </div>
      <div class="menu-center" style="width: 20%;display: inline-block" v-show="isRoleListShow">
        <div
          style="border-bottom: 1px solid #e4eaec;padding: 10px 24px;font-weight: bold;color: #666666;font-size: 14px;">
          角色信息
        </div>
        <div class="center-group">
          <div v-for="(role,index) in roleList" class="group-item"
          >
            {{role.roleName}}
            <!--<i class="icon wb-close group-item-icon"-->
            <!--@click="deleteRole(role.roleId)"></i>-->
          </div>
        </div>
      </div>
    </el-main>

    <el-dialog class="dialogPop-deliver" :before-close="clearInfo" :visible.sync="dialogDeliver" width="30%">
      <div slot="title" class="dialog-title">
        分配人员
      </div>
      <template>
        <el-transfer
          filterable
          :filter-method="filterMethod"
          :titles="['全部人员', '已选人员']"
          filter-placeholder="请输入人员名字"
          v-model="value2"
          :data="data2">
        </el-transfer>
      </template>
      <div slot="footer" class="dialog-footer" style="margin-right: 9%;">
        <el-button type="success" size="medium" @click="dialogDeliverPost">提 交</el-button>
        <el-button type="info" size="medium" @click="clearInfo">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAddVisible" width="30%" :before-close="addDialogClose">
      <div slot="title" class="dialog-title">
        {{dialogTitle}}
      </div>
      <el-form>
        <el-form-item label="部门名称">
          <el-input auto-complete="off" v-model="departmentName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogClose">取 消</el-button>
        <el-button type="primary" @click="submitInfo(0)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditVisible" width="30%" :before-close="editDialogClose">
      <div slot="title" class="dialog-title">
        编辑部门
      </div>
      <el-form>
        <el-form-item label="部门名称">
          <el-input auto-complete="off" v-model="departmentName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogClose">取 消</el-button>
        <el-button type="primary" @click="submitInfo(1)">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
  import Vue from 'vue';
  import {
    addDepartment,
    getId,
    deliverPersonbyRole,
    deliverPersonByDept,
    getDepart, getNextDepart,
    getAllPersonOfDepart,
    delDept,
    updateDeptName,
    getDeptPerson, getRoleIDeptInfo, getUserByRoleId, getRoleByPersonId
  } from '../../../src/API/departmentManager'
  import {getSearchRole} from '../../../src/API/rightsManager'
  import {getAllRole} from '../../../src/API/personManager'

  let mainEl;
  export default {
    name: 'DepartmentManager',
    data() {
      return {
        permission: JSON.parse(sessionStorage.getItem('permission'))===null?
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
          ]:JSON.parse(sessionStorage.getItem('permission')),
        data5: [{
          id: 1,
          label: "研发部",
          departmentParentId: "0",
          departmentLevel: "1",
          children: []
        }],
        num: 0,
        hasRole: false,
        data2: [],
        value2: [],
        backValue: [],
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1;
        },
        departmentName: "",
        dialogAddVisible: false,
        dialogDeliver: false,
        dialogEditVisible: false,
        tooltipShow: false,
        dialogTitle: "新增部门",
        delList: [],
        personList: [],
        departmentList: [],
        info: {
          departmentId: "",
          departmentName: "",
          departmentParentId: "",
          departmentLevel: "",
        },
        firstFlag: "",
        firstDeptId: "",
        roleList: [],
        isSettingShow: false,
        isRoleListShow: false,
        updateId: "",
        //点击的属性对象存储
        node: "",
        el: "",
      }
    },
    created() {
      mainEl = this;
    },
    mounted() {
      this.firstFlag = true;
      this.initDragging()
      this.getAllDepart()
      this.getAllPersonOfDepart()

    },
    updated() {
      this.initDragging()
    },
    methods: {
      showRoleList(e, data) {
        $(e.currentTarget).parent().children().removeClass('active')
        $(e.currentTarget).addClass('active')
        this.isRoleListShow = true;
//        this.roleList
        this.getRoleByPersonId(data.id)

      },

      handleNodeClick(data, node, el) {
        this.node = node;
        this.el = el;
        this.updateId = data.id;
        this.info.departmentId = data.id;
        this.info.departmentName = data.label;
        this.info.departmentParentId = data.departmentParentId;
        this.info.departmentLevel = data.departmentLevel;
        $(el.$el).parents().find('.addChild-icon').hide();
        $(el.$el).children('.el-tree-node__content').find('.custom-tree-node>.addChild-icon').show();
        this.isRoleListShow = false;
        this.getNextDepart(node, el)
        if (node.expanded === true) {
          $(el.$el).children('.el-tree-node__content').find('.custom-tree-node>.addChild-icon')
            .siblings().children('.tree-loading').show()
        }
        this.getDepartPerson()
      },

      addDialogClose() {
        this.dialogAddVisible = false;
        this.departmentName = ''
      },

      editDialogClose() {
        this.dialogEditVisible = false;
        this.departmentName = ''
      },

//      编辑部门
      editDepartment() {
        this.dialogEditVisible = true;
        this.departmentName = this.info.departmentName;
//        this.info.departmentId = this.info.departmentName;
      },

      setFocus(el) {
        el = el[0]; // jquery 对象转dom对象
        el.focus();
        let range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        let sel = window.getSelection();
        //判断光标位置，如不需要可删除
        if (sel.anchorOffset !== 0) {
          return;
        }
        sel.removeAllRanges();
        sel.addRange(range);
      },

//      清除信息
      clearInfo() {
        this.data2 = [];
        this.value2 = [];
        this.dialogDeliver = false;
      },

      dialogDeliverPost() {
//        没有角色给部门分配人员，有角色给角色分配人员

        this.dialogDeliverPostDept()
//        this.dialogDeliverPostRole();
        this.dialogDeliver = false;
      },

//      部门分配人员
      async dialogDeliverPostDept() {
        let self = this;
        for (let i in self.value2) {
          for (let j in self.backValue) {
            if (self.backValue[j] === self.value2[i]) {
              self.backValue.splice(j, 1)
              break;
            }
          }
        }

//        let result = {
//          delUserIdList: self.backValue,
//          departmentId: self.info.departmentId,
//          selUserIdList: self.value2
//        };
        let result = {
          userIdList: self.value2,
          delUserIdList: self.backValue
        };
//        let result = self.value2
        let parse = {
          id: self.info.departmentId
        };
        let data = await deliverPersonByDept(JSON.stringify(result), parse).then((e) => {
          if (e.status === 200) {
            this.dialogDeliver = false;
            this.getAllDepart();
//            this.getDeptRoleCusInfo();
          } else {
          }
        }).catch(() => {
        });
      },


      //      获得所有角色
      async getAllRoles() {
        let self = this;
        let result = {};
        let data = await
          getAllRole(result).then((e) => {
            if (e.status === 200) {
              self.roleList = e.data
              self.roleId = self.roleList[0].roleId;
//            self.getPersonByDepartId()
            } else {
            }
          }).catch(() => {
          });
      }
      ,

      //获取所有人员
      async getAllPersonOfDepart() {
        let info;
        let data = await
          getAllPersonOfDepart(info).then((e) => {
            let arr = []
            if (e.status === 200) {
              for (let i = 0; i < e.data.items.length; i++) {
                arr.push({
                  label: e.data.items[i].userName + "（" + e.data.items[i].nickName + "）",
                  key: e.data.items[i].id
                })
              }
              this.data2 = arr;
//              this.personList = this.role.userList
//              let arr1 = [];
//              for (let j in this.role.userList) {
//                arr1.push(this.role.userList[j].id)
//              }
//              if (this.hasRole === true) {
//                this.value2 = arr1;
//                this.personList = this.role.userList
//              } else {
//                this.value2 = this.backValue
//              }
              this.value2 = this.backValue
            } else {
              this.$message({
                type: 'error',
                message: e.msg + "!"
              });
            }
          }).catch(() => {

          });
      }
      ,

      //      选择角色
      chooseRole(data, e) {
//        取消角色选择筛选全部人员
        if ($(e.target).hasClass('active')) {
          $(e.target).removeClass('active')
          $(e.target).find('i').removeClass('active')
          this.getDeptRoleCusInfo();
        } else {
          $(e.target).siblings().removeClass('active');
          $(e.target).siblings().find('i').removeClass('active')
          $(e.target).addClass('active');
          $(e.target).find('i').addClass('active');
          this.getUserByRoleId(data.roleId)
        }
      },

      async getUserByRoleId(roleId) {
        let result;
        let parse = {
          departmentId: this.info.departmentId,
          roleId: roleId
        };
        let data = await getUserByRoleId(result, parse).then((e) => {
          if (e.status === 200) {
            this.personList = e.data;
            let arr = [];
            for (let i in e.data) {
              arr.push(e.data[i].id)
            }
            this.value2 = arr;
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!"
            });
          }
        }).catch(() => {

        });
      },

      popDeliver() {
        this.dialogDeliver = true;
        this.getAllPersonOfDepart()
//        this.getPersonByDepartId()
      }
      ,

//      通过id获取部门
      async getNextDepart(node, el) {
        let self = this;
        let info;
        let parse = {
          id: self.updateId
        };
        node.data.children = [];
        let data = await
          getNextDepart(info, parse).then((e) => {
            if (e.status === 200) {

//                $(el.$el).children('.el-tree-node__content').find('.custom-tree-node>.addChild-icon')
//                  .siblings().children('.tree-loading').show()
              let newArray = []
              for (let i in e.data.departmentList) {
                newArray.push({
                  id: e.data.departmentList[i].departmentId,
                  label: e.data.departmentList[i].departmentName,
                  departmentParentId: e.data.departmentList[i].departmentParentId,
                  departmentLevel: e.data.departmentList[i].departmentLevel,
                  departmentStatus: e.data.departmentList[i].departmentStatus,
                  children: []
                })
              }
              setTimeout(function () {

                node.data.children = newArray;
                $(el.$el).parents().find('.tree-loading').hide();
              }, 500)

              /******全部人员*****/
              self.personList = e.data.userList;

              /******已分配人员*****/
              let arr = []
              for (let i in e.data.userList) {
                arr.push(e.data.userList[i].id)
              }
              self.backValue = arr;

            } else {
              this.$message({
                type: 'error',
                message: e.msg + "!"
              });
            }
          }).catch(() => {

          });
      },

      //    通过id获取部门的人员
      async getDepartPerson() {
        let self = this;
        let info;
        let parse = {
          id: self.updateId
        };
        let data = await
          getNextDepart(info, parse).then((e) => {
            if (e.status === 200) {
              /******全部人员*****/
              self.personList = e.data.userList;

              /******已分配人员*****/
              let arr = []
              for (let i in e.data.userList) {
                arr.push(e.data.userList[i].id)
              }
              self.backValue = arr;
            } else {
              this.$message({
                type: 'error',
                message: e.msg + "!"
              });
            }
          }).catch(() => {

          });
      },


      //获取所有部门
      async getAllDepart() {
        let self = this;
        let info;
        let parse = {
          id: 0
        }
        let data = await
          getDepart(info, parse).then((e) => {
            if (e.status === 200) {
              let newArray = []
              for (let i in e.data.departmentList) {
                newArray.push({
                  id: e.data.departmentList[i].departmentId,
                  label: e.data.departmentList[i].departmentName,
                  departmentParentId: e.data.departmentList[i].departmentParentId,
                  departmentLevel: e.data.departmentList[i].departmentLevel,
                  departmentStatus: e.data.departmentList[i].departmentStatus,
                  children: []
                })
              }
              self.data5 = newArray
              if (JSON.parse(sessionStorage.getItem('permission')) === null) {
              }else{
                self.permission = JSON.parse(sessionStorage.getItem('permission'))
              }
//              this.jsonToTree(e.data);
//              this.firstDeptId = e.data[0].departmentId
//              this.getDeptRoleCusInfo();

//            this.getPersonByDepartId()

            } else {
              this.$message({
                type: 'error',
                message: e.msg + "!"
              });
            }
          }).catch(() => {

          });
      }
      ,

      //      根据部门获取人员和角色信息
      async getDeptRoleCusInfo() {
        let self = this;
        if (self.firstFlag === true) {
          this.$nextTick(function () {
            $('.depart-li').removeClass('active')
            $('.depart-li').find('.addMenu').hide()
            $('.depart-li').eq(0).addClass('active')
            $('.depart-li').eq(0).find('.addMenu').show()
          })
          self.info.departmentId = self.firstDeptId

        }
        let info = {
          departmentId: this.info.departmentId
        };
        let data = await
          getDeptPerson(info).then((e) => {
            if (e.status === 200) {
              if (e.data.userList !== null) {
                if (e.data.roleList.length === 0 || e.data.roleList === null) {
                  self.isRoleListShow = false
                  self.hasRole = false;
                } else {
                  self.hasRole = true;
                  self.isRoleListShow = true
                  self.roleList = e.data.roleList
                }
                self.personList = e.data.userList
                let arr = []
                for (let i in e.data.userList) {
                  arr.push(e.data.userList[i].id)
                }
                this.backValue = arr;
              } else {
                self.personList = [];
                self.roleList = [];
                self.backValue = []
                self.isRoleListShow = false
              }
              self.firstFlag = false;
            } else {
              self.personList = [];
              self.backValue = [];
              self.roleList = [];
              self.isRoleListShow = false
              self.$message({
                type: 'error',
                message: e.msg + "!"
              });
            }
          }).catch(() => {

          });
      }
      ,


      addChildren(data) {
        let self = this;
        for (let i = 0; i < data.length; i++) {
          if (data[i].children) {
            self.addChildren(data[i].children)
          } else {
            data[i]['children'] = []
          }
        }
        return data;
      }
      ,

      //拖拽
      initDragging() {
        this.$dragging.$on('dragged', ({value}) => {
        })
      }
      ,

      //获得菜单配置信息
      getMenuInfo(data) {
        let self = this;
        self.info.departmentName = data.departmentName;
        self.info.departmentId = data.departmentId;
        self.info.departmentParentId = data.departmentParentId;
        self.info.departmentLevel = data.departmentLevel;
        self.getDeptRoleCusInfo();
//        self.getPersonByDepartId()

      }
      ,

      //权限样式
      compareStyle(data) {
        if (data.isChecked === true) {
          return "right-btn active";
        } else {
          return "right-btn";
        }
      }
      ,

      //分配权限
      chooseRight(data, e) {
        $(e.currentTarget).toggleClass('active')
      }
      ,

      addDepart(flag) {
        if (flag === 1) {
          this.dialogTitle = '新增同级部门';
        } else {
          this.dialogTitle = '新增子级部门';
        }
        this.departmentName = '';
        this.dialogAddVisible = true;

      },

      //删除菜单
      deleteMenu() {
        let self = this;
        self.$confirm('确定删除' + self.info.departmentName, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.delDept()
//          self.find(self.rootNode, 'delete')
        }).catch(() => {
          self.tooltipShow = true;
          setTimeout(function () {
            self.tooltipShow = false;
          }, 200)
        });
      }
      ,

      //      编辑部门
      async updateDeptName(name) {
        let self = this;
        let info;
        let parse = {
          departmentId: self.info.departmentId,
          departmentName: name,
        };
        self.updateId = self.info.departmentParentId;
        let data = await
          updateDeptName(info, parse).then((e) => {
            if (e.status === 200) {
              self.$message({
                type: 'success',
                message: '修改成功!'
              });
              self.dialogEditVisible = false;
            } else {
              self.$message({
                type: 'error',
                message: e.msg + "!"
              });
            }
          }).catch(() => {

          });
      }
      ,

      async deleteRole(id) {
        let self = this;
        let result;
        let parse = {
          roleId: id
        };
        let data = await
          deleteRole(result, parse).then((e) => {
            if (e.status === 200) {
              self.$message({
                type: 'success',
                message: "删除成功!",
                duration: 2000
              });
              self.getDeptRoleCusInfo();
            } else {
              this.$message({
                type: 'error',
                message: e.msg + "!",
                duration: 2000
              });
            }
          }).catch(() => {
          });
      }
      ,

      async getRoleByPersonId(id) {
        let self = this;
        let result;
        let parse = {
          roleId: id
        };
        let data = await
          getRoleByPersonId(result, parse).then((e) => {
            if (e.status === 200) {
              self.roleList = e.data;
            } else {
              this.$message({
                type: 'error',
                message: e.msg + "!",
                duration: 2000
              });
            }
          }).catch(() => {
          });
      }
      ,


      //      提交部门
      async submitInfo(flag) {
        let self = this;
        let info;
        let type;
        if (self.dialogTitle === '新增同级部门') {
          type = 0;
        } else {
          type = 1
        }
//        0:新增部门 1:编辑部门
        if (flag === 0) {
          info = {
//          departmentId:self.info.departmentId===''?null:self.info.departmentId,
            departmentName: self.departmentName,
            departmentParentId: type === 0 ? 0 : self.info.departmentId,
            departmentStatus: "Y",
            departmentLevel: type === 0 ? 1 : self.info.departmentLevel + 1
          };
        } else {
          info = {
            departmentId: self.info.departmentId,
            departmentName: self.departmentName,
            departmentParentId: self.info.departmentParentId,
            departmentStatus: self.info.departmentStatus,
            departmentLevel: self.info.departmentLevel
          };
        }
        let data = await
          addDepartment(JSON.stringify(info)).then((e) => {
            if (e.status === 200) {
              self.$message({
                type: 'success',
                message: '提交成功!'
              });
//              flag 0:新增部门 1:编辑部门 type 0:同级 1：子级
              if (flag === 0) {
                self.dialogAddVisible = false;
                if (type === 0) {
                  self.getAllDepart()
                } else {
                  self.updateId = self.info.departmentId;
                  self.getNextDepart(self.node, self.el)
                }
              } else {
                self.dialogEditVisible = false;
//                self.getAllDepart()
                if (self.info.departmentParentId === 0) {
                  self.getAllDepart()
                } else {
                  self.updateId = self.info.departmentParentId;
                  self.getNextDepart(self.node.parent, self.el)
                }
              }
              $('.addChild-icon').hide()

            } else {
              self.$message({
                type: 'error',
                message: e.msg + "!"
              });
              self.departmentList = [];
              self.delList = []
            }
          }).catch(() => {

          });
      }
      ,

      //      树形结构变成梯形
      treeToJson(data) {
        let self = this;
        for (let i = 0; i < data.length; i++) {
          self.departmentList.push({
            departmentId: data[i].departmentId,
            departmentName: data[i].departmentName,
            departmentParentId: data[i].departmentParentId,
            departmentStatus: 'Y'
          })
          if (data[i].children) {
            self.treeToJson(data[i].children)
          }
        }
      }
      ,

      //      删除部门

      async delDept() {
        let self = this;
        let info;
        let parse = {
          departmentId: self.info.departmentId
        };
        let data = await
          delDept(info, parse).then((e) => {
            if (e.status === 200) {
              self.$message({
                type: 'success',
                message: "删除成功!"
              });
              if (self.info.departmentParentId === 0) {
                self.getAllDepart()
              } else {
                self.getNextDepart(self.node, self.el)
              }
//              self.getAllDepart()
            } else {
              self.$message({
                type: 'error',
                message: e.msg + "!"
              });

            }
          }).catch(() => {

          });
      }
      ,


    }
  }
</script>
<style>
  .addept-icon {
    width: 16px;
    height: 16px;
    background-color: rgb(98, 168, 234);
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    right: 114px;
    top: 11px;
  }

  .addept-icon i {
    color: #fff;
    position: absolute;
    font-size: 10px;
    left: 2px;
    top: 1px;
  }

  .depart-title {
    font-size: 14px;
    font-weight: bold;
    color: #666666;
  }

  .add-btn {
    /*width: 87px;*/
    padding: 0 10px;
    height: 33px;
    background-color: #5eabf0;
    border-radius: 3px;
    color: #fff;
    border: none;
    cursor: pointer;
    outline: none;
  }

  .save-btn {
    width: 60px;
    height: 33px;
    background-color: #46be8a;
    border-radius: 3px;
    color: #fff;
    border: none;
    cursor: pointer;
    outline: none;
  }

  .tip {
    color: #a9b5bf;
    margin-top: 10px;
  }

  .depart-main {
    display: inline-block;
    background-color: #ffffff;
    border-top: 5px solid #e7eaec;
    float: left;
    /*min-height: 800px;*/
    height:calc(100vh - 60px);
    position: relative;

  }

  .depart-main-title {
    border-bottom: 1px solid #e4eaec;
    padding: 10px 24px;
    font-weight: bold;
    color: #666666;
    font-size: 14px;
  }

  .depart-setting {
    color: #76838f;
    background-color: #ffffff;
    border-top: 5px solid #e7eaec;
    /*height: 800px;*/
    height:calc(100vh - 60px);
    margin-left: 20px;
    float: left;
  }

  .depart-setting-title {
    border-bottom: 1px solid #e4eaec;
    padding: 10px 24px;
    font-weight: bold;
    color: #666666;
    font-size: 14px;
    position: relative;
  }

  .depart-li {
    display: block;
    height: 36px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    /*padding: 6px 10px 6px 15px;*/
    text-decoration: none;
    background: #fff;
    /*border: 1px solid #e4eaec;*/
    border-radius: 3px;
    color: #76838f;
    line-height: 34px;
  }

  .depart-li.active {
    background-color: #f2fbff;
    color: #62a8ea;
  }

  .depart-main > ul:first-child > li {
    margin-left: 0;
  }

  .depart-main ul > li {
    margin-left: 23px;
  }

  /*.tree_container li ul li div{*/
  /*padding-left: 23px;*/
  /*}*/

  .depart-li > i {
    padding: 0 10px;
    /*border-right: 1px solid #e4eaec;*/
  }

  .depart-li > span {
    display: inline-block;
    cursor: default;
    margin-left: 5px;
    line-height: 36px;
  }

  .depart-li .depart-li-icon {
    float: left;
    margin-right: 20px;
    width: 9px;
    text-align: center;
    cursor: pointer;
    color: #a3afb7;
    outline: none;
  }

  .depart-li-icon-left {
    float: left;
    margin-right: 5px;
    width: 9px;
    text-align: center;
    cursor: pointer;
    color: #a3afb7;
  }

  .menu-center {
    display: inline-block;
    background-color: #ffffff;
    border-top: 5px solid #e7eaec;
    /*height: 800px;*/
    height:calc(100vh - 60px);
    margin-left: 20px;
    float: left;
  }

  .depart-setting .menu-title {
    border-bottom: 1px solid #e4eaec;
    padding: 10px 0;
    color: #37474f;
    font-size: 16px;
  }

  .menu-setting-input {
    display: block;
    height: 36px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    text-decoration: none;
    background: #fff;
    border: 1px solid #e4eaec;
    border-radius: 3px;
    color: #76838f;
    line-height: 34px;
    width: 100%;
    padding-left: 10px;
    font-size: 15px;
    outline: none;
    transition: all 0.3s;
  }

  .depart-setting .right-btn.active {
    background-color: #62a8ea;
    color: #ffffff;
  }

  .depart-setting .right-btn {
    height: 25px;
    background-color: rgba(98, 168, 234, 0.1);
    border-radius: 3px;
    border: solid 1px #62a8ea;
    display: inline-block;
    text-align: center;
    line-height: 25px;
    color: #62a8ea;
    margin-right: 10px;
    cursor: pointer;
    padding: 0 10px;
  }

  .icon-editable {
    height: 34px;
    line-height: 36px;
    width: 36px;
    text-align: center;
    border: 1px solid #e4eaec;
    border-radius: 3px;
    float: left;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
    position: relative;
  }

  .menu-setting-icon:hover {
    background-color: #eee;
  }

  .menu-setting-icon {
    box-shadow: 0 0 0 1px #e4eaec;
    margin-right: 10px;
    border-radius: 3px;
    padding: 5px 8px;
  }

  .tree_container {
    padding-top: 20px;
  }

  .center-group {
    padding-top: 10px;
  }

  .group-item {
    padding: 10px 24px;
    color: #666666;
    cursor: default;
  }

  .group-item-icon.active {
    display: block;
  }

  .group-item-icon {
    float: right;
    cursor: pointer;
    display: none;
  }

  .group-item.active {
    background-color: #f2fbff;
    color: #62a8ea;
  }

  .group-item:hover {
    background-color: #f2fbff;
  }

  table.team-table th,
  table.team-table td {
    padding-left: 16px;
    text-align: left;
    border-bottom: 1px solid #e7eaec;
    font-size: 14px;
    padding: 10px 18px;
  }

  table.team-table tr > td {
    cursor: pointer;
  }

  table.team-table tr.active {
    background-color: #f0f7ff;
  }

  table.team-table tr > th:last-child,
  table.team-table tr > td:last-child {
    border-right: none;
  }

  table.team-table th {
    color: #3f494f;
    font-weight: normal;
  }

  table.team-table td {
    color: #76838f;
  }

  table.team-table td > span {
    cursor: pointer;
    padding-right: 12px;
  }

  .deliver-btn {
    /*float: right;*/
    cursor: pointer;
    padding: 5px 10px;
    background-color: #62a8ea;
    border-radius: 2px;
    color: #fff;
    font-weight: normal;
    font-size: 12px;

    position: absolute;
    right: 10px;
    top: 6px;
  }

  .departName {
    min-width: 80px;
  }

  .depart-li-label {
    line-height: 26px;
  }

  .depart-li-label.edit {
    border-bottom: 1px solid #6aabe5;
    line-height: 26px;
  }

  .departName.edit {
    color: #76838f;
    background-color: #d9eef8;
  }

  .departName:focus {
    outline: none;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>

