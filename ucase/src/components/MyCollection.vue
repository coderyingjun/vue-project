<template>
  <div>
    <h1 style="margin-top: 25px">个人收藏</h1>
    <el-table  :data.sync="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
               style="margin-left:20%;width: 70%;margin-top: 30px" border stripe
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
                       >
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
          <el-button type="warning" icon="el-icon-star-on"  circle title="取消收藏" @click.prevent="cancle(scope.row)"></el-button>
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
          @current-change="current_change">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {request} from "@/network/request";
import {cancleCollect, getMycollection} from "@/api/api";
export default {
  name: "MyCollection",
  methods:{
    current_change:function(currentPage){
      this.currentPage = currentPage;
    },
    toCasedetail(id){
      let routeUrl = this.$router.resolve({
        path: "/casedetail",
        query: {id:id}
      });
      window.open(routeUrl.href, '_blank')
    },
    cancle(row){
      const config={
        url: cancleCollect,
        method: 'get',
        headers:{
          "Token":this.$store.state.token
        },
        params:{
          'cid':row.id
        }
    }
    request(config).then((data)=>{
        if(data.data.code===0){
          for (let i in this.tableData) {
            if (this.tableData[i].id === row.id) {
              this.tableData.splice(i,1)
              this.$store.commit("delCollect",row.id)

              break
            }
          }
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
  },
  data(){
    return {
      tableData:[],
      allData:[],
      total: 0,
      pagesize: 7,
      pagesizes:[7,16,20],
      currentPage:1
    }
  },mounted() {
    let token=localStorage.getItem("uToken")
    const config={
      url: getMycollection,
      method: 'get',
      headers: {
        'Token':token
      }
    }
    request(config).then((data)=>{
      if(data.data.code===0){
        this.tableData=data.data.data
        this.total=data.data.data.length
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

</style>