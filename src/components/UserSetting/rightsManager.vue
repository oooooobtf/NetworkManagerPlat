<template>
  <el-container style="background-color: #fff">
    <el-main style="overflow: hidden;height: calc(100vh - 60px);padding: 0;">
      <div class="right-left" style="width: 13%;">
        <el-input placeholder="按角色名称查询" v-if="permission.indexOf('SELECT')>=0" v-model="roleName"
                  prefix-icon="el-icon-search" @input="getSearchList"
                  @focus="searchRole" @blur="hidePop" @keyup.enter.native="getAllRoles">
        </el-input>
        <!--<div class="pop-div">-->
        <!--<p v-for="role in searchRoles" style="padding: 10px 10px;" @click="goSearch(role)">{{role.roleName}}</p>-->
        <!--</div>-->
        <div style="margin-top: 20px;" class="right-roles">
          <p style="font-weight: bold;color: #526069;margin-bottom: 20px;">角色</p>
          <el-scrollbar height="100%">
            <div style="border-top: 1px solid #eeeeee;height: 500px;">
              <!--<span v-for="role in 20" class="role-list" @click="chooseRole($event,role)">管理员</span>-->
              <span v-for="role in roles" class="role-list" @click="chooseRole($event,role)">{{role.roleName}}</span>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div style="width: 48%;" class="right-main">
        <el-scrollbar height="100%">

          <template>
            <p style="margin-left: 30px;color: #37474f;font-size: 16px;">查看页面设置
              <span style="float: right;color: #76838f;padding-right: 20px;" class="checkbox">
                <!--<span class="checkbox-inner"></span>-->
                <!--<label for="allcheck">全选：-->
                <!--<span @click="allCheck($event)">-->
                <!--<input type="checkbox" id="allcheck" style="display: none">-->
                <!--<span class="checkbox-inner" @click.stop="allCheck($event)">-->
                <!--</span>-->
                <!--</span>-->
                <!--</label>-->
              </span>

            </p>
            <div class="rights-main">
              <el-tree
                :data="rootNode"
                ref="tree"
                show-checkbox
                node-key="id"
                :highlight-current="true"
                @node-click="handleNodeClick"
                @check="handleCheckChange"
                @node-expand="nodeExpand"
                :expand-on-click-node="true"
                :default-expand-all="true"
                :default-checked-keys="isCheckMenuId">
                <!--:default-expanded-keys="isExpandedId"-->
              </el-tree>
            </div>
            <!--<tree :node="rootNode" style="height: 600px;margin-top: 31px;"></tree>-->


          </template>
        </el-scrollbar>
      </div>
      <div style="width: 32%;" class="right-setting" v-show="isSettingShow">
        <div class="menu-title">
          操作权限设置 <span @click="savePermissionId" v-if="permission.indexOf('ASSIGNPERMISSIONS')>=0" style="display: inline-block;text-align: center;
    margin-left: 300px;margin-right: 40px;width: 60px;padding: 5px 0;background-color: #46be8a;border-radius: 3px;color: #fff;border: none;cursor: pointer;outline: none;">保存</span>
        </div>
        <div class="right-group">
          <template>
            <el-checkbox-group :disabled="permission.indexOf('ASSIGNPERMISSIONS')<0" v-model="checkedRights"
                               @change="handleCheckedChange">
              <el-checkbox v-for="(right,index) in rights" :label="right.description" :key="index"
                           style="margin-bottom: 10px;display: block;margin-left: 0;"
              >{{right.description}}
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <!--<div>-->
          <!--<span :class="compareStyle(right)" v-for="right in info.rights"-->
          <!--@click="chooseRight(right,$event)">{{right.rightName}}</span>-->
          <!--&lt;!&ndash;<span class="right-btn active">删除</span>&ndash;&gt;-->
          <!--</div>-->
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>

  import Vue from 'vue';
  import {
    getAllRole,
    getSearchRole,
    getCheckMenuByRoleId,
    getPermissionById,
    savePermission

  } from '../../../src/API/rightsManager'
  import {getAllMenu, getMenuChild} from '../../../src/API/menuManager'
  import login from '../../../src/components/Settingg.vue'

  let mainEl;
  export default {
    name: 'RightsManager',
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
        isCheckRights: [],
        roleName: "",
        departId: "",
        roleId: "",
        roles: [],
        searchRoles: [],
        checkAll: false,
        checkedRights: [],
        isIndeterminate: true,
        rights: [],
        rootNode: [],
        treeList: [],
        isSettingShow: false,
        isCheckMenuId: [],
        isExpandedId: [1],
        menuId: 0,
        node: "",
        delListId: [],
        backValue: [],
        isOldMenu: false
      }
    },
    created() {
      mainEl = this;
    },
    mounted() {
      this.getAllRoles()
//      this.getMenuByRoleId()
//      this.initDragging()

    },
    updated() {
//      this.initDragging()
    },
    methods: {
//      保存勾选权限
      async savePermissionId() {
        let self = this;

        let arr = [];
        let Arr = [];
        let parse = {
          roleId: self.roleId
        };
//        编辑
        let neww = JSON.parse(JSON.stringify(self.backValue))
        let oldCheck = []
        let newCheck = []
        if (self.backValue.length > 0) {
          for (let i in neww) {
            for (let j in self.isCheckRights) {
              if (self.isCheckRights[j] === neww[i].description) {
                arr.push({
                  menuId: self.menuId,
                  permissionId: neww[i].permissionId,
                  id: neww[i].id,
                  roleId: self.roleId
                });
                self.isCheckRights.splice(j, 1)
//                Arr.push({
//                  menuId: self.menuId,
//                  permissionId: neww[i].permissionId,
//                  id: neww[i].id,
//                  roleId: self.roleId,
//                  name: neww[i].description
//                })
//                neww.splice(i, 1)
                break;
              } else {
//                console.log(i)
//                console.log(j)
//                for (let m in self.rights) {
//                  if (self.isCheckRights[j] === self.rights[m].description) {
//                    Arr.push({
//                      menuId: self.menuId,
//                      permissionId: self.rights[m].permissionId,
//                      roleId: self.roleId,
//                      name: self.rights[m].description
//                    })
//                  }
//                  break;
//                }
              }

            }

          }

          for (let m in self.rights) {
            for (let n in self.isCheckRights) {
              if (self.isCheckRights[n] === self.rights[m].description) {
                arr.push({
                  menuId: self.menuId,
                  permissionId: self.rights[m].permissionId,
                  roleId: self.roleId,
                })
              }
            }
          }
//        新增
        } else {
          for (let i in self.rights) {
            for (let j in self.isCheckRights) {
              if (self.isCheckRights[j] === self.rights[i].description) {
                arr.push({
                  menuId: self.menuId,
                  permissionId: self.rights[i].permissionId,
                  roleId: self.roleId
                })
              }
            }
          }
        }


        if (self.isCheckRights.length === 0 && self.isOldMenu == false) {
          self.$message({
            type: 'error',
            message: "请勾选操作权限再保存!"
          });
          return;
        }
        if(JSON.parse(self.node.data.parentId)==0){

        }else{
          arr.push({
            roleId: self.roleId,
            menuId: JSON.parse(self.node.data.parentId),
            permissionId: ''
          });
        }
        let newValue = JSON.parse(JSON.stringify(self.backValue))
        let delId = []
        let flag;
        for (let m in newValue) {
          flag = false;
          for (let n in arr) {
            if (parseInt(newValue[m].permissionId) !== parseInt(arr[n].permissionId)) {
              flag = true;
            } else {
              flag = false;
              break;
            }
          }
          if (flag) {
            delId.push(newValue[m].id);
          }
        }


        let result = {
          delList: delId,
          roleToPermissionList: arr
        };
//        return;
        let data = await savePermission(JSON.stringify(result), parse).then((e) => {
          if (e.status === 200) {
            self.$message({
              type: 'success',
              message: "操作成功!"
            });
            self.getCheckMenuByRoleId(self.node.data.parentId)
            self.getAllPermissions(self.menuId)

          } else {
            self.$message({
              type: 'error',
              message: e.msg + "!"
            });
          }
        }).catch(() => {

        });
      },

      async getFirstMenu() {
        let self = this;
        let result = {
          id: self.menuId
        };
        let data = await  getMenuChild(result).then((e) => {
          if (e.status === 200) {
            let newArray = [];
            for (let i in e.data) {
              if (e.data[i].menuName === '菜单设置') {
              } else {
                if (self.permission.indexOf('ASSIGNPERMISSIONS') < 0) {
                  if (e.data.menuStatus === 'Y') {
                    newArray.push({
                      id: e.data[i].menuId,
                      label: e.data[i].menuName,
                      parentId: e.data[i].menuParentId,
                      status: e.data[i].menuStatus,
                      icon: e.data[i].menuIcon,
                      url: e.data[i].menuUri,
                      order: e.data[i].menuOrder,
                      level: e.data[i].menuLevel,
                      rights: [],
                      children: [],
                    })
                  } else {
                    newArray.push({
                      id: e.data[i].menuId,
                      label: e.data[i].menuName,
                      parentId: e.data[i].menuParentId,
                      status: e.data[i].menuStatus,
                      icon: e.data[i].menuIcon,
                      url: e.data[i].menuUri,
                      order: e.data[i].menuOrder,
                      level: e.data[i].menuLevel,
                      rights: [],
                      children: [],
                      disabled: true
                    })
                  }
                } else {
                  newArray.push({
                    id: e.data[i].menuId,
                    label: e.data[i].menuName,
                    parentId: e.data[i].menuParentId,
                    status: e.data[i].menuStatus,
                    icon: e.data[i].menuIcon,
                    url: e.data[i].menuUri,
                    order: e.data[i].menuOrder,
                    level: e.data[i].menuLevel,
                    rights: [],
                    children: [],
                    disabled: true
                  })

                }


              }

            }

            self.rootNode = JSON.parse(JSON.stringify(newArray));

          } else {
          }
        }).catch(() => {

        });
      },

      async getChildMenu(node) {
        let self = this;
        let result = {
          id: self.menuId
        };
        let data = await  getMenuChild(result).then((e) => {
          if (e.status === 200) {
            let newArray = [];
            for (let i in e.data) {
              if (self.permission.indexOf('ASSIGNPERMISSIONS') >= 0) {
                newArray.push({
                  id: e.data[i].menuId,
                  label: e.data[i].menuName,
                  parentId: e.data[i].menuParentId,
                  status: e.data[i].menuStatus,
                  icon: e.data[i].menuIcon,
                  url: e.data[i].menuUri,
                  order: e.data[i].menuOrder,
                  level: e.data[i].menuLevel,
                  rights: [],
                  children: []
                })
              } else {
                newArray.push({
                  id: e.data[i].menuId,
                  label: e.data[i].menuName,
                  parentId: e.data[i].menuParentId,
                  status: e.data[i].menuStatus,
                  icon: e.data[i].menuIcon,
                  url: e.data[i].menuUri,
                  order: e.data[i].menuOrder,
                  level: e.data[i].menuLevel,
                  rights: [],
                  children: [],
                  disabled: true
                })
              }

            }
            node.data.children = newArray
//            node.expanded = true
//            self.rootNode = JSON.parse(JSON.stringify(newArray));

          } else {
          }
        }).catch(() => {

        });
      },


      //全选一级
//      allCheck(e) {
//        let arr = [];
//        e.stopPropagation()
//        if (this.rootNode.length > 0) {
//          if ($(e.currentTarget).parent('label').find('span.checkbox-inner').hasClass('active')) {
//            $(e.currentTarget).parent('label').find('span.checkbox-inner').removeClass('active')
//            this.isCheckMenuId = []
//            this.$refs.tree.setCheckedKeys([]);
//            let list = [];
//            this.saveChecked(list);
//          } else {
//            $(e.currentTarget).parent('label').find('span.checkbox-inner').addClass('active')
//            this.allCheckHandle(this.rootNode, arr)
//            let list = []
//            for (let i = 0; i < this.isCheckMenuId.length; i++) {
//              list.push({
//                menuId: this.isCheckMenuId[i],
//                permissionIdList: []
//              })
//            }
//            this.saveChecked(list);
//          }
//        } else {
//
//        }
//
//      },
      allCheckHandle(data, arr) {
        let self = this;
        for (let i = 0; i < data.length; i++) {
          arr.push(data[i].menuId)
          if (data[i].children) {
            self.allCheckHandle(data[i].children, arr)
          }
        }
        self.isCheckMenuId = arr;
      },


//      点击节点
      handleNodeClick(data, node, el) {
        this.menuId = data.id
        this.node = node;
        this.checkedRights = []
        this.getChildMenu(node)
        this.isSettingShow = true;
//        获得所有权限
        this.getAllPermissions(data.id)
        if (node.expanded === true) {
          this.getCheckMenuByRoleId(data.id)
        } else {
        }
//        this.getCheckPermissionById(data.menuId)
      },

      nodeExpand(data, node, el) {
        this.getCheckMenuByRoleId(data.id)
      },

//      勾选节点
      handleCheckChange(data) {
        this.menuId = data.id

        let arr = []
      },

//      保存勾选
      async saveChecked(arr) {
        let self = this;
        let result = {
          menuToPermissionList: arr,
//          menuToPermissionList: [
//            {
//              menuId: self.menuId,
//              permissionIdList: self.checkedRights.length === 0 ? [] : self.checkedRights
//            }
//          ],
          roleId: sessionStorage.getItem('roleId')
        };
        let data = await saveCheck(JSON.stringify(result)).then((e) => {
          if (e.status === 200) {
            self.getCheckMenuByRoleId('')
            self.getCheckPermissionById(self.menuId)
          } else {


          }
        }).catch(() => {
        });
      },


//      根据角色id获得勾选菜单
      async getCheckMenuByRoleId(menuId) {
        let self = this;
        let result = {
          menuId: menuId === '' ? '' : menuId
        }
        let parse = {
          roleId: self.roleId
        };
        self.isCheckMenuId = [];
        let data = await getCheckMenuByRoleId(result, parse).then((e) => {
          if (e.status === 200) {
            let arr = [];
            if (e.data.length > 0) {
              for (let i = 0; i < e.data.length; i++) {
                arr.push(e.data[i].menuId)
              }
            }
            self.isCheckMenuId = arr;
            if (menuId == 0) {
              self.node.expanded = false
            }
          } else {
            self.isCheckMenuId = [];
          }
        }).catch(() => {
        });
      },

//      获取页面所有权限
      async getAllPermissions(menuId) {
        let self = this;
        let info;
        let parse = {
          menuId: menuId,
          roleId: self.roleId
        };
        self.backValue = [];
        self.isCheckRights = []
        let data = await getPermissionById(info, parse).then((e) => {
          if (e.status === 200) {
            self.rights = e.data.allList;
            let arr = []
            if (e.data.checkList.length > 0) {
              for (let i in e.data.checkList) {
                arr.push(e.data.checkList[i].description)
                self.backValue.push(e.data.checkList[i])
                self.isCheckRights.push(e.data.checkList[i].description)
//                self.isCheckRights.push(e.data.checkList[i].description)
              }
              self.isOldMenu = true;
            } else {
              self.isOldMenu = false;
            }
            self.checkedRights = arr;
            self.isSettingShow = true;
          } else {

          }
        }).catch(() => {

        });
      },

//      根据角色id和菜单id获得勾选权限
      async getCheckPermissionById(menuId) {
        let self = this;
        let result = {
          menuId: menuId
        };
        let data = await getCheckPermissionById(result).then((e) => {
          if (e.status === 200) {
            for (let i = 0; i < e.data.length; i++) {
              if (e.data[i].isChecked === 'on') {
                self.checkedRights.push(e.data[i].permissionId)
              }

            }

          } else {
            self.checkedRights = []
          }
        }).catch(() => {
        });
      },

//      根据角色获取对应的菜单
      async getMenuByRoleId() {
        let self = this;
        let result;
        let parse = {
          roleId: self.roleId
        };
        let data = await getAllMenu(result, parse).then((e) => {
          if (e.status === 200) {
            let newArray = []
            for (let i = 0; i < e.data.length; i++) {
              newArray.push({
                label: e.data[i].menuName,
                menuParentId: e.data[i].menuParentId,
                menuId: e.data[i].menuId,
                menuName: e.data[i].menuName,
                permissionList: e.data[i].permissionList
              })
            }
            self.jsonToTree(newArray)
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!",
              duration: 2000
            });
            this.rootNode = [];

          }
        }).catch(() => {

        });
      },

      //梯形转树形
      jsonToTree(data) {
        data.forEach(ele => {
          let parentId = ele.menuParentId;
          if (parentId === '0') {
          } else {
            data.forEach(d => {
              if (d.menuId === parentId) {
                let childArray = d.children;
                if (!childArray) {
                  childArray = []
                }
                childArray.push(ele);
                d.children = childArray;
              }
            })
          }
        });

        data = data.filter(ele => ele.menuParentId === '0');
        this.rootNode = data;

        this.getCheckMenuByRoleId()
      },

      //获得所有角色列表
      async getAllRoles() {
        let self = this;
        let result;
        if (self.roleName !== '') {
          self.getSearchList()
          return
        }
        let data = await getAllRole(result).then((e) => {
          if (e.status === 200) {
            self.roles = e.data.items;
            self.rootNode = [];
            $('.role-list').removeClass('active')
            $('.pop-div').hide()
            self.$nextTick(function () {
              if (self.$route.query.name) {
                for (let i = 0; i < $('.role-list').length; i++) {
                  if ($('.role-list').eq(i).text() == this.$route.query.name) {
                    $('.role-list').eq(i).addClass('active')
                    $('.role-list').eq(i).click();
                  }
                }
              }
            })
            if (JSON.parse(sessionStorage.getItem('permission')) === null) {
            } else {
              self.permission = JSON.parse(sessionStorage.getItem('permission'))
            }
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!"
            });
          }
        }).catch(() => {
        });
      },


      //获得模糊查询的内容
      async getSearchList() {
//        $('.pop-div').hide()
        let self = this;
        let result = {
          queryName: self.roleName
        }
        let data = await getSearchRole(result).then((e) => {
          if (e.status === 200) {
            self.roles = e.data.items;
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!"
            });
          }
        }).catch(() => {

        });
      },

      goSearch(a) {
        this.roleName = a.roleName
        this.role = a;
        this.hidePop()
        this.roles = [];
        this.roles.push(this.role)
        this.searchRoles = []
        this.rootNode = []
      },

      hidePop() {
        setTimeout(function () {
          $('.pop-div').hide()
        }, 100)

      },
      searchRole() {

      },


      //选择角色
      chooseRole(e, data) {
        $(e.currentTarget).parent().children().removeClass('active');
        $(e.currentTarget).addClass('active');
        this.roleId = data.roleId;
        this.isSettingShow = false;
//        this.getMenuByRoleId();
        this.menuId = 0;
        this.getFirstMenu()
        this.getCheckMenuByRoleId('')

      },

//      小权限打钩
      handleCheckedChange(value) {
        this.isCheckRights = value;
//        this.saveChecked(arr);
      },

      submitInfo() {
        this.$message({
          type: 'success',
          message: '提交成功!'
        });
      }
    }
  }
</script>
<style>
  .add-btn {
    /*width: 87px;*/
    height: 33px;
    padding: 0 10px;
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

  .right-left {
    /*float: left;*/
    display: inline-block;
    vertical-align: top;
    height: calc(100vh);
    border-right: 1px solid #e4eaec;
    padding: 20px 20px 0 20px;
    position: relative;
  }

  .role-list {
    display: block;
    padding: 15px 20px;
    cursor: pointer;
    color: #526069
  }

  .right-roles .role-list:hover {
    background-color: #f3f7f9;
  }

  .right-roles .role-list.active {
    background-color: #f3f7f9;
    color: #62a8ea;
  }

  .right-main {
    /*float: left;*/
    display: inline-block;
    vertical-align: middle;
    height: auto;
    padding-top: 40px;
  }

  .right-setting {
    /*display: inline-block;*/
    float: right;
    color: #76838f;
    padding-top: 20px;
  }

  .menu-li {
    display: block;
    height: 36px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    /*padding: 6px 10px 6px 15px;*/
    margin: 7px 0;
    text-decoration: none;
    background: #fff;
    border: 1px solid #e4eaec;
    border-radius: 3px;
    color: #76838f;
    line-height: 34px;
  }

  .menu-li.active {
    background-color: #f9fdff;
    color: #62a8ea;
  }

  .right-main > ul:first-child > li {
    margin-left: 0;
  }

  .right-main ul > li {
    margin-left: 33px;
  }

  .menu-li > i {
    padding: 0 10px;
  }

  .menu-li > span {
    display: inline-block;
    cursor: default;
    margin-left: 10px;
  }

  .menu-li .menu-li-icon {
    float: right;
    margin-right: 10px;
    width: 9px;
    text-align: center;
    cursor: pointer;
  }

  .right-setting .menu-title {
    border-bottom: 1px solid #e4eaec;
    padding: 20px 0;
    color: #37474f;
    font-size: 16px;
  }

  .right-setting .right-group {
    padding-top: 20px;
  }

  /*checkbox*/
  .checkbox-inner {
    display: inline-block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
    transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
  }

  .checkbox-inner.active, .checkbox-inner.is-indeterminate {
    background-color: #409eff;
    border-color: #409eff;
  }

  .checkbox-inner.active::before {
    transform: rotate(45deg) scaleY(1);
  }

  .checkbox-inner.is-indeterminate::before {
    content: "";
    position: absolute;
    display: block;
    background-color: #fff;
    height: 2px;
    -webkit-transform: scale(.5);
    transform: scale(.5);
    left: 0;
    right: 0;
    top: 4px;
    width: 11px;
  }

  .checkbox-inner::before {
    box-sizing: content-box;
    content: "";
    border: 1px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    transform: rotate(45deg) scaleY(0);
    width: 3px;
    /*transition: transform .15s ease-in .05s;*/
    transform-origin: center;
  }

  .pop-div {
    position: absolute;
    width: 84%;
    border: 1px solid #e2e3e5;
    margin-top: 5px;
    background-color: #fff;
    display: none;
    z-index: 10;
  }

  .pop-div p:hover {
    background-color: #f5f7fa;
  }

  /*菜单*/
  .rights-main {
    height: 600px;
    margin-top: 31px;
    padding-left: 29px;
  }

  .rights-main .el-tree-node__content > .el-tree-node__expand-icon {
    position: absolute;
    right: 0;
  }

  .rights-main .el-tree-node__content > .el-checkbox {
    padding-left: 10px;
  }

  .rights-main .el-tree-node__content {
    border: 1px solid #e4eaec;
    margin-bottom: 5px;
    height: 34px;
    /*background-color: #f9fdff;*/
    border-radius: 3px;
    /*margin-left: 10px;*/
  }

  .rights-main .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #f9fdff;
    color: #62a8ea;
  }

  /*.rights-main .el-tree-node.is-expanded.is-current {*/
  /*color: #62a8ea;*/
  /*}*/


</style>
