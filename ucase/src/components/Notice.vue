<template>
  <div>
    <el-dialog  :visible.sync="noticeVisible" >
      <el-form ref="editForm"  label-width="100px" class="demo-ruleForm">
        <el-form-item   :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="notice.author" type="text"  autocomplete="off" placeholder="发布者" disabled></el-input>
        </el-form-item>
        <el-form-item  prop="title" :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="notice.title" type="text"  readonly autocomplete="off" placeholder="公告标题" ></el-input>
        </el-form-item>
        <el-form-item  prop="content" :label-width="'10'"  style="width: 50%;margin-left: 25%"  >
          <el-input v-model="notice.content"  type="textarea"  readonly  autosize autocomplete="off" placeholder="公告内容" ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <h1 style="margin-top: 25px">案例库公告</h1>
    <el-table  :data.sync="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 682px;margin-left: 30%;margin-top: 45px" border stripe>
      <el-table-column prop="title"
                       label="标题" width="250"
                       header-align="center"
                       align="center">
        <template slot-scope="scope">
          <el-link  @click="getNotice(scope.row.id)">{{ scope.row.title }}</el-link >
        </template>
      </el-table-column>
      <el-table-column prop="createTime"
                       label="创建时间"
                       width="180"
                       header-align="center"
                       align="center">
      </el-table-column>
      <el-table-column prop="author"
                       label="发布者"
                       width="250"
                       header-align="center"
                       align="center">
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;margin-right: 16%">
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
import {getNotices,getNotice} from "@/api/api";
import {request} from "@/network/request";

export default {
name: "Notice",
  methods:{
    getNotice(id){
      const config={
        url:getNotice,
        method:"get",
        params:{
          "id":id
        }
      }
      request(config).then((data)=>{
        if(data.data.code===0){
          this.notice=data.data.data
          this.noticeVisible=true
        }else {
          alert(data.data.message)
        }
      }).catch(()=>{
        alert("服务器开小差了")
      })
    },
    current_change:function(currentPage){
      this.currentPage = currentPage;
    }
  },
  data(){
    return {
      notice:{},
      noticeVisible:false,
      tableData: [],
      allData: [],
      total: 0,
      pagesize:7,
      pagesizes:[7,16,20],
      currentPage:1
    }
  },
  beforeCreate() {
    const config={
      url: getNotices,
      method: 'get',
    }
    request(config).then((data)=>{
      if(data.data.code===0){
        this.allData=data.data.data
        this.tableData=this.allData
        this.total=this.tableData.length
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