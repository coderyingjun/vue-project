<template>
  <div style="margin-left: 10%;margin-right: 10%;background-color: #fff;margin-top: 10px;border:1px solid #e4e4e4;">
    <div class="title" >
      <h1 style="display: inline-block;width: 50em;text-align: center">{{ this.case.title }}</h1>
      <span style="display: inline-block;float: right;margin-top: 15px"><el-button @click="tryCollect"><i  :title="collected===true?'取消收藏':'收藏'" :class="{'el-icon-star-on':collected,'el-icon-star-off':!collected}"></i> </el-button></span>
      <hr>
    </div>
    <div class="info">
      <em>{{this.case.author}} 发表于{{this.case.createTime}}</em>
      <span style="margin: 0 5px;color: #CCC">|</span>
      <span>{{this.case.fname}}/{{this.case.sname}}</span>
      <span style="margin: 0 5px;color: #CCC">|</span>
      <span>{{this.case.kname}}</span>
      <br>
      <span style="text-align: right"><em>关键词：</em>
        <span :key="item.id" v-for="item in this.case.keyword" style="display: inline-block;margin: 2px 5px 2px 0;color: #5e6b85" >{{item}};</span>
      </span>
      <hr>
    </div>
    <div class="content" v-html="this.case.content">
    </div>
    <div class="filelist">
      <h4 style="margin-bottom: 10px;
                  color: #ff6666;
                  font-size: 12px;
                  text-align: center;">案例附件列表</h4>
      <div :key="item.id" v-for="item in this.case.files" style="text-align: center;width: 100%;margin: 5px 0"><el-link type="primary" @click.prevent="downloadFile(item)">附件:&nbsp;&nbsp;&nbsp;&nbsp;{{ item.name }}</el-link></div>
    </div>
  </div>
</template>

<script>
import {cancleCollect, collectCase, getCase, getPointfile} from "@/api/api";
import {request} from "@/network/request";
import Vue from "vue";

export default {
name: "CaseDetail",
  methods:{
    downloadFile(item){
      const token=this.$store.state.token
      if(token===null||token===undefined||token===""){
        alert("请先登录")
      }else{
        const config={
          url:getPointfile,
          method: 'get',
          params: {
            "pid":item.id
          },
          headers:{
            "Token":token
          }
        }
        request(config).then((data)=>{
            if(data.data.code===0){
              window.open(item.url)
              this.$notify({
                title: '提示',
                message: data.data.message,
                duration: 0
              });
            }else{
              this.$notify({
                title: '提示',
                message: data.data.message,
                duration: 0
              });
            }
        }).catch(()=>{
          alert("服务器开小差了")
        })
      }
    },
    isCollect() {
      return 'el-icon-star-off';
    },
    tryCollect(){
      const token=localStorage.getItem("uToken")
      if(token===undefined||token===null||token===""){
        alert("请先登录")
        return
      }
      if(this.collected===false){
        const config={
          url: collectCase,
          method: 'get',
          headers:{
            "Token":token
          },
          params:{
            'cid':this.case.id
          }
        }
        request(config).then((data)=> {
          if (data.data.code === 0) {
            for (let i in this.tableData) {
              if (this.tableData[i].id === this.case.id) {
                Vue.set(this.tableData[i], "collect", true)
              }
            }
            this.collected=true
            this.$store.commit("addCollect",this.case.id)
            this.$notify({
              title: 'tip',
              message: '收藏成功',
              duration: 2000
            });
          }else{
            alert(data.data.message)
          }
        }).catch(()=>{
          alert("服务器开小差了")
        })
      }
      //取消收藏
      else{
        const config0={
          url: cancleCollect,
          method: 'get',
          headers:{
            "Token":token
          },
          params:{
            'cid':this.case.id
          }
        }
        request(config0).then((data)=> {
          if (data.data.code === 0) {
            for (let i in this.tableData) {
              if (this.tableData[i].id === this.case.id) {
                Vue.set(this.tableData[i], "collect", false)
              }
            }
            this.collected=false
            this.$store.commit("delCollect",this.case.id)
            this.$notify({
              title: 'tip',
              message: '取消收藏',
              duration: 2000
            });
          }else{
            alert(data.data.message)
          }
        }).catch(()=>{
          alert("服务器开小差了")
        })
      }
    },

  },
  data(){
    return {
      case:{},
      collected:false,
    }
  },computed:{
    collections(){
      return this.$store.state.collection
    }
  },watch:{
    collections(newVal){
      const collection=newVal
      if(collection!==null&&collection!==undefined&&collection.length>0){
        for(let i of collection){
          if(i===this.case.id){
            this.collected=true
            break
          }
        }
      }
    }
  },
  beforeCreate() {
    const cid=this.$route.query.id
    const config={
      url:getCase,
      method:'get',
      params:{'id':cid}
    }
    request(config).then((data)=>{
      if(data.data.code===0){
        this.case=data.data.data
      }
    }).catch(()=>{
      alert("服务器开小差了")
    })
  }
}
</script>

<style scoped>
*{
  line-height:normal;
  text-align: left;
}
.title{
  margin: 0px 20px;
}
.info{
  margin: 0px 20px;
}
.content{
  margin: 30px 20px;
  border:0px solid #e4e4e4;
  min-height: 600px;
}
.filelist{
  border: 1px dashed #FF9A9A;
  min-height: 80px;
  margin: 40px 30px;
}
</style>