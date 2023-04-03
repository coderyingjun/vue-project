<template>
  <div>
    <span style="display:inline-block;margin-left: -200px;"><el-link @click="toMain">首页</el-link></span>
    <span style="margin-left: 40px;margin-right: 10px" ><el-link @click="toNotice">公告</el-link></span>
  <div v-if="isLogin" style="display: inline-block;float: right">
    <el-dropdown style="margin-top: 10px">
      <el-avatar  icon="el-icon-user-solid"></el-avatar>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="showUpdate">个人信息</el-dropdown-item>
        <el-dropdown-item @click.native="showUpdatePwd">修改密码</el-dropdown-item>
        <el-dropdown-item @click.native="showCollection">我的收藏</el-dropdown-item>
        <el-dropdown-item @click.native="toMycase">我的案例</el-dropdown-item>
        <el-dropdown-item @click.native="logout">登出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="个人信息修改" :visible.sync="Form1Visible" >
      <el-form ref="form1" :model="form1" :rules="rules1">
        <el-form-item label="用户名" prop="username" :label-width="'10'" style="width: 30%;margin-left: 38%">
          <el-input v-model="form1.username"  autocomplete="off" disabled ></el-input>
        </el-form-item>
        <el-form-item label="积分" prop="username" :label-width="'10'" style="width: 30%;margin-left: 38%">
          <el-input v-model="form1.point"  autocomplete="off" disabled ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name"  :label-width="'10'" style="width: 30%;margin-left: 38%">
          <el-input v-model="form1.name"  autocomplete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit1">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="Form2Visible" >
      <el-form ref="form2" :model="form2" :rules="rules2">
        <el-form-item label="旧密码" prop="oldPwd" :label-width="'10'" style="margin-left: 40%;width: 30%">
          <el-input v-model="form2.oldPwd" type="password"  autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwd" :label-width="'10'" style="margin-left: 40%;width: 30%">
          <el-input v-model="form2.pwd"  type="password" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rpt" :label-width="'10'" style="margin-left: 40%;width: 30%">
          <el-input v-model="form2.rpt" type="password" autocomplete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit2">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  <div v-if="!isLogin" style="display: inline-block;float: right;margin-left: 5px">
    <el-button size="small" style="margin-left: -60px;width: 55px;" @click="showLogin">登录</el-button>
    <el-button size="small" style="width: 100px;" @click="showRegister">注册新用户</el-button>
    <el-dialog title="案例库登录" :visible.sync="loginFormVisible" >
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
        <el-form-item label="用户名" prop="username" :label-width="'10'" style="width: 30%;margin-left: 38%">
          <el-input v-model="loginForm.username"   autocomplete="off"  placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password"  :label-width="'10'" style="width: 30%;;margin-left: 38%">
          <el-input v-model="loginForm.password"  type="password" autocomplete="off" placeholder="密码"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="uLogin">登录</el-button>
    </el-dialog>
    <el-dialog title="案例库注册" :visible.sync="registerFormVisible" >
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules">
        <el-form-item label="用户名" prop="username" :label-width="'10'" style="width: 30%;margin-left: 38%">
          <el-input v-model="registerForm.username"   autocomplete="off"  placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username" :label-width="'10'" style="width: 30%;margin-left: 38%">
          <el-input v-model="registerForm.name"   autocomplete="off"  placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password"  :label-width="'10'" style="width: 30%;;margin-left: 38%">
          <el-input v-model="registerForm.password"  type="password" autocomplete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rpt"  :label-width="'10'" style="width: 30%;;margin-left: 38%">
          <el-input v-model="registerForm.rpt"  type="password" autocomplete="off" placeholder="重复输入密码"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="uRegister">注册</el-button>
    </el-dialog>
  </div>
  </div>
</template>

<script>
import {checkToken, login,logout,register,getInfo, updateInfo, updatePwd,getCollection} from "@/api/api"
import {request} from "@/network/request"
export default {
  name: "Head",
  data(){
    return {
      isLogin:false,
      loginFormVisible:false,
      loginForm:{
        username:"",
        password:""
      },
      loginRules:{
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      },
      registerFormVisible:false,
      registerForm:{
        username:"",
        name:"",
        password:"",
        rpt:"",
      },
      registerRules:{
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        rpt: [{required: true, message: '请输入密码', trigger: 'blur'}]
      },
      Form1Visible: false,
      rules1:{
        name: [{required: true, message: '请输入姓名', trigger: 'blur'}]
      },
      form1:{
        username: "",
        name:"",
        point:0
      },
      Form2Visible: false,
      rules2:{
        oldPwd: [{required: true, message: '请输入原有密码', trigger: 'blur'}],
        pwd: [{required: true, message: '请输入新密码', trigger: 'blur'}],
        rpt: [{required: true, message: '请重复输入新密码', trigger: 'blur'}]
      },
      form2:{
        oldPwd: "",
        pwd:"",
        rpt:""
      }
    }
  },
  methods:{
    toMycase(){
      this.$router.push("/mycases")
    },
    showCollection(){
      this.$router.push("/mycollection")
    },
    toMain(){
      this.$router.push("/")
    },
    toNotice(){
      this.$router.push("/notices")
    },
    showRegister(){
      this.registerForm.username=""
      this.registerForm.rpt=""
      this.registerForm.name=""
      this.registerForm.password=""
      this.registerFormVisible=true
    },
    uRegister(){
      this.$refs.registerForm.validate((valid)=>{
        if((valid)){
          if(this.registerForm.password===this.registerForm.rpt){
            const config={
              url: register,
              method: 'post',
              data:{
                username:this.registerForm.username,
                name:this.registerForm.name,
                password:this.registerForm.password
              }
            }
            request(config).then((data)=>{
              if(data.data.code===0) {
                this.registerFormVisible = false
                this.$alert("注册成功！等待管理员审核!!", 'info', {
                  confirmButtonText: '确认'
                })
              }else{
                this.$alert(data.data.message, 'info', {
                  confirmButtonText: '确认'
                })
              }
            }).catch(()=>{
              this.$alert("服务器开小差了", 'info', {
                confirmButtonText: '确认'
              })
            })
          }else{
            alert("两次输入的密码不一致")
          }
        }
      })
    },
    showLogin(){
      this.loginForm.username=""
      this.loginForm.password=""
      this.loginFormVisible=true
    },
    uLogin(){
      this.$refs.loginForm.validate((valid)=>{
        if((valid)){
          const config={
            url: login,
            method: 'post',
            data:{
              username:this.loginForm.username,
              password:this.loginForm.password
            }
          }
          request(config).then((data)=>{
            if(data.data.code===0){
              localStorage.setItem("uToken",data.data.data)
              this.$store.commit("setToken",data.data.data)
              this.isLogin=true
              this.loginFormVisible=false
              this.$alert("登录成功！", 'info', {
                confirmButtonText: '确认'
              })
            }else{
              this.$alert(data.data.message, 'info', {
                confirmButtonText: '确认'
              })
            }
          }).catch(()=>{
            this.$alert("服务器出错！", 'info', {
              confirmButtonText: '确认'
            })
          })
        }
      })
    },
    showUpdate(){
      const config={
        method:'get',
        url: getInfo,
        headers: {
          'Token': this.$store.state.token,
        },
        params: {
          token: this.$store.state.token
        }
      }
      request(config).then((data)=>{
            if(data.data.code===0){
              this.form1.username=data.data.data.username
              this.form1.name=data.data.data.name
              this.form1.point=data.data.data.point
              this.Form1Visible=true
            }
            else{
              alert(data.data.message)
            }
          }
      ).catch(()=>{
        alert("服务器开小差了。。。")
      })
    },
    submit1(){
      this.$refs.form1.validate((valid) => {
        if(valid) {
          const config = {
            url: updateInfo,
            headers: {
              "Token": this.$store.state.token
            },
            params: {
              name: this.form1.name
            }
          }
          request(config).then((data) => {
                alert(data.data.message)
              }
          ).catch(() => {
            alert("服务器开小差了。。。")
          })
        }
      })
    },
    showUpdatePwd(){
      this.form2.oldPwd=""
      this.form2.pwd=""
      this.form2.rpt=""
      this.Form2Visible=true
    },
    submit2(){
      this.$refs.form2.validate((valid) => {
        if(valid) {
          if(this.form2.pwd!==this.form2.rpt){
            alert(this.form2.pwd+"+"+this.form2.rpt)
            alert("密码不一致")
          }else {
            const config = {
              url: updatePwd,
              headers: {
                "Token": this.$store.state.token
              },
              params: {
                oldPwd: this.form2.oldPwd,
                pwd:this.form2.pwd
              }
            }
            request(config).then((data) => {
                  alert(data.data.message)
                }
            ).catch(() => {
              alert("服务器开小差了。。。")
            })
          }
        }
      })
    },
    logout(){
      const config={
        url: logout,
        params:{
          token: this.$store.state.token
        }
      }
      request(config).then(()=>{
        localStorage.removeItem("uToken")
        localStorage.removeItem("uLogin")
        this.isLogin=false
        this.$store.commit("setToken","")
        if(this.$route.path.indexOf("my")>-1){
          this.$router.push("/")
        }
      }).catch(()=>{
        localStorage.removeItem("uToken")
        localStorage.removeItem("uLogin")
        this.isLogin=false
        this.$store.commit("setToken","")
        this.$store.commit("clearCollect")
        if(this.$route.path.indexOf("my")>-1){
          this.$router.push("/")
        }
      })
    }
  },
  beforeCreate() {
    const token=localStorage.getItem("uToken")
    console.log(token)
    if(token==null||token===""||token===undefined){
      this.isLogin=false
    }else{
      const config={
        url: checkToken,
        params: {
          token: token
        }
      }
      request(config).then(data=>{
        if(data.data.code!==0){
          this.isLogin=false
        }else{
          this.$store.commit("setToken",token)
          this.$store.commit("setLogin",true)
          this.isLogin=true
          const config1={
            url:getCollection,
            method: 'get',
            headers:{
              "Token":this.$store.state.token
            }
          }
          request(config1).then((data)=>{
            if(data.data.code===0){
              this.$store.commit('setCollection',data.data.data)
            }
          }).catch((err)=>{
            console.log(err)
          })
        }
      }).catch(()=>{
        this.isLogin=false
      })
    }
  }
}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: black;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>