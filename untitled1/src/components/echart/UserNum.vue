<template>
  <div class="uNum">
    <el-icon :class="myClass"></el-icon>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{title}}<br>{{userNum}}
  </div>
</template>

<script>


export default {
  name: "UserNum",
  props: {
    myClass: {type: String, default: 'el-icon-user'},
    userNum: {type: Number, default: 0},
    title: {type: String, default: '用户总数：'}
  }
}
</script>

<style scoped>
  .uNum{
    width: 200px;
    background: white;
    /*text-align: center;*/
    height: 100px;
    border:1px solid #333333;
    line-height: 50px;
  }
</style>