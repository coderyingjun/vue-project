<template>
  <el-container style="height:100%">
    <el-container>
      <el-header style="height: 10%">
        <Head style="margin-left: 90%;margin-bottom: 20%;"></Head>
      </el-header>
      <el-main style="margin-top: 0%;">
        <router-view :key="$route.fullPath"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Head from './Head'
export default {
name: "CaseMain",
  components:{
    Head
  },
  methods:{
    toSearch(item){
      alert(item)
      this.notSearche=false
    }
  },
  data(){
    return {
      notSearche:true,
      tableData:[],
      allData:[],
      total: 0,
      pagesize: 7,
      pagesizes:[7,16,20],
      currentPage:1
  }
  },

}
</script>

<style scoped>
body{
  overflow:auto
}
.el-header {
  background-color: #4683eb;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #f9f9f9;
  color: #333;
  text-align: center;
  line-height: 160px;
  padding: 0;
}
.el-main[data-v-5c886d6e]{
  line-height: 40px;
}
body > .el-container {
  margin-bottom: 40px;
}

</style>