<template>
  <div>
  <div style="margin-left: 70px;display: inline-block;float: left;margin-top: 20px">
    <UserNum :user-num="uNum" ></UserNum>
  </div>
    <div style="margin-left: 110px;display: inline-block;float: left;margin-top: 20px">
      <UserNum :my-class="'el-icon-user-solid'" :user-num="ucuNum" :title="'待审核用户总数：'"></UserNum>
    </div>
    <div style="margin-left: 110px;display: inline-block;float: left;margin-top: 20px">
      <UserNum :my-class="'el-icon-notebook-2'" :user-num="cNum" :title="'案例总数：'"></UserNum>
    </div>
    <div style="margin-left: 110px;display: inline-block;float: left;margin-top: 20px">
      <UserNum  :my-class="'el-icon-notebook-1'" :user-num="uccNum" :title="'待审核案例总数：'"></UserNum>
    </div>
    <br>
      <div style="display: block">
        <UserEchart></UserEchart>
      </div>
    <div>
      <WordEchart></WordEchart>
    </div>
  </div>
</template>

<script>
import UserNum from "@/components/echart/UserNum";
import UserEchart from "@/components/echart/UserEchart";
import WordEchart from "@/components/echart/WordEchart";
import {getIndexdata} from "@/api/api";
import {request} from "@/network/request";
export default {
  name: "Main",
  components:{
    UserNum,
    UserEchart,
    WordEchart
  },data(){
    return {
      uNum:0,
      ucuNum: 0,
      cNum: 0,
      uccNum: 0
    }
  },beforeMount() {
    const config={
      url:getIndexdata,
      method:'get'
    }
    request(config).then((data)=>{
      if(data.data.code===0){
        this.uNum=data.data.data.uNum
        this.ucuNum=data.data.data.ucuNum
        this.cNum=data.data.data.cNum
        this.uccNum=data.data.data.uccNum
      }else {
        alert(data.data.message)
      }
    }).catch((err)=>{
      alert("服务器开小差了")
      alert(err)
    })
  }
}
</script>

<style scoped>

</style>