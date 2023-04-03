<template>
  <div class="login-container">
    <el-form :model="ruleForm2" :rules="rules2"
             status-icon
             ref="ruleForm2"
             label-position="left"
             label-width="0px"
             class="demo-ruleForm login-page">
      <h3 class="title">案例库后台登录</h3>
      <el-form-item prop="username">
        <el-input type="text"
                  v-model="ruleForm2.username"
                  auto-complete="off"
                  placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"
                  v-model="ruleForm2.password"
                  auto-complete="off"
                  placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.prevent="handleSubmit" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {request} from "@/network/request"
import {checkToken, login} from '@/api/api'
export default {
  name: "login",
  data(){
    return {
      logining: false,
      ruleForm2: {
        username:'',
        password: '',
      },
      rules2: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      },
    }
  },
  methods: {
    handleSubmit(){
      this.$refs.ruleForm2.validate((valid) => {
        if(valid){
          this.logining = true;
          const config={
            url: login,
            method: "post",
            data: {
                username: this.ruleForm2.username,
                password: this.ruleForm2.password
            }
          }
          request(config).then(data=>{
            if(data.data.code!==0){
              this.logining = false;
              this.$alert(data.data.message, 'info', {
                confirmButtonText: '确认'
              })
              this.ruleForm2.password=""
            }
            else {
              this.$store.commit('setToken',data.data.data)
              this.$store.commit('setLogin',true)
              this.$router.push('/index')
            }
          })
          .catch(()=>{
            this.logining = false;
            this.$alert("服务器出错！", 'info', {
              confirmButtonText: '确认'
            })
            this.ruleForm2.password="";
          })
        }
      })
    }
  },
  beforeCreate() {
    const token=localStorage.getItem("adminToken")
    if(token!==null&&token!==undefined&&token!==""){
      const config={
        url: checkToken,
        params: {
          token: token
        }
      }
      request(config).then(data=>{
        if(data.data.code===0){
          this.$store.commit("setToken",token)
          this.$router.push("/index")
        }
      }).catch((err)=>{
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.title{
  text-align: center;
}
.login-container {
  width: 100%;
  height: 100%;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

</style>