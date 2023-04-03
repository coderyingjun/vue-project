<template>
  <div class="wp" style="display: inline-block">
    <div id="chart"  ></div>
  </div>
</template>

<script>
import "echarts-wordcloud/dist/echarts-wordcloud";
import "echarts-wordcloud/dist/echarts-wordcloud.min";
import {request} from "@/network/request";
import {getSearchData} from "@/api/api";
import * as echarts from 'echarts';
export default {
  name: "WordEchart",
  data(){
    return {
      wordData:[
        {
          name: "Java",
          value: 2300
        },
        {
          name: "python",
          value: 2000
        },
      ]
    }
  },methods:{
    initCharts(){
      let myChart2 = echarts.init(document.getElementById('chart'));
      let dou_live_word_result = this.wordData
      myChart2.setOption({
        title: {
          x: "center"
        },
        backgroundColor: "#fff",
        series: [{
          type: "wordCloud",
          //用来调整词之间的距离
          gridSize: 10,
          shape: 'circle',
          //用来调整字的大小范围
          sizeRange: [14, 60],
          //用来调整词的旋转方向，，[0,0]--代表着没有角度，也就是词为水平方向，需要设置角度参考注释内容
          // rotationRange: [-45, 0, 45, 90],
          // rotationRange: [ 0,90],
          rotationRange: [0, 0],
          //随机生成字体颜色
          textStyle: {
            normal: {
              color: function() {
                return(
                    "rgb(" +
                    Math.round(Math.random() * 255) +
                    ", " +
                    Math.round(Math.random() * 255) +
                    ", " +
                    Math.round(Math.random() * 255) +
                    ")"
                );
              }
            }
          },
          //位置相关设置
          left: "center",
          top: "center",
          right: null,
          bottom: null,
          // width: "200%",
          // height: "200%",
          //数据
          data: dou_live_word_result
        }]
      })
    }
  },mounted() {
    const config={
      url:getSearchData,
      method:'get'
    }
    request(config).then((data)=>{
      if(data.data.code===0){
        this.wordData=data.data.data.map((i)=>{
          i.value*=10
          return i
        })
        console.log(this.wordData)
        this.initCharts()
      }else{
        alert(data.data.message)
      }
    }).catch(()=>{
      alert("服务器开小差了")
    })
  }
}
</script>

<style scoped>
#chart{
  width: 600px;
  height: 400px;
}
</style>