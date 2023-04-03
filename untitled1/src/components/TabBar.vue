<template>
  <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="height: 100%;">
    <el-menu-item index="/index" style="margin-top: 70%;margin-right: 2%">
      <i class="el-icon-house"></i>
      <span slot="title" @click="toIndex">网站概览</span>
    </el-menu-item>
    <el-menu-item index="/usermanage" style="margin-right: 2%" @click="toUsermanage">
      <i class="el-icon-user"></i>
      <span slot="title">用户管理</span>
    </el-menu-item>
    <el-submenu index="3" style="margin-right: 2%">
      <template slot="title">
        <i class="el-icon-s-management"></i>
        <span>学科管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/fieldmanage" @click="toFieldmanage" style="min-width: 0">学科门类管理</el-menu-item>
        <el-menu-item index="/subjectmanage" @click="toSubjectmanage" style="min-width: 0">二级学科管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="/kindmanage" style="margin-right: 2%" @click="toKindmanage">
      <i class="el-icon-tickets" ></i>
      <span slot="title">类别管理</span>
    </el-menu-item>
    <el-menu-item index="/casemanage" style="margin-right: 2%" @click="toCasemanage">
      <i class="el-icon-document-copy" ></i>
      <span slot="title">案例管理</span>
    </el-menu-item>
    <el-menu-item index="/noticemanage" style="margin-right: 2%" @click="toNoticemanage">
      <i class="el-icon-message"></i>
      <span slot="title">公告管理</span>
    </el-menu-item>
    <el-submenu index="7" style="margin-right: 2%">
      <template slot="title">
        <i class="el-icon-s-tools"></i>
        <span>系统管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/rolemanage" @click="toRoledmanage" style="min-width: 0">角色管理</el-menu-item>
        <el-menu-item index="/spidertask" @click="toSpiderManage" style="min-width: 0">爬虫任务</el-menu-item>
        <el-menu-item index="/templatemanage" @click="toTemplateManage" style="min-width: 0">爬虫模板</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "TabBar",
  methods:{
    getActive(){
      if(this.$route.path.indexOf("index")>0){
        return "1"
      }else if(this.$route.path.indexOf("usermanage")>0){
        return "2"
      }else if(this.$route.path.indexOf("fieldmanage")>0){
        return "3-1"
      }else if(this.$route.path.indexOf("subjectmanage")>0){
        return "3-2"
      }else if(this.$route.path.indexOf("kindmanage")>0){
        return "4"
      }else if(this.$route.path.indexOf("case")>0){
        return "5"
      }else if(this.$route.path.indexOf("noticemanage")>0){
        return "6"
      }
    },
    handleOpen(){},
    handleClose(){},
    toIndex(){
      this.$store.commit("setTabIndex","1")
      this.$router.push('/index')
    },
    toUsermanage(){
      this.$store.commit("setTabIndex","2")
      this.$router.push("/usermanage")
    },
    toFieldmanage(){
      this.$store.commit("setTabIndex","3-1")
      this.$router.push("/fieldmanage")
    },
    toSubjectmanage(){
      this.$store.commit("setTabIndex","3-2")
      this.$router.push("/subjectmanage")
    },
    toKindmanage(){
      this.$store.commit("setTabIndex","4")
      this.$router.push("/kindmanage")
    },toNoticemanage(){
      this.$store.commit("setTabIndex","5")
      this.$router.push("/noticemanage")
    },toCasemanage(){
      this.$store.commit("setTabIndex","6")
      this.$router.push("/casemanage")
    },toRoledmanage(){
      this.$store.commit("setTabIndex","7-1")
      this.$router.push("/rolemanage")
    },toSpiderManage(){
      this.$store.commit("setTabIndex","7-2")
      this.$router.push("/spidertask")
    },toTemplateManage(){
      this.$store.commit("setTabIndex","7-3")
      this.$router.push("/templatemanage")
    }
  }
}
</script>

<style scoped>

</style>