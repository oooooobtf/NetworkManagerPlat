<template>
  <el-container>
    <el-header class='header' style="padding: 0;height: 60px;">
      <div class="header-login">
        <div class="header-setting">
          <span @click="settingShow"><i class="icon wb-settings"></i>个人设置</span>
          <span @click="loginOut"><i class="icon wb-user"></i>{{userName}}</span>
          <span class="sort"><i class="el-icon-sort" @click="dialogChangeVisible=true"></i>切换角色</span>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside class="nav-bg">
        <template v-if="menus">
          <el-menu v-if="menus.menuName!=='菜单管理'"
                   text-color="#97a3aa"
                   active-text-color="#ffffff"
                   background-color="#263238"
                   style="margin-top: 55px;"
                   :default-active="'0'"
          >
            <!--:default-active="'0'"-->
            <!--:default-openeds="['0','0-0']"-->

            <el-submenu :index="index.toString()" id="1" v-for="(menu,index) in menus" :key="index"
                        v-if="menu.children">
              <template slot="title">
                <i :class="menu.menuIcon"></i>
                <span style="margin-left: 5px;">{{menu.menuName}}</span>
              </template>
              <template v-for="(submenu,index1) in menu.children">
                <router-link :to="submenu.menuUri">
                  <el-menu-item class="li-menu" :index="index+'-'+index1">
                    <i></i>
                    <span>{{submenu.menuName}}</span>
                  </el-menu-item>
                </router-link>
              </template>
            </el-submenu>
            <template v-else>

              <router-link :to="menu.menuUri">
                <el-menu-item class="menu" :index="index.toString()">
                  <i :class="menu.menuIcon"></i>
                  <span style="margin-left: 5px;">{{menu.menuName}}</span>
                </el-menu-item>
              </router-link>
            </template>
          </el-menu>
          <el-menu
            text-color="#97a3aa"
            active-text-color="#ffffff"
            background-color="#263238"
            style="margin-top: 55px;"
            default-active="1"
            v-else>
            <el-menu-item index="1" class="menu">
              <router-link to="MenuManager">
                <i class="icon wb-menu"></i>
                <span style="margin-left: 5px;">菜单管理</span>
              </router-link>
            </el-menu-item>
          </el-menu>
        </template>
      </el-aside>
      <el-main style="margin-left: 216px;overflow: visible;height:calc(100vh - 60px);">
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-dialog :visible.sync="dialogEditVisible" width="30%">
      <div slot="title" class="dialog-title">
        修改个人信息
      </div>
      <el-form>
        <el-form-item label="旧密码">
          <el-input auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogEditVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogChangeVisible"
      :before-close="clearActive"
      width="20%"
    >
      <div slot="title" style="text-align: center;font-size: 17px;padding: 15px;border-bottom: 1px solid #e2e3e5;">
        角色选择
      </div>
      <div>
        <div class="change-role-list" v-for="(role,index) in roleList" @click="select($event,role)">{{role}}
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
    <el-button @click="clearActive">取 消</el-button>
    <el-button type="primary" @click="selectPost()">确 定</el-button>
  </span>
    </el-dialog>

  </el-container>
</template>
<script>
  import Vue from 'vue'
  import {getMenuChild, getMenu, getAllMenu, getAdminMenu} from '../../src/API/menuManager'

//  <div>
//  <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
//    <el-radio-button :label="false">展开</el-radio-button>
//    <el-radio-button :label="true">收起</el-radio-button>
//    </el-radio-group>
//    <el-menu class="menu-Bar" :collapse="isCollapse">
//    <MenuTree :menuData="this.menuData"></MenuTree>
//    </el-menu>
//    </div>


//  var Tree = Vue.extend({
//    name: 'tree',
//    props: ['node', 'index'],
//    components: {
//      'tree-node': TreeNode
//    },
//    template: '<ul class="tree_container"><tree-node v-for="(nodes,index) in node" :nodes.sync="nodes" :id="nodes.id"  :index="index" :key="index" :data-id="nodes.id" v-dragging="{ item: nodes, list: node , group:-5}"></tree-node></ul>',
//  })
  export default {
    name: 'Setting',
//    components:{
//      'tree':Tree
//    },

    data() {
      return {
        list: [],
        menuId: 1,
        userName: "用户名",
        dialogEditVisible: false,
        dialogChangeVisible: false,
        roleList: ["管理员", "管理员2"],
        menus: []
      }
    },
    created() {
      let self = this;
      if ((sessionStorage.getItem('hisiManagerUser')) !== null) {
        self.userName = JSON.parse(sessionStorage.getItem('hisiManagerUser')).userName;
      }

      this.getAllMenu()
//      this.initMenu()

    },
    mounted() {
//      this.initMenu()
//      this.getAllMenu()
    },
    methods: {
      clearActive() {
        $('.login-role-list').removeClass('active')
        this.dialogChangeVisible = false;
      },

//      获得导航栏菜单
      async getAllMenu() {
        let self = this;
        let roleId = sessionStorage.getItem('roleId')
        let parse = {
          roleId: roleId
        };
        let info = '';
        if (self.userName === 'yfsl') {
          info = {
            admin: JSON.parse(sessionStorage.getItem('hisiManagerUser')).userName
          }
          let data = await  getAdminMenu(info).then((e) => {
            if (e.status === 200) {
              self.menus = e.data;
              if (e.data.length > 1) {
                self.jsonToTree(e.data)
              } else {

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
        } else {
          let data = await getAllMenu(info, parse).then((e) => {
            if (e.status === 200) {
//            console.log(e.data)
              self.menus = e.data;
              if (e.data.length > 1) {
                self.jsonToTree(e.data)
              }

//            self.initChild()
            } else {
              this.$message({
                type: 'error',
                message: e.msg + "!"
              });
            }
          }).catch(() => {

          });
        }

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
//        this.$router.push({
//          path: "/"
//        });
//        this.initChild()
      },

//      退出登录
      loginOut() {
        this.$confirm('确定退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: "/"
          });
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
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
    margin: 0 40px;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
  }

  .header-setting > span > i {
    margin-right: 5px;
  }

  .header-setting > span .sort > i {
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
</style>
