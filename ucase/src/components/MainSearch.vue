<template>
  <div>
    <MySearch  style="margin-top: 35px" @search="toSearch" ></MySearch>
    <div v-if="searched" >
      <el-table  :data.sync="tableData"
                 style="margin-left:20%;width: 70%;" border stripe
      ><el-table-column
                        label="标题"
                        width="250"
                        header-align="center"
                        align="center">
        <template slot-scope="scope">
          <el-link  @click="toCasedetail(scope.row.id)">{{ scope.row.title }}</el-link >
        </template>
      </el-table-column>
        <el-table-column prop="fname"
                         label="学科门类" width="120"
                         header-align="center"
                         align="center"
                         >
        </el-table-column>
        <el-table-column prop="sname"
                         label="学科"
                         width="120"
                         header-align="center"
                         align="center">
        </el-table-column>
        <el-table-column prop="kname"
                         label="类别"
                         width="120"
                         header-align="center"
                         align="center"
                         :filters="this.Kinds"
                         :filter-method="filterKind">
        </el-table-column>
        <el-table-column prop="author"
                         label="作者"
                         width="120"
                         header-align="center"
                         align="center"
        >
        </el-table-column>
        <el-table-column prop="checkerName"
                         label="审核人员"
                         width="120"
                         header-align="center"
                         align="center"
        >
        </el-table-column>
        <el-table-column header-align="center"
                         align="center"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="warning" :icon="isCollect(scope.row)"  circle :title="scope.row.collect===true?'取消收藏':'收藏'" @click.prevent="collect(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 30px;margin-right: 30%">
        <el-pagination
            background
            :page-size.sync="pagesize"
            :page-sizes.sync="pagesizes"
            layout="sizes, prev, pager, next, jumper, ->, total"
            :total.sync="total"
            @current-change="current_change"
            @size-change="changeSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import MySearch from "@/components/MySearch";
import {request} from "@/network/request";
import {searchCasebypage,searchCasenum,collectCase,cancleCollect,getKinds} from "@/api/api";
import Vue from 'vue'
export default {
  name: "MainSearch",
  components:{
    MySearch
  },
  methods:{
    changeSize(){
      this.currentPage=1
      this.current_change(this.currentPage)
    },
    filterKind(value, row){
      return row.kname === value
    },
    toCasedetail(id){
      let routeUrl = this.$router.resolve({
        path: "/casedetail",
        query: {id:id}
      });
      window.open(routeUrl.href, '_blank')
    },
    current_change:function(currentPage){
      const datas={
        type:this.type,
        value:this.value,
        page:currentPage,
        size:this.pagesize
      }
      const config={
        url: searchCasebypage,
        method: 'post',
        data:datas
      }
      request(config).then((data)=>{
        const collections=this.$store.state.collection
        if(data.data.code===0){
          this.tableData=data.data.data.map((i)=>{
            Vue.set(i,'collect',false)
            for(let j of collections){
              if(i.id===j){
                Vue.set(i,'collect',true)
                break;
              }
            }
            return i
          })
        }else{
          alert(data.data.message)
        }
      }).catch(()=>{
        alert("服务器开小差了")
      })
      this.currentPage = currentPage;
    },
    // toSearch(item){
    //   if(item.type==='subject'){
    //     if(item.value.length>1){
    //       item.value=item.value[0]+";"+item.value[1]
    //     }
    //     else{
    //       item.value=item.value[0]
    //     }
    //   }
    //   this.type=item.type
    //   this.value=item.value
    //   const datas={
    //     type:item.type,
    //     value:item.value,
    //     page:1,
    //     size:this.pagesize
    //   }
    //   const config={
    //     url: searchCasebypage,
    //     method: 'post',
    //     data:datas
    //   }
    //   request(config).then((data)=>{
    //       const collections=this.$store.state.collection
    //       if(data.data.code===0){
    //         this.tableData=data.data.data.map((i)=>{
    //           Vue.set(i,'collect',false)
    //           for(let j of collections){
    //             if(i.id===j){
    //               Vue.set(i,'collect',true)
    //               break;
    //             }
    //           }
    //           return i
    //         })
    //         const conf={
    //           url: searchCasenum,
    //           method: 'post',
    //           data:datas
    //         }
    //         request(conf).then((data)=>{
    //           this.total=data.data.data
    //         }).catch(()=>{
    //           alert("服务器开小差啦");
    //           this.total=this.tableData.length
    //         })
    //         this.total=this.tableData.length
    //         this.searched=true
    //       }else{
    //         alert(data.data.message)
    //       }
    //   }).catch(()=>{
    //     alert("服务器开小差了")
    //   })
    // },
    toSearch(item) {
      if(item.value===undefined){
        item.value=""
      }
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
    },
    isCollect(item){
      if(item.collect===true){
        return 'el-icon-star-on'
      }else {
        return 'el-icon-star-off'
      }
    },
    collect(row){
      const token=this.$store.state.token
      if(token===undefined||token===null||token===""){
        alert("请先登录")
        return
      }
      if(row.collect===false){
        const config={
          url: collectCase,
          method: 'get',
          headers:{
            "Token":token
          },
          params:{
            'cid':row.id
          }
        }
        request(config).then((data)=> {
          if (data.data.code === 0) {
            for (let i in this.tableData) {
              if (this.tableData[i].id === row.id) {
                Vue.set(this.tableData[i], "collect", true)
                break
              }
            }
            this.$store.commit("addCollect",row.id)
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
            'cid':row.id
          }
        }
        request(config0).then((data)=> {
          if (data.data.code === 0) {
            for (let i in this.tableData) {
              if (this.tableData[i].id === row.id) {
                Vue.set(this.tableData[i], "collect", false)
                break
              }
            }
            this.$store.commit("delCollect",row.id)
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
    }
  },
  data(){
    return {
      type:"",
      value:"",
      searched:true,
      tableData:[],
      allData:[],
      total: 0,
      pagesize: 7,
      pagesizes:[7,16,20],
      currentPage:1,
      Kinds:[]
    }
  },mounted() {
    this.type=this.$route.params.type
    this.value=this.$route.params.search
    if(this.value===""||this.value===undefined){
      this.value=""
    }
    const item={
      type:this.type,
      value:this.value
    }
    if(this.type==="subject"){
      this.value=this.value.split(",")
      item.value=this.value
    }
    const config={
      url: getKinds,
      method: 'get',
    }
    request(config).then((data)=>{
      if(data.data.code===0){
        this.Kinds=data.data.data.map((Kind)=>{
          Vue.set(Kind,'text',Kind.name)
          Vue.set(Kind,'value',Kind.name)
          return Kind
        })
      }else{
        alert(data.data.message)
      }
    }).catch(()=>{
      alert("服务器开小差了")
    })
      if(item.type==='subject'){
        if(item.value.length>1){
          item.value=item.value[0]+";"+item.value[1]
        }
        else{
          item.value=item.value[0]
        }
      }
      this.type=item.type
      this.value=item.value
      const datas={
        type:item.type,
        value:item.value,
        page:1,
        size:this.pagesize
      }
      const config0={
        url: searchCasebypage,
        method: 'post',
        data:datas
      }
      request(config0).then((data)=>{
        const collections=this.$store.state.collection
        if(data.data.code===0){
          this.tableData=data.data.data.map((i)=>{
            Vue.set(i,'collect',false)
            for(let j of collections){
              if(i.id===j){
                Vue.set(i,'collect',true)
                break;
              }
            }
            return i
          })
          const conf={
            url: searchCasenum,
            method: 'post',
            data:datas
          }
          request(conf).then((data)=>{
            this.total=data.data.data
          }).catch(()=>{
            alert("服务器开小差啦");
            this.total=this.tableData.length
          })
          this.total=this.tableData.length
          this.searched=true
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
.title{

}
</style>