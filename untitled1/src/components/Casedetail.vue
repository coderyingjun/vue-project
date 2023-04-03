<template>
  <div style="margin-left: 10%;margin-right: 10%;background-color: #fff;margin-top: 10px;border:1px solid #e4e4e4;">
    <div class="title"  >
      <h1 style="text-align: center">{{ this.case.title }}</h1>
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
import {getCase} from "@/api/api";
import {request} from "@/network/request";
export default {
  name: "CaseDetail",
  methods:{
    downloadFile(item){
      window.open(item.url)
      }
  },
  data(){
    return {
      case:{},
      collected:false,
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