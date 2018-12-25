<template>
  <el-container class="login-main">
    <el-row type="flex" align="middle" class="login-container">
      <div class="login-content">
        <div class="login-logo">
          <h4> HiSi-NMP</h4>
          <p style="font-size: 16px;">后台网络管理平台</p>
        </div>
        <div class="login-form">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <div>
              <el-form-item prop="account" style="margin-left: 0;">
                <el-input v-model="ruleForm.account" placeholder="请输入账号" autocomplete="off"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item prop="password" style="margin-left: 0;">
                <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码"
                          @keyup.enter.native="Login"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <!--<div class="login-btn" @click="submitForm('ruleForm')">-->
          <div class="login-btn" @click="Login()">
            <span>立即登录<i class="login-icon" style="margin-left: 5px;"></i></span>
          </div>
        </div>
      </div>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="clearActive"
      width="20%"
    >
      <div slot="title"
           style="text-align: center;font-size: 17px;padding: 15px;border-bottom: 1px solid #e2e3e5;font-family: 微软雅黑">
        角色选择
      </div>
      <div>
        <div class="login-role-list" v-for="(role,index) in roleList" @click="selectRole($event,role)">{{role.roleName}}
        </div>
      </div>

      <!--<span slot="footer" class="dialog-footer">-->
      <!--<el-button @click="clearActive">取 消</el-button>-->
      <!--<el-button type="primary" @click="selectPost()">确 定</el-button>-->
      <!--</span>-->
    </el-dialog>
  </el-container>

</template>
<script>
  import {login, roleBack} from '../../../src/API/login'

  export default {
    name: 'Login',
    data() {
      return {
        dialogVisible: false,
        roleList: [],
        roleId: "",
        ruleForm: {
          account: "",
          password: ""
        },
        rules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'},
          ],

        }
      }
    },
    methods: {
//      login:function(){
//        let self=this;
//
//
//      },
      clearActive() {
        $('.login-role-list').removeClass('active')
        this.dialogVisible = false;
      },
      selectPost() {
        let self = this;
        self.dialogVisible = false;
        self.roleBack()
//        let type='admin1'
        sessionStorage.setItem('roleId', self.roleId)
        self.$router.push({
          path: "Settingg"
//          path: "Settingg/PersonManager"
        });

//        if(type==='admin'){
//          self.$router.push({
//            path: "Setting/MenuManager"
//          });
//        }else{
//          self.$router.push({
//            path: "Setting/PersonManager"
//          });
//        }

      },
      selectRole(e, role) {
        $(e.currentTarget).parent().children().removeClass('active')
        $(e.currentTarget).addClass('active')
        this.roleId = role.roleId;
        this.selectPost()
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
            this.Login()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      async roleBack() {
        let self = this;
        let result;
        let parse = {
          token: sessionStorage.getItem('token'),
          roleId: self.roleId
        };
        let data = await roleBack(result, parse).then((e) => {
          if (e.status === 200) {
          } else {

          }
        }).catch(() => {

        });
      },


      async Login() {
        let self = this;
        let result = {
          'userName': self.ruleForm.account,
          'password': self.ruleForm.password
        }
        let data = await login(JSON.stringify(result)).then((e) => {
          if (e.status === 200) {
            sessionStorage.setItem('token', e.data.token)
            sessionStorage.setItem('hisiManagerUser', JSON.stringify(e.data.hisiManagerUser))
            if (e.data.hisiManagerUser.userName === 'yfsl') {
              sessionStorage.setItem('menuList', JSON.stringify(e.data.menuList))
              sessionStorage.setItem('permissionNameList', JSON.stringify(e.data.permissionNameList))
              self.$router.push({
                path: "Settingg/"
              });
            } else {
              self.dialogVisible = true;
              self.roleList = e.data.roleList
            }
          } else {
            if (e.status === '-1') {
              self.$message({
                type: 'error',
                message: "系统内部错误，请稍后再试！"
              });
            } else if (e.status === 400) {
              self.$message({
                type: 'error',
                message: e.msg + "！"
              });
            }


          }
        }).catch(() => {

        });
      },
    }
  }
</script>
<style>
  .login-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    /*min-height: 100vh;*/
    background: url("../../assets/Login/bg.png") no-repeat;
    background-size: 100%;

    /*position: fixed;*/
  }

  .login-content {
    width: 463px;
    height: 381px;
    margin: 0 auto;
    background: url("../../assets/Login/account_bg.png") no-repeat 50% 50%;
    background-size: 100%;

    position: relative;
  }

  .login-logo {
    color: #4e97d9;
    padding-top: 20px;
    text-align: center;
    font-size: 22px;
  }

  .login-form {
    width: 330px;
    position: relative;
    margin: 0 auto;
    text-align: center;
    margin-top: 60px;
  }

  /*.account {*/
  /*background: url("../../assets/Login/account.png") no-repeat;*/
  /*background-size: 100%;*/
  /*width: 28px;*/
  /*height: 28px;*/
  /*display: inline-block;*/
  /*margin-right: 8px;*/
  /*vertical-align: middle;*/
  /*}*/

  /*.password {*/
  /*background: url("../../assets/Login/psw.png") no-repeat;*/
  /*background-size: 100%;*/
  /*width: 28px;*/
  /*height: 28px;*/
  /*display: inline-block;*/
  /*margin-right: 8px;*/
  /*vertical-align: middle;*/
  /*}*/

  .login-form > div {
    margin-bottom: 30px;
    color: #1b1e21;
    font-size: 15px;
  }

  .login-btn {
    width: 170px;
    height: 40px;
    background-color: #4e97d9;
    box-shadow: 3px 3px 22px 0px rgba(68, 139, 204, 0.35);
    border-radius: 20px;
    text-align: center;
    cursor: pointer;
    color: #fff;
    font-size: 14px;
    line-height: 14px;
    position: relative;
    margin: 0 auto;
    margin-top: 45px;
  }

  .login-btn > span {
    color: #fff;
    line-height: 38px;
  }

  .login-icon {
    background: url("../../assets/Login/right.png") no-repeat;
    height: 18px;
    width: 18px;
    background-size: 100%;
    position: absolute;
    display: inline-block;
    top: 14px
  }

  .login-role-list.active {
    color: #ffffff;
    background-color: rgb(98, 168, 234);
  }

  .login-role-list {
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
