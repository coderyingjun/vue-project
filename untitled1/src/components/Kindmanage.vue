<template>
  <div>
    <el-row style="margin-left: 14%;height: 1%;line-height: 90px" >
      <el-col :span="2" style="text-align: right;margin-left: 3%" >搜索：</el-col>
      <el-col :span="5" >
        <el-input type="text" v-model="search" placeholder="类名" @keyup.native="find"></el-input>
      </el-col>
      <el-col :span="4" >
        <el-button size="medium" style="margin-left: 150%" @click.native="showAdd">添加类别</el-button>
      </el-col>
    </el-row>
    <el-dialog  :visible.sync="addFormVisible" >
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="name"  :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="addForm.name" type="text"  autocomplete="off" placeholder="类名"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add">确 定 添 加</el-button>
      </div>
    </el-dialog>
    <el-dialog  :visible.sync="editFormVisible" >
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px" class="demo-ruleForm">
        <el-form-item   :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="editForm.id" type="text"  autocomplete="off" placeholder="编号" disabled></el-input>
        </el-form-item>
        <el-form-item  prop="name" :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="editForm.name" type="text"  autocomplete="off" placeholder="类别名" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit">保 存 修 改</el-button>
      </div>
    </el-dialog>
    <el-table  :data.sync="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 55%;margin-left: 18%;line-height: 30px" border stripe>
      <el-table-column prop="id"
                       label="编号" width="140"
                       header-align="center"
                       align="center"
      ></el-table-column>
      <el-table-column prop="name"
                       label="类名" width="180"
                       header-align="center"
                       align="center">
      </el-table-column>
      <el-table-column prop="num"
                       label="附属案例个数"
                       width="180"
                       sortable
                       header-align="center"
                       align="center">
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row)">编辑</el-button>
          &nbsp;
          <el-popconfirm
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              :title="'确定删除 '+scope.row.name+' 这类别吗'"
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
import {addKind,editKind,getKinds,delKind} from "@/api/api";
import Vue from 'vue'
export default {
  name: "Kindmanage",
  data(){
    return {
      addFormVisible: false,
      editFormVisible: false,
      addForm:{
        name:"",
      },
      editForm:{
        id:"",
        name:"",
      },
      addRules:{
        name: [{required: true, message: '请输入类名', trigger: 'blur'}],
      },
      editRules:{
        name:[{required: true, message: '请输入类名', trigger: 'blur'}]
      },
      tableData: [],
      search: "",
      allData: [],
      total: 8,
      pagesize:7,
      pagesizes:[7,16,20],
      currentPage:1
    }
  },
  methods:{
    current_change:function(currentPage){
      this.currentPage = currentPage;
    },
    find(){
      if(this.search===""){
        this.tableData=this.allData
        this.total=this.tableData.length
      }
      else{
        this.tableData=this.allData.filter(i=>{
          return i.name.indexOf(this.search)>-1
        })
      }
      this.total=this.tableData.length
    },
    showAdd(){
      this.addForm.name=""
      this.addFormVisible=true
    },
    add(){
      this.$refs.addForm.validate((valid)=>{
        if(valid){
          const config={
            url:addKind,
            method: "post",
            headers:{
              "Token": this.$store.state.token
            },
            data:{
              name:this.addForm.name,
            }
          }
          request(config).then((data)=>{
            if(data.data.code===0){
              alert("类别添加成功")
              this.allData=data.data.data
              this.tableData=this.allData
              this.total=this.tableData.length
              this.find()
            }else{
              alert(data.data.message)
            }
          }).catch(()=>{
            alert("服务器开小差了")
          })
        }
      })
    },
    showEdit(row){
      this.editForm.id=row.id
      this.editForm.name=row.name
      this.editFormVisible=true
    },
    edit(){
      this.$refs.editForm.validate((valid)=>{
        if(valid){
          const config={
            url:editKind,
            method: "post",
            headers:{
              "Token": this.$store.state.token
            },
            data:{
              id:this.editForm.id,
              name:this.editForm.name,
            }
          }
          request(config).then((data)=>{
            if(data.data.code===0){
              alert("类别修改成功")
              let field=data.data.data;
              for(let i in this.allData){
                if(this.allData[i].id===field.id){
                  Vue.set(this.allData[i],"name",field.name)
                  break
                }
              }
              this.find()
            }else{
              alert(data.data.message)
            }
          }).catch(()=>{
            alert("服务器开小差啦")
          })
        }
      })
    },
    del(row){
      const config={
        url:delKind,
        method: "get",
        headers:{
          "Token": this.$store.state.token
        },
        params:{
          "id": row.id
        }
      }
      request(config).then((data)=>{
        if(data.data.code===0){
          alert("删除成功")
          for(let i in this.allData){
            if(this.allData[i].id===row.id){
              this.allData.splice(i,1)
              break
            }
          }
          this.find()
        }else{
          alert(data.data.message)
        }
      }).catch(()=>{
        alert("服务器开小差了")
      })
    }
  },
  mounted() {
    const token=localStorage.getItem("adminToken")
    if(token==null||token===""){
      alert("请先登录")
      this.$router.push("/login")
    }
    const config={
      url: getKinds,
      method: 'get',
      headers: {
        "Token": token
      }
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