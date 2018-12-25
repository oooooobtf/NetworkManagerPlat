<template>
  <el-container style="background-color: #ffffff;padding: 20px;height: calc(100vh - 60px);">
    <el-header style="margin-bottom: 10px;">
      <button class="add-btn" @click="openAddMenuDialog(1)">新增同级菜单</button>
      <button class="save-btn" style="float: right;" @click="saveMenuInfo">保存</button>
      <p class="tip">注：此处的排序影响客户端菜单的排列顺序</p>
    </el-header>
    <el-main>
      <div style="width: 32%;" class="menu-main">
        <el-scrollbar height="100%">
          <!--<template>-->
          <!--<ul>-->
          <!--<li>-->
          <!--<div class="menu-li">-->
          <!--<i class="icon wb-edit"></i>-->
          <!--<span>人员管理</span>-->
          <!--&lt;!&ndash;<span class="icon wb-plus" style="margin-right: 10px;"></span>&ndash;&gt;-->
          <!--<span class="icon wb-triangle-down" style="float: right;margin-right: 10px;"></span>-->
          <!--<span class="icon wb-plus" title="添加子级菜单" style="float: right;margin-right: 10px;"></span>-->
          <!--</div>-->
          <!--<ul>-->
          <!--<li>-->
          <!--<div class="menu-li">-->
          <!--<i class="icon wb-edit"></i>-->
          <!--<span>部门管理管理</span>-->
          <!--<span class="icon wb-triangle-down" style="float: right;margin-right: 10px;"></span>-->
          <!--<span class="icon wb-plus" title="添加子级菜单" style="float: right;margin-right: 10px;"></span>-->
          <!--</div>-->

          <!--</li>-->
          <!--</ul>-->
          <!--</li>-->
          <!--</ul>-->
          <!--</template>-->
          <template>

            <!--:props="props1"-->
            <!--lazy-->
            <!--:load="loadNode"-->
            <el-tree
              ref="tree"
              :data="data5"
              default-expand-all
              :highlight-current="true"
              @node-click="handleNodeClick"
              class="menu-tree"
              style="padding-left: 15px;padding-top: 20px;"
              node-key="id2"
              :expand-on-click-node="true"
            >
              <!--@node-drag-start="handleDragStart"-->
              <!--@node-drag-end="handleDragEnd"-->
              <!--draggable-->
              <span class="custom-tree-node" slot-scope="{ node, data }">
        <span style="padding-left: 5px;">
          <i class="el-tree-node__loading-icon el-icon-loading tree-loading" style="display: none"></i>
          <span style="width: 15px;display: inline-block">
            <i :class="node.icon"></i>
          </span>
          {{ node.label }}
        </span>
        <span class="addChild-icon" style="display: none">
          <el-tooltip effect="dark" :disabled="tooltipShow" content="添加子级菜单" placement="top" offset="0">
              <el-button
                style="margin-right: 20px;"
                type="text"
                size="mini"
                @click.stop="openAddMenuDialog(2)"
              >
                 <!--@click="openAddMenuDialog(2)"-->
              <i class="icon wb-plus"></i>
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
            <!--<tree :node="rootNode" style="height: 600px;"></tree>-->

          </template>
        </el-scrollbar>
      </div>
      <div style="width: 64%;" class="menu-setting" v-show="isSettingShow">
        <div class="menu-title">
          {{info.name}}
          <el-tooltip class="item" :disabled="tooltipShow" effect="dark" content="删除" placement="top">
            <i class="icon fa-trash-o" style="outline:none;float: right;cursor: pointer;margin-right: 5px;"
               @click="deleteMenu()"></i>
          </el-tooltip>
        </div>
        <div>
          <p style="padding: 15px 0 8px 0;">图标和名称：</p>
          <div>
            <el-popover
              v-if="info.icon"
              placement="bottom-start"
              width="250"
              trigger="click">
              <div style="padding: 10px;"><span>请选择菜单图标</span></div>
              <div style="padding: 0 10px 10px 10px">
                <input class="menu-setting-input"/>
              </div>
              <div style="border-top: 1px solid #eeee;padding: 10px;overflow-y: scroll">
                <span v-for="(a,index) in icons" :key="a" @click="chooseIcon(a,'icon')">
                  <i :class="a" class="menu-setting-icon"></i>
                </span>
              </div>
              <span slot="reference" class="icon-editable"><i :class="info.icon"></i></span>
            </el-popover>
            <!--<span class="icon-editable"><i :class="info.icon"></i></span>-->
            <input class="menu-setting-input" v-model="info.name" @blur="changeInfo('name')"
                   style="display: inline-block;width: 80%;margin-left: 0;border-top-left-radius: 0;border-bottom-left-radius: 0"/>
          </div>
        </div>
        <div>
          <p style="padding: 15px 0 8px 0;">URL：
            <el-tooltip class="item" :disabled="tooltipShow" effect="dark" content="预览" placement="top">
              <i class="icon wb-eye" style="float: right;cursor: pointer;margin-right: 5px;" @click="preview()"></i>
            </el-tooltip>
          </p>
          <input class="menu-setting-input" v-model="info.url" @blur="changeInfo('url')"/>
        </div>
        <div>
          <p style="padding: 15px 0 8px 0;">序号：

          </p>
          <input class="menu-setting-input" v-model="info.order" @blur="changeInfo('order')"/>
        </div>
        <div>
          <p style="padding: 15px 0 8px 0;">是否为展示页面：

          </p>
          <template>
            <el-radio v-model="info.status" @change="changeInfo('status')" label="Y">是</el-radio>
            <el-radio v-model="info.status" @change="changeInfo('status')" label="N">否</el-radio>
          </template>

        </div>
        <div>
          <p style="padding: 15px 0 8px 0;">是否为外链页面：

          </p>
          <template>
            <el-radio v-model="info.type" @change="changeInfo('type')" label="0">是</el-radio>
            <el-radio v-model="info.type" @change="changeInfo('type')" label="1">否</el-radio>
          </template>

        </div>
        <div class="right-group">

          <p style="padding: 15px 0 8px 0;">权限分配：
            <span style="float: right;">

              <!--<label for="checkbox">全选：</label><input type="checkbox" id="checkbox" @click="allCheck($event)">-->

            </span>
          </p>
          <template>
            <el-checkbox :disabled="checkboxDisabled" :indeterminate="isIndeterminate" v-model="checkAll"
                         @change="handleCheckAllChange">全选：
            </el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedRights" @change="handleCheckedCitiesChange">
              <el-checkbox-button v-for="(right,index) in rights" :label="right.permissionName"
                                  :key="right.permissionName"
                                  style="margin-bottom: 10px;"
              >{{right.permissionName}}
              </el-checkbox-button>
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
    <el-dialog :visible.sync="addMenuShow" width="25%">
      <div slot="title" class="dialog-title">
        {{dialogTitle}}
      </div>
      <el-form :model="form">
        <el-form-item label="菜单名称">
          <el-input v-model="form.menuName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="是否为展示页面"><br>
          <template>
            <el-radio v-model="form.show" label="Y">是</el-radio>
            <el-radio v-model="form.show" label="N">否</el-radio>
          </template>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" size="medium" @click="submitForm">提 交</el-button>
        <el-button type="info" size="medium" @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>
<script>
  import Vue from 'vue';
  import {
    getAllPermission,
    getPagePermission,
    getAdminMenu,
    getPageInfo,
    submitMenu,
    addMenu,
    deleteMenu,
    getMenuChild
  } from '../../../src/API/menuManager'

  let mainEl;

  //  var TreeNode = Vue.extend({
  //    data: function () {
  //      return {
  //        open: true,
  ////        isFolder: true,
  //      }
  //    },
  //    computed: {
  //      isFolder: function () {
  //        return this.nodes.children && this.nodes.children.length
  //      }
  ////      isFolder() { //利用vue计算属性动态改变isFolder的值，修改图标，判断存在不子级和子级长度
  ////                   // return this.node.children && this.node.children.length //和下面效果一样
  ////        let isFolder = false
  ////        if (this.node.children && this.node.children.length) {
  ////          isFolder = true;
  ////        } else {
  ////          isFolder = false;
  ////        }
  ////        return isFolder
  ////      }
  //    },
  //    name: 'tree-node',
  //    props: ['nodes', 'index', 'id'],
  //    created() {
  //    },
  //    template: `
  //        <li :data-order="index+1">
  //             <div class="menu-li" @click="toggle($event,nodes,index)">
  //               <i v-if="nodes.menuIcon" :class="nodes.menuIcon"></i>
  //                <span>{{nodes.menuName}}</span>
  //                <!--<span v-if="isFolder" :class="[open ? 'icon fa-caret-down menu-li-icon' : 'icon fa-caret-right menu-li-icon']" style="color: #89bceb;"></span>-->
  //                <!--<span v-if="!isFolder" class="icon fa-caret-right menu-li-icon " style="color: #89bceb;" ></span>-->
  //                <span class="icon fa-caret-right menu-li-icon" style="color: #89bceb;display: none;" ></span>
  //                <el-tooltip effect="dark" content="添加子级菜单" placement="top" offset="-5">
  //                <span class="icon wb-plus menu-li-icon addMenu" style="display: none;" @click.stop="addSubMenu(nodes,$event)"></span>
  //                </el-tooltip>
  //             </div>
  //            <ul v-show="open" v-if="isFolder">
  //            <tree-node v-for="(item,indexs) in nodes.children"
  //            :nodes.sync="item"
  //            :index="indexs"
  //            :key="indexs"
  //            :id="item.menuId"
  //            :data-id="item.menuId"
  //            v-dragging="{ item: item, list: nodes.children,group:index+nodes.menuId}"
  //            ></tree-node>
  //            </ul>
  //        </li>`,
  //    methods: {
  //      toggle: function (e, value, index) {
  //        if (this.isFolder) {
  //          this.open = !this.open
  //        }
  //        console.log($(e.currentTarget))
  //        $(e.currentTarget).parents('.tree_container').children('li').find('div').find('span:eq(1)').hide()
  //        $(e.currentTarget).parents('.tree_container').children('li').find('div').find('.addMenu').hide()
  //        $(e.currentTarget).parents('.tree_container').children('li').find('div').removeClass('active')
  //        $(e.currentTarget).addClass('active')
  //        $(e.currentTarget).find('span:eq(1)').show()
  //        $(e.currentTarget).find('.addMenu').show()
  //        mainEl.isSettingShow = true;
  //        mainEl.getMenuInfo(value)
  //
  //      },
  //      addSubMenu(data, e) {
  ////        mainEl.getMenuId('sub', data, e)
  ////        mainEl.addSubMenu(data, e)
  //        mainEl.getSubMenuId(e)
  //        this.open = !this.open
  ////        this.$emit('addSubMenu',data);
  //      }
  //    }
  //  });

  //  var Tree = Vue.extend({
  //    name: 'tree',
  //    props: ['node', 'index'],
  //    components: {
  //      'tree-node': TreeNode
  //    },
  //    template: `<ul class="tree_container">
  //               <tree-node v-for="(nodes,index) in node" :nodes.sync="nodes" :id="nodes.menuId"  :index="index" :key="index" :data-id="nodes.menuId" v-dragging="{ item: nodes, list: node , group:-5}">
  //
  //               </tree-node>
  //               </ul>`,
  //  })

  export default {
    components: {
//      'tree': Tree
    },
    name: 'MenuManager',
    data() {
      const data = [
        {
          id: 1,
          label: '人员设置',
          icon: 'icon wb-settings',
          url: 'www.baidu.com',
          children: [],
          rights: []
        },
        {
          id: 2,
          label: '其他设置',
          children: [],
          icon: '',
          rights: []
        }
      ];
//      const data = [];
      return {
        tooltipShow: false,
        data: '',
        node: "",
        el: "",
        checkboxDisabled: false,
        data5: [],
        dialogTitle: "新增同级菜单",
        addMenuShow: false,
        form: {
          menuName: "",
          show: ""
        },
        isEdit: '',
        menuArray: [],
        delMenuIdList: [],
        checkAll: false,
        checkedRights: [],
        isIndeterminate: true,
//        uuid: "",
//        uuids: "",
//        uuidsFlag: false,
        info: {
          desc: "",
          id: "",
          level: "",
          name: "",
          icon: "",
          parentId: "",
          url: "",
          order: "",
          status: "",
          type: "",
          rights: []
        },
//        list: {
//          label: '自定义菜单',
//          icon: 'icon fa-arrows-alt',
//          url: "#",
//          rights: [],
//          children: []
//        },
        rootNode: [
          {
            menuName: "菜单设置",
            menuId: '0'
          }, {
            menuName: "人员设置",
            children: [{
              menuName: '人员管理1',
              menuId: '11',
              children: [{
                menuName: '人员管理11',
                menuId: '111',
              }]
            }, {
              menuName: '人员管理2',
              menuId: '12'
            }, {
              menuName: '人员管理3',
              menuId: '13'
            }, {
              menuName: '人员管理4',
              menuId: '14'
            }, {
              menuName: '人员管理5',
              menuId: '15'
            }]
          },
          {
            menuName: "其他设置",
            children: [{
              menuName: '其他设置1',
              menuId: '31'
            }, {
              menuName: '其他设置2',
              menuId: '32'
            },
              {
                menuName: '其他设置3',
                menuId: '33'
              }, {
                menuName: '其他设置4',
                menuId: '34'
              }]
          }],
//        rootNode: [],
        isSettingShow: false,
        icons: [
          "icon wb-plus", "icon wb-settings", "icon fa-bell", "icon fa-calendar-o", "icon fa-desktop"
        ],
        menuId: 0,
        rights: [],
        permissionDelId: [],
        backValue: [],
        menuStatus: "",

      }
    },
    created() {
      mainEl = this;
    },
    mounted() {
//      this.getAllPermissions()
      this.getFirstMenu()
//      this.initDragging()
    },
    updated() {
//      this.initDragging()
    },
    methods: {

//      提交新增菜单弹框
      submitForm() {
        this.addMenu()
//        this.addMenuShow = false;
      },

      async addMenu() {
        let self = this;
        let result;
        if (self.dialogTitle === '新增同级菜单') {
          result = {
            menuName: this.form.menuName,
            menuLevel: 1,
            menuParentId: 0,
            menuStatus: this.form.show,
            menuIcon: "icon wb-settings"
          };
        } else {
          result = {
            menuName: this.form.menuName,
            menuParentId: this.info.id,
            menuStatus: this.form.show,
            menuLevel: parseInt(this.info.level) + 1,
          };
        }
        let data = await addMenu(JSON.stringify(result)).then((e) => {
          if (e.status === 200) {
            if (self.dialogTitle === '新增同级菜单') {
              self.menuId = 0;
              $('.addChild-icon').hide()
              self.getFirstMenu()
              self.isSettingShow = false;

            } else {
              self.menuId = self.info.id;
              self.getChildMenu(self.node, self.el)

            }
            self.addMenuShow = false;

          } else {
            self.$message({
              type: 'error',
              message: e.msg + '!'
            });
          }
        }).catch(() => {

        });
      },

//      删除菜单
      async deleteMenuById() {
        let self = this;
        let result;
        let parse = {
          id: self.info.id
        };
        let data = await deleteMenu(result, parse).then((e) => {
          if (e.status === 200) {
            self.$message({
              type: 'success',
              message: '删除成功!'
            });
            self.menuId = 0;
            self.isSettingShow = false;
            self.getFirstMenu()
          } else {
            self.$message({
              type: 'error',
              message: e.msg + '!'
            });
          }
        }).catch(() => {

        });
      },

//      获得一级菜单
      async getFirstMenu() {
        let self = this;
        let result = {
          id: self.menuId
        };
        let data = await  getMenuChild(result).then((e) => {
          if (e.status === 200) {
            let newArray = [];
            for (let i in e.data) {
              newArray.push({
                id: e.data[i].menuId,
                label: e.data[i].menuName,
                parentId: e.data[i].menuParentId,
                status: e.data[i].menuStatus,
                icon: e.data[i].menuIcon,
                url: e.data[i].menuUri,
                order: e.data[i].menuOrder,
                level: e.data[i].menuLevel,
                type: e.data[i].menuType,
                rights: [],
                children: []
              })
            }

            self.data5 = JSON.parse(JSON.stringify(newArray));

          } else {
          }
        }).catch(() => {

        });
      },

//      获得子级菜单
      async getChildMenu(node, el) {
        let self = this;
        let result = {
          id: self.menuId
        };
        node.data.children = [];
        let data = await  getMenuChild(result).then((e) => {
          if (e.status === 200) {
            let newArray = [];
            for (let i in e.data) {
              newArray.push({
                id: e.data[i].menuId,
                label: e.data[i].menuName,
                parentId: e.data[i].menuParentId,
                status: e.data[i].menuStatus,
                icon: e.data[i].menuIcon,
                url: e.data[i].menuUri,
                order: e.data[i].menuOrder,
                level: e.data[i].menuLevel,
                type: e.data[i].menuType,
                rights: [],
                children: []
              })
            }
            setTimeout(function () {

              node.data.children = newArray;
              $(el.$el).parents().find('.tree-loading').hide();
            }, 500)

//            self.data5 = JSON.parse(JSON.stringify(newArray));

          } else {
          }
        }).catch(() => {

        });
      },


      cancelForm() {
        this.addMenuShow = false;
        this.form.menuName = '';
      },


//      点击节点
      handleNodeClick(data, node, el) {
        this.currentNode = node;
        this.node = node;
        this.el = el;
        this.menuStatus = data.status;
        this.isSettingShow = true;
        this.info.name = data.label;
        this.info.icon = data.icon;
        this.info.url = data.url;
        this.info.parentId = data.parentId;
        this.info.order = data.order;
        this.info.level = data.level;
        this.info.id = data.id;
        this.info.type = data.type;
        this.info.status = data.status;
        $(el.$el).parents().find('.addChild-icon').hide();
        $(el.$el).children('.el-tree-node__content').find('.custom-tree-node>.addChild-icon').show();

//        $(el.$el).children('.el-tree-node__content').find('.custom-tree-node>.addChild-icon')
//          .siblings().children('.tree-loading').show()
//        setTimeout(function(){
//          node.data.children.push({
//            id: 4,
//            label: '人员管理',
//            children:[]
//          });
//          $(el.$el).parents().find('.tree-loading').hide();
//        },500)
        this.menuId = data.id;
        this.getChildMenu(node, el)
        if (node.expanded === true) {
          $(el.$el).children('.el-tree-node__content').find('.custom-tree-node>.addChild-icon')
            .siblings().children('.tree-loading').show()
        }
//        this.getAllPermissions()
        this.getPermissionsById(node)
      },

//      拖拽
      handleDragStart(node, ev) {
        this.isSettingShow = false;
      },

      handleDragEnd(draggingNode, dropNode, dropType, ev) {
      },

//      打开弹框
      openAddMenuDialog(flag) {
        let self = this;
        if (flag === 1) {

        } else {
          if (self.menuStatus === 'Y') {
            self.$message({
              type: 'error',
              message: '选择的菜单为展示页面，不能新增子级!'
            });
            return;
          }
        }

        if (self.isEdit == true) {
          self.$confirm('您还未对修改过的信息进行保存，请先进行保存！', '提示', {
            confirmButtonText: '保存',
            cancelButtonText: '不保存',
            type: 'warning'
          }).then(() => {
            self.submitInfo()
//            self.$message({
//              type: 'success',
//              message: '保存成功!'
//            });
          }).catch(() => {
            self.isEdit = false;
            self.addMenuShow = true;
            self.form.menuName = '';
            self.form.show = '';
            if (flag === 1) {
              self.dialogTitle = '新增同级菜单'
            } else {
              self.dialogTitle = '新增子级菜单'
            }
          });
        } else {
          self.addMenuShow = true;
          self.form.menuName = '';
          if (flag === 1) {
            self.dialogTitle = '新增同级菜单'
          } else {
            self.dialogTitle = '新增子级菜单'
          }
        }

      },

//      预览页面
      preview() {
        let url = this.info.url;
        const {href} = this.$router.resolve({
          name: url.substring(url.indexOf("/") + 1),
          query: {
            status: 2
          }
        });

//        console.log(this.$route.query.status)
//        this.$router.push({
//          path: '../Settingg/RightsManager',
//          query: {
//            status: 1,
//            name: data.roleName
//          }
//        });

        window.open(href, '_blank');
      },

//      获得菜单id
//      async getMenuId() {
//        let self = this;
//        let data = await getId().then((e) => {
//          if (e.status === 200) {
//            self.uuid = e.data;
//            self.addMainMenu()
//          } else {
//          }
//        }).catch(() => {
//
//        });
//      },
//      下级id
//      async getSubMenuId(ev) {
//        let self = this;
//        let data = await getId().then((e) => {
//          if (e.status === 200) {
//            self.uuidsFlag = true;
//            self.uuids = e.data;
//            self.find(self.rootNode, 'add', ev)
//          } else {
//            self.uuidsFlag = false
//          }
//        }).catch(() => {
//
//        });
//      },

//      获取所有操作权限
      async getAllPermissions() {
        let self = this;
        let data = await getAllPermission().then((e) => {
          if (e.status === 200) {
            let newArray = []
            for (let i = 0; i < e.data.length; i++) {
              newArray.push({
                permissionStatus: 'Y',
                permissionCode: e.data[i].permission,
                permissionId: '',
                description: e.data[i].permissionName,
                permissionName: e.data[i].permissionName
              })
            }
            self.rights = newArray
          } else {
          }
        }).catch(() => {
        });
      },

//      获取对应菜单的权限
      async getPermissionsById(node) {
        let self = this;
        let parse = {
          menuId: self.menuId
        };
        self.backValue = [];
        let data = await getAllPermission(parse).then((e) => {
          if (e.status === 200) {
            let newArray = []
            for (let i = 0; i < e.data.length; i++) {
              newArray.push({
                permissionStatus: 'Y',
                permissionCode: e.data[i].permission,
                permissionId: e.data[i].permissionId,
                permissionName: e.data[i].permissionName,
                description: e.data[i].permissionName,
              })
            }
            self.rights = newArray

            self.info.rights = e.data;
            node.data.rights = e.data;
            self.checkedRights = [];
            for (let i = 0; i < e.data.length; i++) {
              if (e.data[i].status == true) {
                self.checkedRights.push(e.data[i].permissionName)
                self.backValue.push({
                  menuId: this.info.id,
                  permissionId: e.data[i].permissionId,
                  permissionName: e.data[i].permission,
                  permissionStatus: "Y",
                  description: e.data[i].permissionName,
                });
              }
            }
            self.info.rights = JSON.parse(JSON.stringify(self.backValue));
            node.data.rights = JSON.parse(JSON.stringify(self.backValue));


            self.handleCheckedCitiesChange(self.checkedRights)
          } else {
          }
        }).catch(() => {
        });
      },


//      排序
      sortMenu(obj) {
        obj.sort(function (i1, i2) {
          return i1.menuOrder - i2.menuOrder;
        });
      },


      //获得树形结构
      jsonToTree(data) {
        data.forEach(ele => {
          let parentId = ele.menuParentId;
          let result = [];
          if (parentId === '0') {
//            ele['children'] = []
            //是根元素的hua ,不做任何操作,如果是正常的for-i循环,可以直接continue.
          } else {
            //如果ele是子元素的话 ,把ele扔到他的父亲的child数组中.
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
        //去除重复元素
        data = data.filter(ele => ele.menuParentId === '0');
        this.rootNode = this.addChildren(data)
        this.getAllPermissions()
//        this.initChild()
      },

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
      },

      handleCheckAllChange(val) {
        if (val === true) {
          for (let i = 0; i < this.rights.length; i++) {
            this.checkedRights.push(this.rights[i].permissionName)
          }
        } else {
          this.checkedRights = []
        }

        this.isIndeterminate = false;
      },

      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.rights.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.rights.length;
        let arr = [];
        for (let i = 0; i < this.rights.length; i++) {
          for (let j = 0; j < this.checkedRights.length; j++) {
            if (this.checkedRights[j] === this.rights[i].permissionName) {
//              arr.push(this.rights[i])
              arr.push({
                menuId: this.info.id,
                permissionId: this.rights[i].permissionId,
                permissionName: this.rights[i].permissionCode,
                description: this.rights[i].permissionName,
                permissionStatus: "Y",
              });
              break;
            }
          }
        }
        this.info.rights = arr;
//        this.find(this.rootNode, 'rights', null)
//        this.rootNode[i].rights = arr
      },

      //拖拽
      initDragging() {
        this.$dragging.$on('dragged', ({value}) => {
        })
      },

//      获取菜单配置
      async getMenuInfo(menu) {
        let self = this;
        let info = {
          menuId: menu.menuId
        };
        if (self.isEdit === true) {
          self.info.name = menu.menuName;
          self.info.icon = menu.menuIcon;
          self.info.url = menu.menuUri;
          self.info.rights = menu.permissionList;
          self.info.menuId = menu.menuId;
          self.info.type = menu.menuType;
          self.checkedRights = [];
          for (let i = 0; i < self.info.rights.length; i++) {
            self.checkedRights.push(self.info.rights[i].permissionName)
          }
          self.handleCheckedCitiesChange(self.checkedRights)
          self.isEdit = true;
        } else {
          let data = await getPageInfo(info).then((e) => {
            if (e.status === 200) {
              self.info.name = e.data.menuName;
              self.info.icon = e.data.menuIcon;
              self.info.url = e.data.menuUri;
              self.info.rights = e.data.permissionList;
              self.info.menuId = menu.menuId;
              self.info.type = e.data.menuType;
//            self.info.id = e.data.menuId;
              self.checkedRights = [];
//              self.checkedRights = e.data.permissionList;
              for (let i = 0; i < self.info.rights.length; i++) {
                self.checkedRights.push(self.info.rights[i].permissionName)
              }

              self.handleCheckedCitiesChange(self.checkedRights)
              self.isEdit = false;
            } else {
              self.info.name = menu.menuName;
              self.info.icon = menu.menuIcon;
              self.info.url = menu.menuUri;
              self.info.rights = menu.permissionList;
              self.info.menuId = menu.menuId;
              self.info.type = menu.menuType;
              self.checkedRights = [];
              for (let i = 0; i < self.info.rights.length; i++) {
                self.checkedRights.push(self.info.rights[i].permissionName)
              }

              self.handleCheckedCitiesChange(self.checkedRights)
              self.isEdit = true;
            }
          }).catch(() => {

          });
        }
//        }
      },


      //权限样式
      compareStyle(data) {
        if (data.isChecked === true) {
          return "right-btn active";
        } else {
          return "right-btn";
        }
      },

      //分配权限
      chooseRight(data, e) {
        $(e.currentTarget).toggleClass('active')
      },

//      全选
      allCheck(e) {
        if ($(e.currentTarget).is(":checked")) {
          $('.right-group>div>span').addClass('active')
        } else {
          $('.right-group>div>span').removeClass('active')
        }
      },

      //新增一级
//      addMainMenu() {
//        let self = this;
//        let id = parseInt($('.tree_container>li').length) + 1
////        self.getMenuId();
//        this.rootNode.push({
////          id: id,
//          menuId: self.uuid,
//          menuParentId: '0',
//          menuName: '自定义菜单',
//          menuIcon: 'icon fa-arrows-alt',
//          menuUri: "#",
//          permissionList: [],
//          children: []
//        })
//        self.isEdit = true;
//      },
//
//      //子级新增菜单
//      addSubMenu(data, e) {
//        let self = this;
//        self.getSubMenuId()
//        if (self.uuidsFlag === true) {
//          self.find(self.rootNode, 'add', e)
//        }
//      },

      //查找数据元素并改变
      find(data, type, e) {
        let self = this;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].menuId === self.info.menuId) {
              switch (type) {
                case 'delete':
                  data.splice(i, 1);
                  $('.tree_container').children('li').find('div').find('span:eq(1)').hide()
                  $('.tree_container').children('li').find('div').find('.addMenu').hide()
                  $('.tree_container').children('li').find('div').removeClass('active')
                  self.isSettingShow = false;
                  self.delMenuIdList.push(self.info.menuId)
                  break;
                case 'add':
                  let id;
                  let lastid = parseInt($(e.target).parents('.menu-li').siblings('ul').children('li').length) + 1
                  id = $(e.target).parents('li').attr('data-id') + lastid;
//                  }
//                  if(data[i].children){
//
//                  }else{
//                    data[i]['children']=[]
//                  }
                  data[i].children.push({
//                    id: id,
                    menuId: self.uuids,
                    menuParentId: self.info.menuId,
                    menuName: '自定义菜单',
                    menuIcon: '',
                    menuUri: "#",
                    permissionList: [],
                    children: []
                  });
                  self.uuidsFlag = false
                  self.isEdit = true;
                  break;
                case 'url':
                  data[i].menuUri = self.info.url;
                  self.isEdit = true;
                  break;
                case 'name':
                  data[i].menuName = self.info.name;
                  self.isEdit = true;
                  break;
                case 'icon':
                  data[i].menuIcon = self.info.icon;
                  self.isEdit = true;
                  break;
                case 'rights':
                  data[i].permissionList = self.info.rights;
                  self.isEdit = true;
                  break;
              }
              break;
            } else {
              if (data[i].children) {
                self.find(data[i].children, type, e)
              }
            }
          }
        }
      },

      //绑定改变菜单值
      changeInfo(type) {
        let self = this;
        let newArray = {
          label: this.$refs.tree.getCurrentNode().label,
          url: this.$refs.tree.getCurrentNode().url,
          icon: this.$refs.tree.getCurrentNode().icon
        };
        this.$refs.tree.getCurrentNode().label = this.info.name;
        this.$refs.tree.getCurrentNode().url = this.info.url;
        this.$refs.tree.getCurrentNode().icon = this.info.icon;
        this.$refs.tree.getCurrentNode().order = this.info.order;
        this.$refs.tree.getCurrentNode().rights = this.info.rights;
        this.$refs.tree.getCurrentNode().status = this.info.status;
        this.$refs.tree.getCurrentNode().type = this.info.type;
        if (newArray.label !== this.info.name || newArray.url !== this.info.url || newArray.icon !== this.info.icon) {
          this.isEdit = true;
        }

//        this.currentNode.label = this.info.name
//        this.find(self.rootNode, type)
      },

      //删除菜单
      deleteMenu() {
        let self = this;
        self.$confirm('确定删除' + self.info.name, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.deleteMenuById()
//          self.find(self.rootNode, 'delete')
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
          self.tooltipShow = true;
          setTimeout(function () {
            self.tooltipShow = false;
          }, 200)

        });
      },


      //选择图标
      chooseIcon(data, type) {
        this.info.icon = data;
        this.changeInfo(type)
      },


//      保存菜单
      saveMenuInfo() {
        this.submitInfo()
      },

//      提交菜单
      async submitInfo() {
        let self = this;
        let selectRights = JSON.parse(JSON.stringify(self.info.rights))
        let delectId = [];
        let backRights = JSON.parse(JSON.stringify(self.backValue))

//        self.treeToJson(self.data5, 1)
//        for (let i = 0; i < selectRights.length; i++) {
//          for (let j = 0; j < self.backValue.length; j++) {
//            if (self.backValue[j].permissionName === selectRights[i].permissionCode) {
//              selectRights.splice(i, 1)
//            }
//          }
//        }

        for (let i in self.info.rights) {
          for (let j in backRights) {
            if (backRights[j].permissionName === self.info.rights[i].permissionName) {
              backRights.splice(j, 1)
            }
          }
        }

        let arr = [];
        for (let i in backRights) {
          arr.push(backRights[i].permissionId)
        }
        if (self.info.name === null || self.info.url === null || self.info.order === null) {
          self.$message({
            type: 'error',
            message: "输入框不能为空，请重新填写!"
          });
          return;
        }
//        for (let i = 0; i < self.rights.length; i++) {
//          for (let j = 0; j < self.backValue.length; j++) {
//            if (self.backValue[j].permissionName === self.rights[i].permissionCode) {
//              arr.push(self.backValue[i].permissionId)
////              arr.push(self.rights[i].permissionId)
//              break;
//            }
//          }
//        }

        if (self.info.type == 1) {
          self.info.desc = self.info.url.split('/')[0]
        } else {
          self.info.desc = 'extra'
        }
        let info = {
          menuId: self.info.id,
          menuName: self.info.name,
          menuDesc: self.info.desc,
          menuParentId: self.info.parentId,
          menuUri: self.info.url,
          menuIcon: self.info.icon,
          menuOrder: self.info.order,
          permissionDelId: arr,
          permissionList: self.info.rights,
          menuStatus: self.info.status,
          menuType: self.info.type
//          delMenuIdList: self.delMenuIdList,
//          menuList: self.menuArray
        };
        let data = await addMenu(JSON.stringify(info)).then((e) => {
          if (e.status === 200) {
            self.$message({
              type: 'success',
              message: '提交成功!'
            });
            self.isEdit = false;
            self.backValue = [];
            $('.addChild-icon').hide()
//            self.delMenuIdList = []
//            self.menuArray = [];
//            self.$router.go({
//              path: '../../Settingg/MenuManager'
//            });
            self.menuId = 0;
            self.isSettingShow = false;
            self.getFirstMenu()
//            self.getMenuInfo(self.info.menuId)

          } else {
            self.$message({
              type: 'error',
              message: e.msg + "!"
            });
            self.menuArray = [];
          }
        }).catch(() => {

        });
      },

    }
  }

</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .add-btn:hover {
    background-color: #4e97d9;
  }

  .save-btn:hover {
    background-color: #36ab7a;
  }

  .add-btn {
    padding: 0 10px;
    /*width: 87px;*/
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

  .menu-main {
    display: inline-block;
    height: 200px;
  }

  .menu-setting {
    /*display: inline-block;*/
    float: right;
    color: #76838f;
    padding-right: 22px;
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

  .menu-main > ul:first-child > li {
    margin-left: 0;
  }

  .menu-main ul > li {
    margin-left: 33px;
  }

  .menu-li > i {
    padding: 0 10px;
    border-right: 1px solid #e4eaec;
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
    outline: none;
  }

  .menu-setting .menu-title {
    border-bottom: 1px solid #e4eaec;
    padding: 10px 0;
    color: #37474f;
    font-size: 16px;
    line-height: 24px;
    height: 24px;
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

  .menu-setting .right-btn.active {
    background-color: #62a8ea;
    color: #ffffff;
  }

  .menu-setting .right-btn {
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

  input:focus {
    border-color: #62a8ea;
  }

  .icon-editable:hover {
    background-color: #e4eaec;
    transition: all 0.5s;
  }


</style>
