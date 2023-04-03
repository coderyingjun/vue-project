<template>
  <div style="display: inline-block;float: left;width: 48%;height: 400px;">
    <div id="chartLineBox" style="margin-left:0%;width: 100%;height: 400px;"> </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {request} from "@/network/request";
import {getActiveUserData} from "@/api/api";

export default {
  name: "UserEchart",
  data(){
    return {
      date:[],
      userData:[],
      opinionData: ["3", "2", "4", "4", "5"]
    }
  },
  methods: {
    drawLine(id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['近七日用户活跃度']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },

        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.date
        },
        yAxis: {
          type: 'value',
          minInterval:1
        },
        series: [{
          name: '近七日用户活跃度',
          type: 'line',
          stack: '总量',
          smooth: true,
          data: this.userData
        }]
      })
    }
  },
  //调用
  mounted() {
    const config={
      url:getActiveUserData,
      method:'get'
    }
    request(config).then((data)=>{
      if(data.data.code===0){
        for(let i of data.data.data.reverse()){
          this.date.push(i.date.substring(0,2)+"月"+i.date.substring(2)+"日")
          this.userData.push(i.num)
        }
        this.drawLine('chartLineBox')
      }else {
        alert(data.data.message)
      }
    }).catch(()=>{
      alert("服务器开小差了")
    })

  },
  beforeCreate() {

  }
}
</script>

<style scoped>

</style>