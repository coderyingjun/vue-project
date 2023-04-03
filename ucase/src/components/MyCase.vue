<template>
  <div>
    <h1 style="margin-top: 25px">我的案例</h1>
    <div>
      <el-button icon="el-icon-edit" type="primary" style="margin-left: 900px" @click="toAddcase">发布案例</el-button>
    </div>
    <el-table  :data.sync="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
               style="margin-left:15%;width: 70%;margin-top: 30px" border stripe
    ><el-table-column
        label="标题"
        width="200"
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
                       width="100"
                       header-align="center"
                       align="center">
      </el-table-column>
      <el-table-column prop="kname"
                       label="类别"
                       width="100"
                       header-align="center"
                       align="center"
      >
      </el-table-column>
      <el-table-column prop="createTime"
                       label="创建时间"
                       width="150"
                       header-align="center"
                       align="center">
      </el-table-column>
      <el-table-column prop="statusCode"
                       label="案例状态"
                       width="110"
                       header-align="center"
                       align="center"
                       filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
              :type="getStatus(scope.row)"
              disable-transitions>{{scope.row.statusCode}}</el-tag>
        </template>
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
                       label="操作"
                       fixed="right"
                       width="180"
                        >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
          &nbsp;
          <el-popconfirm
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              :title="'确定删除案例'+scope.row.title+' 吗？'"
              @confirm="del(scope.row)"
          >
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
          </el-popconfirm>
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
import {getMycase,delCase} from "@/api/api";
export default {
  name: "MyCase",
  methods:{
    del(row){
      const token=localStorage.getItem("uToken")
      if(token===undefined||token===null||token===""){
        alert("请先登录")
        return
      }
      const config={
        url:delCase,
        method: "get",
        headers:{
          "Token": token
        },
        params:{
          "id": row.id
        }
      }
      request(config).then((data)=>{
        if(data.data.code===0){
          alert("删除成功")
          for(let i in this.tableData){
            if(this.tableData[i].id===row.id){
              this.tableData.splice(i,1)
              break
            }
          }
        }
      }).catch((err)=>{
        console.log(err)
        alert("服务器开小差了")
      })
    },
    edit(row){
      let routeUrl = this.$router.resolve({
        path: "/editCase/"+row.id,
      });
      window.open(routeUrl.href, '_blank')
    },
    toAddcase(){
      let routeUrl = this.$router.resolve({
        path: "/addcases",
      });
      window.open(routeUrl.href, '_blank')
    },
    getStatus(row){
      if(row.statusCode==='已发布'){
        return 'success'
      }else if(row.statusCode==='待审核'){
        return 'primary'
      }else{
        return 'danger'
      }
    },
    current_change:function(currentPage){
      this.currentPage = currentPage;
    },
    toCasedetail(id){
      let routeUrl = this.$router.resolve({
        path: "/casedetail",
        query: {id:id}
      });
      window.open(routeUrl.href, '_blank')
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
      url: getMycase,
      method: 'get',
      headers:{
        "Token":token
      }
    }
    request(config).then((data)=>{
      if(data.data.code===0){
        this.tableData=data.data.data.map((cas)=>{
          if(cas.statusCode===1){
            cas.statusCode="已发布"
          }else if(cas.statusCode===0){
            cas.statusCode="待审核"
          }else{
            cas.statusCode="审核不通过"
          }
          return cas
        })
        this.total=this.tableData.length
      }else {
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