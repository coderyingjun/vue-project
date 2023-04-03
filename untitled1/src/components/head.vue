<template>
  <div style="line-height: 45px">
    <el-dropdown>
  <span class="el-dropdown-link" >
    我的<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="showUpdate">修改个人信息</el-dropdown-item>
        <el-dropdown-item @click.native="showUpdatePwd">修改密码</el-dropdown-item>
        <el-dropdown-item @click.native="logout">登出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="个人信息修改" :visible.sync="Form1Visible" >
      <el-form ref="form1" :model="form1" :rules="rules1">
        <el-form-item label="用户名" prop="username" :label-width="'10'" style="margin-left: 40%;width: 30%">
          <el-input v-model="form1.username"  autocomplete="off" disabled ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name"  :label-width="'10'" style="margin-left: 40%;width: 30%">
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
</template>

<script>
import {checkToken, logout,getInfo, updateInfo, updatePwd} from "@/api/api"
import {request} from "@/network/request"
export default {
  name: "Head",
  data(){
    return {
      Form1Visible: false,
      rules1:{
        name: [{required: true, message: '请输入姓名', trigger: 'blur'}]
      },
      form1:{
        username: "",
        name:"",
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
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminLogin")
        this.$router.push("/login")
      }).catch(()=>{
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminLogin")
        this.$router.push("/login")
        })
      }
  },
  beforeCreate() {
    const token=localStorage.getItem("adminToken")
    if(token==null||token===""){
      this.$router.push("/login")
    }else{
      const config={
        url: checkToken,
        params: {
          token: token
        }
      }
      request(config).then(data=>{
        if(data.data.code!==0){
          this.$router.push("/login")
        }else{
          this.$store.commit("setToken",token)
        }
      }).catch(()=>{
          alert("服务器开小差啦，请尝试重新登录")
          this.$router.push("/login")
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