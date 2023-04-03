<template>
  <div>
    <el-row style="margin-left: 14%;height: 1%;line-height: 90px" >
      <el-col :span="2" style="text-align: right;margin-left: 3%" >搜索：</el-col>
      <el-col :span="5" >
        <el-input type="text" v-model="search" placeholder="角色名" @keyup.native="find"></el-input>
      </el-col>
      <el-col :span="4" >
        <el-button size="medium" style="margin-left: 150%" @click.native="showAdd">添加角色</el-button>
      </el-col>
    </el-row>
    <el-dialog  :visible.sync="addFormVisible" >
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="name"  :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="addForm.name" type="text"  autocomplete="off" placeholder="角色名"></el-input>
        </el-form-item>
        <el-checkbox-group
            v-model="addForm.permissions" style="line-height: 30px">
          <el-checkbox v-for="pem in permissions"   :label="pem.id" :key="pem.id" >{{pem.name}}</el-checkbox>
        </el-checkbox-group>
        <el-input style="width: 60%"  maxlength="60" v-model="addForm.description"  type="textarea" autosize autocomplete="off" placeholder="角色描述" ></el-input>
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
          <el-input v-model="editForm.name" type="text"  autocomplete="off" placeholder="角色名" ></el-input>
        </el-form-item>
        <el-checkbox-group
            v-model="editForm.permissions" style="line-height: 30px">
          <el-checkbox v-for="pem in permissions"  pem.id :label="pem.id" :key="pem.id" >{{pem.name}}</el-checkbox>
        </el-checkbox-group>
        <el-input style="width: 60%"  maxlength="60" v-model="editForm.description"  type="textarea" autosize autocomplete="off" placeholder="角色描述" ></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit">保 存 修 改</el-button>
      </div>
    </el-dialog>
    <el-table  :data.sync="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 55%;margin-left: 20%;line-height: 30px" border stripe>
      <el-table-column prop="id"
                       label="编号" width="140"
                       header-align="center"
                       align="center"
      ></el-table-column>
      <el-table-column prop="name"
                       label="角色名" width="180"
                       header-align="center"
                       align="center">
      </el-table-column>
      <el-table-column prop="description"
                       label="描述"
                       width="200"
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
              :title="'确定删除 '+scope.row.name+' 这一角色吗'"
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
import {addRole,editRole,getRoles,getPem,delRole} from "@/api/api";
export default {
  name: "RoleManage",
  data(){
    return {
      permissions:[],
      addFormVisible: false,
      editFormVisible: false,
      addForm:{
        name:"",
        permissions:[],
        description:""
      },
      editForm:{
        id:"",
        name:"",
        permissions:[],
        description:""
      },
      addRules:{
        name: [{required: true, message: '请输入角色名', trigger: 'blur'}],
      },
      editRules:{
        name:[{required: true, message: '请输入角色名', trigger: 'blur'}]
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
      this.addForm.description=""
      this.addForm.permissions=[]
      this.addFormVisible=true
    },
    add(){
      this.$refs.addForm.validate((valid)=>{
        if(valid){
          const config={
            url:addRole,
            method: "get",
            headers:{
              "Token": this.$store.state.token
            },
            params:{
              name:this.addForm.name,
              description:this.addForm.description,
              permissions:this.addForm.permissions.toString()
            }
          }
          request(config).then((data)=>{
            if(data.data.code===0){
              alert("角色添加成功")
              this.allData=data.data.data
              this.tableData=this.allData
              this.total=this.tableData.length
              this.find()
            }else{
              alert(data.data.message)
            }
          })
        }
      })
    },
    showEdit(row){
      this.editForm.id=row.id
      this.editForm.name=row.name
      this.editForm.description=row.description
      console.log(row)
      const permission=[]
      for(let i of row.permissions){
        permission.push(i.id)
      }
      this.editForm.permissions=permission
      this.editFormVisible=true
    },
    edit(){
      this.$refs.editForm.validate((valid)=>{
        if(valid){
          const role={
            id:this.editForm.id,
            name:this.editForm.name,
            description:this.editForm.description,
            permissions:this.editForm.permissions.toString()
          }
          const config={
            url:editRole,
            method: "get",
            headers:{
              "Token": this.$store.state.token
            },
            params:role
          }
          request(config).then((data)=>{
            if(data.data.code===0){
              alert("角色修改成功")
              this.allData=data.data.data
              this.tableData=this.allData
              this.total=this.tableData.length
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
        url:delRole,
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
      url: getRoles,
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
    const config1={
      url: getPem,
      method: 'get',
      headers: {
        "Token": token
      }
    }
    request(config1).then((data)=>{
      if(data.data.code===0){
        this.permissions=data.data.data
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