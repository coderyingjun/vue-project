<template>
  <el-container style="height:100%">
    <el-aside width="10%" style="height: 100%">
      <TabBar style="height: 100%;"></TabBar>
    </el-aside>
    <el-container>
      <el-header style="height: 6%">
        <Head style="margin-left: 90%;margin-bottom: 20%"></Head>
      </el-header>
      <el-main style=""><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script>
import TabBar from "@/components/TabBar";
import Head from "@/components/head";
export default {
  name: "index",
  components: {
    TabBar,Head
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>