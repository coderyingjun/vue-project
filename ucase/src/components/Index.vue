<template>
  <div>
    <MySearch  style="margin-top: 55px" @search="toSearch" ></MySearch>
  </div>
</template>
<script>
import MySearch from "@/components/MySearch";
export default {
  name: "Index",
  components:{
    MySearch
  },
  methods:{
    toSearch(item){
      if(item.type==="kind"||item.type==="subject"){
        if(item.value===""){
          alert("检索不能为空")
        }else {
          this.$router.push({
            path: `/search/${item.type}/${item.value}`,
          })
        }
      }else{
        this.$router.push({
          path: `/search/${item.type}/${item.value}`,
        })
      }
    }
  },
  data(){
    return {
      type:"",
      value:"",
    }
  },mounted() {

  }
}
</script>

<style scoped>
.title{

}
</style>