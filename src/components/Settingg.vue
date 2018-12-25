<template>
  <el-container>
    <el-header class='header' style="padding: 0;height: 60px;">
      <div class="header-login">
        <div class="header-setting">
          <span @click="settingShow"><i class="icon wb-settings"></i>个人设置</span>
          <span @click="loginOut"><i class="icon wb-user"></i>{{userName}}</span>
          <span class="sort" v-if="userName!=='yfsl'" @click="changeRole"><i class="el-icon-sort"></i>切换角色</span>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside class="nav-bg" id="Menu">
        <!--<div  class="dark-theme">-->
        <menu-tree :menuNode="menuList"></menu-tree>
        <!--</div>-->
      </el-aside>

      <el-main style="margin-left: 216px;height:calc(100vh - 60px);overflow: hidden">
        <el-scrollbar height="100%">
          <router-view></router-view>
        </el-scrollbar>
      </el-main>

    </el-container>
    <el-dialog :visible.sync="dialogEditVisible" :before-close="clearInfo" width="25%" class="psdDialog">
      <div slot="title" class="dialog-title">
        修改个人信息
      </div>
      <el-form>
        <el-form-item label="旧密码">
          <el-input auto-complete="off" v-model="oldPsd"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input auto-complete="off" v-model="newPsd"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input auto-complete="off" v-model="newPsds"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="validate()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog class="dialogChange"
               :visible.sync="dialogChange"
               :before-close="clearActive"
               width="20%"
    >
      <div slot="title" class="dialogChange-title">
        角色选择
      </div>
      <div>
        <div class="change-role-list" v-for="(role,index) in roleList" @click="selectRole($event,role)">{{role.roleName}}
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
    <el-button @click="clearActive">取 消</el-button>
    <el-button type="primary" @click="dialogChangePost()">确 定</el-button>
  </span>
    </el-dialog>

  </el-container>
</template>
<script>
  import Vue from 'vue'
  import {
    getMenuChild,
    getMenu,
    getAllMenu,
    getAdminMenu,
    getMenuChildUser
  } from '../../src/API/menuManager'
  import {loginOut, changePsd} from '../../src/API/login'
  import {getRoleByPeopleId} from '../../src/API/roleManager'
  import {getPermissionById} from '../../src/API/rightsManager'

  let vm;
  let isClick = false;
  var SecondTree = Vue.extend({
    name: 'second-tree',
    props: ['menuNode', 'index', 'level'],
    template: `<li>
               <a class="router" :class="activeByRouter(menuNode.menuUri)" :data-level="level" :data-type="menuNode.menuType" :data-status="menuNode.menuStatus" @click="unfoldMenu($event,menuNode.menuUri,menuNode.menuId,index,menuNode)" :data-menuId='menuNode.menuId' :data-id="menuNode.menuUri">
               <span><i class="icon" style="width: 15px;" :class="menuNode.menuIcon"></i>
               <span>{{menuNode.menuName}}</span></span>

               <span class="ion-ios-arrow-down menu-arrow" v-if="menuNode.menuStatus==='N'"></span>
               </a>
               <ul class="yfsl-menu-ul" v-if="menuNode.children">
               <second-tree  :menuNode.sync="item" v-for="(item,index) in menuNode.children"  :index="index"  :level="item.menuLevel" :key="item.id" >
               </second-tree>
               </ul>
               </li>`,
    data() {
      return {
        unfoldMenu: function (e, url, menuId, index, node) {
          isClick = true;
          if (JSON.parse(sessionStorage.getItem('hisiManagerUser')).userName === 'yfsl') {
            vm.getChildrenMenu(menuId, node, e)
            sessionStorage.setItem('permission', null)
            sessionStorage.removeItem('roleId')
          } else {
            vm.getChildMenuByUser(menuId, node, e)
            if (node.menuStatus === 'N') {
              //不掉权限接口
            } else {
              vm.getPermissionById(menuId)
            }
          }
          var len = $(e.currentTarget).parent('li').find('ul.yfsl-menu-ul:first').children().length;
          var isShow = $(e.currentTarget).parent('li').find('ul.yfsl-menu-ul:first').css('display');

          if (len > 0) {
            //有子集
            if (isShow == 'block') {
              $(e.currentTarget).parent('li').find('ul.yfsl-menu-ul').slideUp(300);
              $(e.currentTarget).find('span.menu-arrow').removeClass('active');
//              $('#Menu').find("ul.yfsl-menu-ul").slideUp(300);
//              $('#Menu').find('span.menu-arrow').removeClass('active');
//              return;
            } else {
              $(e.currentTarget).parent('li').find('ul.yfsl-menu-ul').slideUp(300);
              $(e.currentTarget).find('span.menu-arrow').removeClass('active');
//              $('#Menu').find("ul.yfsl-menu-ul").slideUp(300);
//              $('#Menu').find('span.menu-arrow').removeClass('active');
            }
//            for (let i = 0; i < $(e.currentTarget).siblings().children().length; i++) {
//
//              $(e.currentTarget).siblings().children().eq(i).find('a').css('padding-left', '20px')
//            }
//            $(e.currentTarget).parent('li').find('a.router').addClass('click-active')
          } else {
            if (node.menuStatus === 'N') {

            } else {
              if ($(e.currentTarget).parents('ul').find('a.router').hasClass('click-active')) {
                $(e.currentTarget).parents('ul').find('a.router').removeClass('click-active')
                $(e.currentTarget).parent('li').find('a.router').addClass('click-active')
              } else {
                $(e.currentTarget).parents('ul').find('a.router').removeClass('click-active')
                $(e.currentTarget).parent('li').find('a.router').addClass('click-active')
              }
            }

          }
//          var currentUl = $(e.currentTarget).parents('li').find('ul.yfsl-menu-ul:first')[len - 1];
          var currentUl = $(e.currentTarget).siblings('ul.yfsl-menu-ul:first');
          var isShow = $(currentUl).css('display');
          if (isShow == 'block') {
            var currentLi = $(currentUl).parents('li');
            $(e.currentTarget).siblings('ul').slideUp(300);
            $(e.currentTarget).parent('li').find('span.menu-arrow:first').removeClass('active');
//            $(currentUl).parent('li').find('span.menu-arrow:first').removeClass('active');
//            $(currentUl).slideUp(300);


          } else {

            $(e.currentTarget).parent('li').siblings('li').find("ul.yfsl-menu-ul").slideUp(300);
            $(e.currentTarget).parent('li').find('span.menu-arrow:first').addClass('active');
            $(e.currentTarget).parent('li').find('ul.yfsl-menu-ul:first').slideDown(300);

          }
          if (url === 'user/') {

          } else {
            if (node.menuType == 0) {
              sessionStorage.setItem('url',node.menuUri)
              this.$router.push({
                name: 'iframeMode',
                query: {v: new Date().getTime()}
              });

//              this.$router.replace({
//                name: 'iframeMode',
//                params: {url: node.menuUri}
//              });
            } else {
              this.$router.push({
                path: '../../Settingg/' + url.substring(url.indexOf("/") + 1)
              });
            }
//            vm.getRightButton(menuId)

//          this.$router.push({
//            path: url
//          });
          }
        },
        activeByRouter:function(url){
          if(url.substring(url.indexOf("/") + 1)==this.$route.name){
            return 'click-active'
          }
        }
      }
    }
  })

  var MenuTree = Vue.extend({
    components: {
      'second-tree': SecondTree,
    },
    name: 'menu-tree',
    props: ['menuNode', 'index', 'level'],
    template: '<div><ul><second-tree v-for="(item,index) in menuNode" :menuNode.sync="item" :level="item.menuLevel" :index="index" :key="item.id"></second-tree></ul></div>'
  })
  export default {
    name: 'Settingg',
    components: {
      'menu-tree': MenuTree
    },
//    components:{
//      'tree':Tree
//    },

    data() {
      return {
        menuList: [
//          {
//            menuName: "菜单设置",
//            menuId: '0',
//            menuIcon: 'icon wb-settings',
//            menuUri: "/Settingg/MenuManager",
//            menuLevel: 1,
//            children: []
//          },
//          {
//            menuName: "用户设置",
//            menuLevel: 1,
//            menuIcon: 'icon wb-user',
//            menuUri: "",
//            children: [
//              {
//                menuName: '人员管理',
//                menuLevel: 2,
//                menuId: '11',
//                menuUri: "/Settingg/PersonManager",
//                children: []
//              }, {
//                menuName: '角色管理',
//                menuLevel: 2,
//                menuId: '12',
//                menuUri: "/Settingg/RoleManager",
//                children: []
//              }, {
//                menuName: '权限管理',
//                menuLevel: 2,
//                menuId: '13',
//                menuUri: "/Settingg/RightsManager",
//                children: []
//              }, {
//                menuName: '部门管理',
//                menuLevel: 2,
//                menuId: '14',
//                menuUri: "/Settingg/DepartmentManager",
//                children: []
//              }
//
//            ]
//          }
        ],
        list: [],
        menuId: 1,
        userName: "用户名",
        dialogEditVisible: false,
        dialogChange: false,
        roleId: "",
        roleList: ["管理员", "管理员2"],
        menus: [],
        oldPsd: "",
        newPsd: "",
        newPsds: "",
        firstMenuId: ""

      }
    },
    created() {
      vm = this;
      let self = this;
      if (JSON.parse(sessionStorage.getItem('hisiManagerUser')) !== null) {
        self.userName = JSON.parse(sessionStorage.getItem('hisiManagerUser')).userName;
      }
    },
    mounted() {
      this.getMenu()
//      this.$nextTick(function(){
//        this.autoInitMenu()
//      })


    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
//
      async getPermissionById(menuId) {
        let self = this;
        let result;
        let parse = {
          menuId: menuId,
          roleId: sessionStorage.getItem('roleId')
        };
        let data = await getPermissionById(result, parse).then((e) => {
          if (e.status === 200) {
            let arr = [];
            for (let i = 0; i < e.data.checkList.length; i++) {
              arr.push(e.data.checkList[i].permissionName)
            }
            sessionStorage.setItem('permission', JSON.stringify(arr))
          }
        }).catch(() => {
        });
      },

      fetchData() {
        if (this.$route.query.status === 1) {
          for (let i = 0; i < $('.router').length; i++) {
            if ($('.router').eq(i).attr('data-id').indexOf('RightsManager') >= 0) {
              $('.router').removeClass('click-active')
              $('.router').eq(i).addClass('click-active')
            }
          }
        }
      },

//      切换角色
      dialogChangePost() {
        sessionStorage.setItem('roleId', this.roleId)
        this.getMenu()
        this.clearActive()
      },
      selectRole(e, role) {
        $(e.currentTarget).parent().children().removeClass('active')
        $(e.currentTarget).addClass('active')
        this.roleId = role.roleId;
      },

      changeRole() {
        this.getRoleByPeopleId();
      },

//      关闭前清除
      clearInfo() {
        this.oldPsd = '';
        this.newPsd = '';
        this.newPsds = '';
        this.dialogEditVisible = false
      },

      clearActive() {
        $('.change-role-list').removeClass('active');
        this.dialogChange = false;
      },

//      验证提交
      validate() {
        let self = this;
        if (self.oldPsd === '') {
          self.$message({
            type: 'error',
            message: "旧密码不能为空!",
            duration: 2000
          });
          return
        }
        if (self.newPsd === '') {
          self.$message({
            type: 'error',
            message: "新密码不能为空!",
            duration: 2000
          });
          return
        }
        if (self.newPsds === '') {
          self.$message({
            type: 'error',
            message: "请再输入一次新密码!",
            duration: 2000
          });
          return
        } else if (self.newPsds !== self.newPsd) {
          self.$message({
            type: 'error',
            message: "两次密码不一致，请重新填写!",
            duration: 2000
          });
          return
        }
        self.changePsd()
      },

//      修改密码
      async changePsd() {
        let self = this;
        let result = {
          newPwd: self.newPsd,
          oldPwd: self.oldPsd,
        }
        let parse = {
          id: JSON.parse(sessionStorage.getItem('hisiManagerUser')).id
        }
        let data = await changePsd(JSON.stringify(result), parse).then((e) => {
          if (e.status === 200) {
            self.dialogEditVisible = false
            self.$message({
              type: 'success',
              message: "密码修改成功！即将重新登录！",
              duration: 2000
            });
            setTimeout(function () {
              self.LoginOut()
            }, 500)
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

//      进入页面默认获取第一级菜单
      autoInitMenu(flag) {
//        this.getFirstMenu();
        if (flag === 1) {
          this.autoInitMenuChildrenAdmin(this.menuList, 0);
        } else {
          this.autoInitMenuChildren(this.menuList, 0);
        }
      },

//      管理员自动获取菜单子级
      async autoInitMenuChildrenAdmin(node, flag, ev) {
        let self = this;
        let even;
        let info = {
          id: self.firstMenuId
        };
        let data = await   getMenuChild(info).then((e) => {
          if (e.status === 200) {
            let arr = []
            if (e.data.length > 0) {
              for (let i in e.data) {
                arr.push({
                  menuName: e.data[i].menuName,
                  menuId: e.data[i].menuId,
                  menuIcon: e.data[i].menuIcon,
                  menuUri: e.data[i].menuUri,
                  menuLevel: e.data[i].menuLevel,
                  menuStatus: e.data[i].menuStatus,
                  menuType: e.data[i].menuType,
                  children: []
                })
              }
              node[0].children = arr;
              self.firstMenuId = arr[0].menuId;

              if (flag === 0) {
                even = $('#Menu').find('div ul li:first-child ul.yfsl-menu-ul:first')
              } else {
                even = ev;
              }
              if (self.$route.query.status == 2) {
              } else {
                even.slideDown(300);
              }
              self.autoInitMenuChildrenAdmin(node[0].children, flag + 1, even.children('li:first-child ul.yfsl-menu-ul:first'))
//              even.children('li:first-child a').addClass('click-active')

            } else {
              if (self.$route.query.status == 2) {
                for (let i = 0; i < $('#Menu').find('a').length; i++) {
                  if ($('#Menu').find('a').eq(i).attr('data-id').indexOf(self.$route.name) >= 0) {
                    $('#Menu').find('a').eq(i).addClass('click-active');
                    $('#Menu').find('a').eq(i).parents('ul.yfsl-menu-ul').slideDown(300)
                    break;
                  }
                }
              } else {
                let ele = $('#Menu').find('div ul li:first-child ul.yfsl-menu-ul:first')
                for (let j = 0; j < ele.find('li').length; j++) {
                  if (ele.find('li').eq(j).children('a').attr('data-menuid') === self.firstMenuId.toString()) {
                    ele.find('li').eq(j).children('a').addClass('click-active');
                    self.getPermissionById(ele.find('li').eq(j).children('a').attr('data-menuid'))
                    break;
                  }
                }

              }

            }
//            $(ev.target).parents('ul').find('a.router').removeClass('click-active')
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!"
            });
            self.$router.push({
              path: "/"
            });
          }
        }).catch(() => {
        });
      },

//      用户自动获取菜单子级
      async autoInitMenuChildren(node, flag, ev) {
        let self = this;
        let even;
        let roleId = sessionStorage.getItem('roleId')
        let parse = {
          roleId: roleId
        };
        let info = {
          menuId: self.firstMenuId
        };
        let data = await  getMenuChildUser(info, parse).then((e) => {
          if (e.status === 200) {
            let arr = []
            if (e.data.length > 0) {
              for (let i in e.data) {
                arr.push({
                  menuName: e.data[i].menuName,
                  menuId: e.data[i].menuId,
                  menuIcon: e.data[i].menuIcon,
                  menuUri: e.data[i].menuUri,
                  menuLevel: e.data[i].menuLevel,
                  menuStatus: e.data[i].menuStatus,
                  menuType: e.data[i].menuType,
                  children: []
                })
              }
              node[0].children = arr;
              self.firstMenuId = arr[0].menuId
              if (flag === 0) {
                even = $('#Menu').find('div ul li:first-child ul.yfsl-menu-ul:first')
              } else {
                even = ev;
              }
              even.slideDown(300);
              even.children('li:first-child a').addClass('click-active')
              self.autoInitMenuChildrenAdmin(node[0].children, flag + 1, even.children('li:first-child ul.yfsl-menu-ul:first'))
            } else {
              let ele = $('#Menu').find('div ul li:first-child ul.yfsl-menu-ul:first')
              for (let j = 0; j < ele.find('li').length; j++) {
                if (ele.find('li').eq(j).children('a').attr('data-menuid') === self.firstMenuId.toString()) {
                  ele.find('li').eq(j).children('a').addClass('click-active');
                }
              }
            }
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!"
            });
            self.$router.push({
              path: "/"
            });
          }
        }).catch(() => {
        });
      },

//      管理员获得菜单
      async getFirstMenu() {
        let self = this;
        let info = {
          id: 0
        };
        let data = await   getMenuChild(info).then((e) => {
          if (e.status === 200) {
//            self.menus = e.data;
            let arr = []
//            self.menuList = e.data
            for (let i in e.data) {
              arr.push({
                menuName: e.data[i].menuName,
                menuId: e.data[i].menuId,
                menuIcon: e.data[i].menuIcon,
                menuUri: e.data[i].menuUri,
                menuLevel: e.data[i].menuLevel,
                menuStatus: e.data[i].menuStatus,
                menuType: e.data[i].menuType,
                children: []
              })
            }
            self.menuList = arr;
            self.firstMenuId = arr[0].menuId;
            if (isClick === false) {
              self.autoInitMenu(1)
            }
            sessionStorage.setItem('permission', null)
            self.initMenuClickStyle()
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!"
            });
            self.$router.push({
              path: "/"
            });
          }
        }).catch(() => {
        });
      },

//      管理员获得子级菜单
      async getChildrenMenu(menuId, node, ev) {
        let self = this;
        let info = {
          id: menuId
        };
        let data = await   getMenuChild(info).then((e) => {
          if (e.status === 200) {
            let arr = []
            for (let i in e.data) {
              arr.push({
                menuName: e.data[i].menuName,
                menuId: e.data[i].menuId,
                menuIcon: e.data[i].menuIcon,
                menuUri: e.data[i].menuUri,
                menuLevel: e.data[i].menuLevel,
                menuStatus: e.data[i].menuStatus,
                menuType: e.data[i].menuType,
                children: []
              })
            }
            node.children = arr;
//            $(ev.target).parents('ul').find('a.router').removeClass('click-active')
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!"
            });
            self.$router.push({
              path: "/"
            });
          }
        }).catch(() => {
        });
      },

      async initMenuByUserOfStyle(menuId, node, ev) {
        let self = this;
        let info = {
          id: menuId
        };
        let data = await   getMenuChild(info).then((e) => {
          if (e.status === 200) {
            let url;
            if (e.data.length > 0) {
              url = e.data[0].menuUri
            }
            if (self.$route.query.status == 2) {

            } else {
              self.$router.push({
                path: '../../Settingg/' + url.substring(url.indexOf("/") + 1)
              });
            }

          } else {
            self.$message({
              type: 'error',
              message: e.msg + "!"
            });
            self.$router.push({
              path: "/"
            });
          }
        }).catch(() => {
        });
      },

//      用户获得菜单
      async getFirstMenuByUser() {
        let self = this;
        let roleId = sessionStorage.getItem('roleId')
        let parse = {
          roleId: roleId
        };
        let info = '';
        let data = await  getMenuChildUser(info, parse).then((e) => {
          if (e.status === 200) {
            if (e.data.length > 0) {
              let arr = [];
              for (let i in e.data) {
                arr.push({
                  menuName: e.data[i].menuName,
                  menuId: e.data[i].menuId,
                  menuIcon: e.data[i].menuIcon,
                  menuUri: e.data[i].menuUri,
                  menuLevel: e.data[i].menuLevel,
                  menuStatus: e.data[i].menuStatus,
                  menuType: e.data[i].menuType,
                  children: []
                })
              }
              self.menuList = arr;
              self.firstMenuId = arr[0].menuId;
              if (isClick === false) {
                self.autoInitMenu(2)
              }
              self.initMenuClickStyle()
            } else {
              self.menuList = []
              self.$router.push({
                path: "/Settingg"
              });
              self.$confirm('无页面查看权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {

              }).catch(() => {
                self.$message({
                  type: 'error',
                  message: '正在跳转到登陆页面.....'
                });
                setTimeout(function () {
                  self.$router.push({
                    path: "/"
                  });
                }, 3000)

              });
            }
//            self.menus = e.data;

          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!"
            });
            self.$router.push({
              path: "/"
            });
          }
        }).catch(() => {
        });
      },

//      用户获得子级菜单
      async getChildMenuByUser(menuId, node, ev) {
        let self = this;
        let roleId = sessionStorage.getItem('roleId')
        let parse = {
          roleId: roleId
        };
        let info = {
          menuId: menuId
        };
        let data = await  getMenuChildUser(info, parse).then((e) => {
          if (e.status === 200) {
            let arr = []
            for (let i in e.data) {
              arr.push({
                menuName: e.data[i].menuName,
                menuId: e.data[i].menuId,
                menuIcon: e.data[i].menuIcon,
                menuUri: e.data[i].menuUri,
                menuLevel: e.data[i].menuLevel,
                menuStatus: e.data[i].menuStatus,
                menuType: e.data[i].menuType,
                children: []
              })
            }
            node.children = arr;
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!"
            });
            self.$router.push({
              path: "/"
            });
          }
        }).catch(() => {
        });
      },

//      获取第一个菜单
      async initChildMenuByUserOfStyle(menuId) {
        let self = this;
        let roleId = sessionStorage.getItem('roleId')
        let parse = {
          roleId: roleId
        };
        let info = {
          menuId: menuId
        };
        let data = await  getMenuChildUser(info, parse).then((e) => {
          if (e.status === 200) {
            let url;
            if (e.data.length > 0) {
              url = e.data[0].menuUri
            }
            this.$router.push({
              path: '../../Settingg/' + url.substring(url.indexOf("/") + 1)
            });
          } else {
            this.$message({
              type: 'error',
              message: e.msg + "!"
            });
            self.$router.push({
              path: "/"
            });
          }
        }).catch(() => {
        });
      },

//      获得导航栏菜单
      getMenu() {
        let self = this;
        if (JSON.parse(sessionStorage.getItem('hisiManagerUser')).userName === 'yfsl') {
          self.getFirstMenu()
        } else {
          self.getFirstMenuByUser()
        }
      },

//      默认进入页面默认第一个菜单
      initMenuClickStyle() {
        if (this.menuList[0].menuStatus === 'N') {
          this.$nextTick(function () {
//            $('#Menu').find('div>ul>li:first-child>ul.yfsl-menu-ul:first').slideDown(300);
//            $('#Menu').find('div>ul>li:first-child').find('span.menu-arrow:first').addClass('active');
//            $('#Menu').find('div>ul>li>ul>li:first-child>a').addClass('click-active')
            let url = $('#Menu').find('div>ul>li:first-child>a').attr('data-id')
            let menuId = $('#Menu').find('div>ul>li:first-child>a').attr('data-menuid')

            if (JSON.parse(sessionStorage.getItem('hisiManagerUser')).userName === 'yfsl') {
              this.initMenuByUserOfStyle(menuId)
            } else {
              this.initChildMenuByUserOfStyle(menuId)
            }

//            if (url === 'user/') {
//              this.$router.push({
//                path: '../../Settingg'
//              });
//            } else {
//              this.$router.push({
//                path: '../../Settingg' + url.substring(url.indexOf("/") + 1)
//              });
//            }
          })
        } else {
          this.$nextTick(function () {
            $('#Menu').find('div>ul>li:first-child>a').addClass('click-active')

          })
        }
      },

      //      排序
      sortMenu(obj) {
        obj.sort(function (i1, i2) {
          return i1.menuOrder - i2.menuOrder;
        });
      },

      //管理员获取全部菜单
      jsonToTree(data) {

        data.forEach(ele => {
          let parentId = ele.menuParentId;
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

        this.menus = data;
        this.menuList = data;
        if (this.menuList[0].children) {
          this.$nextTick(function () {
            if (this.$route.params.status) {
              for (let i = 0; i < $('.a.router').length; i++) {
                if ($('.a.router').eq(i).attr('data-id').indexOf('Right') > 0) {
                  $('#Menu').find('.a.router').eq(i).addClass('click-active')
                }
              }
            } else {
              $('#Menu').find('div>ul>li:first-child>ul.yfsl-menu-ul:first').slideDown(300);
              $('#Menu').find('div>ul>li:first-child').find('span.menu-arrow:first').addClass('active');
              $('#Menu').find('div>ul>li>ul>li:first-child>a').addClass('click-active')
              let url = $('#Menu').find('div>ul>li>ul>li:first-child>a').attr('data-id')
//            this.$router.push({
//              path: '../../Settingg/' + url.substring(url.indexOf("/") + 1)
//            });

            }
          })

        } else {
          this.$nextTick(function () {
            $('#Menu').find('div>ul>li:first-child>a').addClass('click-active')

          })
        }

      },

//      获得人员的所有角色，可切换
      async getRoleByPeopleId() {
        let self = this;
        let result;
        let parse = {
          userId: JSON.parse(sessionStorage.getItem('hisiManagerUser')).id
        };
        let data = await getRoleByPeopleId(result, parse).then((e) => {
          if (e.status === 200) {
            self.roleList = e.data
            self.dialogChange = true;
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

//      退出登录
      loginOut() {
        let self = this;
        self.$confirm('确定退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.LoginOut()
        }).catch(() => {

        });
      },

      settingShow() {
        this.dialogEditVisible = true;
      }
    }
  }
</script>
<style>
  .header {
    background-color: #4e97d9;
  }

  .header-login {
    background: url("../../src/assets/Common/logo.png") no-repeat 2%;
    height: 60px;
  }

  .header-setting {
    float: right;
    padding: 20px;
  }

  .header-setting > span {
    margin: 0 26px;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
  }

  .header-setting > span > i {
    margin-right: 5px;
  }

  .header-setting > span.sort > i {
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
  }

  .nav-bg {
    background: url("../../src/assets/Common/nav_bg.png") no-repeat #263238 50% 90%;
    width: 215px !important;
    height: 100%;
    /*position: fixed;*/
    position: absolute;
  }

  .li-active {
    border-right: 4px solid #5eabf0;
    background-color: #222c32;
    color: #fff !important;
  }

  .change-role-list {
    width: 166px;
    border: 1px solid rgb(98, 168, 234);
    background-color: #ffffff;
    color: rgb(98, 168, 234);
    padding: 10px;
    border-radius: 9px;
    text-align: center;
    font-size: 15px;
    margin: 0 auto;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .change-role-list.active {
    color: #ffffff;
    background-color: rgb(98, 168, 234);
  }

  /*menu*/

  #Menu a {
    white-space: nowrap;
    cursor: pointer;
  }

  #Menu {
    width: 220px;
    /*position: fixed;*/
    height: 100%;
    left: 0;
    padding-top: 40px;
  }

  #Menu i.icon {
    display: inline-block;
    text-align: center;
    margin-right: 5px;
  }

  #Menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  #Menu ul ul {
    display: none;
  }

  #Menu li ul {
    /*padding-left: 10px;*/
  }

  #Menu ul li a {
    line-height: 36px;
    /*padding-left: 28px;*/
  }

  #Menu ul li a {
    height: 37px;
    display: block;
    line-height: 36px;
    /*padding: 0 20px;*/
    position: relative;
  }

  #Menu ul span.menu-arrow {
    position: absolute;
    right: 20px;
    top: 0;
    -webkit-transition: -webkit-transform .15s;
    -o-transition: -o-transform .15s;
    transition: -webkit-transform .15s;
    transition: transform .15s;
    transition: transform .15s, -webkit-transform .15s, -o-transform .15s;
    -webkit-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
    -o-transform: rotate(270deg);
    transform: rotate(270deg);
    text-rendering: auto;
    speak: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #Menu ul span.menu-arrow.active {
    -webkit-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    -o-transform: translate(0, 0);
    transform: translate(0, 0);
  }

  #Menu ul li ul span.menu-name {
    margin-left: 28px;
  }

  #Menu.dark-theme {
    background-color: #263238;
  }

  #Menu.dark-theme a {
    color: rgba(163, 175, 183, .9);
  }

  #Menu.dark-theme a:hover,
  #Menu.dark-theme a.active {
    color: #fff;
    background-color: rgba(255, 255, 255, .02);
  }

  #Menu a.router.click-active {
    border-right: 4px solid #5eabf0;
    background-color: #222c32 !important;
    color: #ffffff;
  }

  .dialogChange .el-dialog__header {
    padding: 0;
  }

  .dialogChange-title {
    text-align: center;
    font-size: 17px;
    padding: 15px;
    border-bottom: 1px solid #e2e3e5;
  }

  .psdDialog .el-dialog__body {
    padding: 30px 40px;
  }
</style>
