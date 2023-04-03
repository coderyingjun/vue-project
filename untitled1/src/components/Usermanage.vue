<template>
  <div>
  <el-row style="margin: 0;height: 1%;line-height: 90px" >
    <el-col :span="2" style="text-align: right;margin-left: 3%" >搜索：</el-col>
    <el-col :span="8" >
      <el-input type="text" v-model="search" placeholder="用户名/姓名" @keyup.enter.native="find"></el-input>
    </el-col>
    <el-col :span="4" >
      <el-button size="medium" style="margin-left: 150%" @click.native="showAdd">添加用户</el-button>
    </el-col>
  </el-row>
    <el-dialog  :visible.sync="addFormVisible" >
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="username"  :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="addForm.username" type="text"  autocomplete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item  prop="password" :label-width="'10'" style="width: 25%;margin-left: 35%">
          <el-input v-model="addForm.password" placeholder="密码" type="password"  autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item  prop="rpt" :label-width="'10'" style="width: 25%;margin-left: 35%">
          <el-input v-model="addForm.rpt" placeholder="请重复输入密码" type="password"  autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item  prop="name" :label-width="'10'" style="width: 25%;margin-left: 35%">
          <el-input v-model="addForm.name" placeholder="姓名" type="text"  autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item  prop="point" :label-width="'10'" style="width: 25%;margin-left: 35%">
          <el-input v-model.number="addForm.point" placeholder="初始积分" type="text"  autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item  :label-width="'10'" style="width: 25%;margin-left: 35%">
        </el-form-item>
        <el-form-item style="margin-left: -15%">
             <el-switch
              style="display: block"
              v-model="addForm.statusCode"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value= 1
              inactive-value= 0
              active-text="启用"
              inactive-text="锁定">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add">确 定 添 加</el-button>
      </div>
    </el-dialog>
    <el-dialog  :visible.sync="editFormVisible" >
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名"  :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="editForm.username" type="text"  autocomplete="off" placeholder="用户名" disabled></el-input>
        </el-form-item>
        <el-form-item  label="姓名" prop="name" :label-width="'10'" style="width: 25%;margin-left: 35%">
          <el-input v-model="editForm.name" placeholder="姓名" type="text"  autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item  label="积分" prop="point" :label-width="'10'" style="width: 25%;margin-left: 35%">
          <el-input v-model.number="editForm.point" placeholder="积分" type="text"  autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item style="margin-left: -15%">
          <el-switch
              style="display: block"
              v-model="editForm.statusCode"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value= 1
              inactive-value= 0
              active-text="启用"
              inactive-text="锁定">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetPwd">重置密码</el-button>
        <el-button type="primary" @click="edit">保 存 修 改</el-button>
      </div>
    </el-dialog>
    <el-dialog  :visible.sync="roleFormVisable" >
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名"  :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="roleForm.username" type="text"  autocomplete="off" placeholder="用户名" disabled></el-input>
        </el-form-item>
        <el-form-item   :label-width="'10'"  style="">
          <el-checkbox-group v-model="roleForm.roleList" style="line-height: 30px;float: left;">
            <el-checkbox v-for="role in roleList"  :label="role.value" :key="role.value" >{{role.text}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editURole">保 存 修 改</el-button>
      </div>
    </el-dialog>
  <el-table  :data.sync="tableData"
             style="width: 90%;margin-left: 5%;line-height: 30px" border stripe
             >
    <el-table-column prop="id"
                     label="编号" width="100"
                     header-align="center"
                     align="center"
    ></el-table-column>
    <el-table-column prop="username"
                     label="用户名" width="160"
                     header-align="center"
                     align="center">
    </el-table-column>
    <el-table-column prop="name"
                     label="姓名"
                     width="140"
                     header-align="center"
                     align="center">
    </el-table-column>
    <el-table-column prop="createTime"
                     label="注册时间"
                     width="230"
                     header-align="center"
                     align="center">
    </el-table-column>
    <el-table-column prop="statusCode"
                     label="账户状态"
                     width="120"
                     header-align="center"
                     align="center"
                     :filters="[{ text: '启用', value: '启用' }, { text: '锁定', value: '锁定' }]"
                     :filter-method="filterStatus"
                     filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag
            :type="scope.row.statusCode === '启用' ? 'success' : 'danger'"
            disable-transitions>{{scope.row.statusCode}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="roles"
                     label="用户身份"
                     width="150"
                     header-align="center"
                     align="center"
                     :filters="roleList"
                     :filter-method="filterRole"
                     filter-placement="bottom-end">
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
            :title="'确定删除用户'+scope.row.username+' 吗？'"
            @confirm="del(scope.row)"
        >
        <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
        </el-popconfirm>
        &nbsp;
        <el-button type="primary" icon="el-icon-s-tools" size="mini" @click="showRole(scope.row)">配置</el-button>
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
</template>

<script>
import {request} from "@/network/request";
import {
  addUser,
  getUserByPage,
  resetPwd,
  editUser,
  delUser,
  getRoleList,
  editUserRole,
  getUsernum
} from "@/api/api";
import Vue from 'vue'
export default {
  name: "Usermanage",
  data(){
    return {
      token:"",
      roleList:[],
      roles:[{
        value: 1,
        label: '用户'
      }],
      addFormVisible: false,
      editFormVisible: false,
      roleFormVisable:false,
      roleForm:{
        id:0,
        username:"",
        roleList:[]
      },
      addForm:{
        username:"",
        password:"",
        rpt:"",
        name:"",
        point:"",
        roleCode: 1,
        statusCode: "1",
      },
      editForm:{
        id:"",
        username:"",
        password:"",
        name:"",
        point:"",
        roleCode: 1,
        statusCode: "1",
      },
      addRules:{
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        point: [{required: true, message: '请输入初始积分', trigger: 'blur'},{type: 'number',message:'积分应为整数数字'}],
        rpt:[{required: true, message: '请重复输入密码', trigger: 'blur'}],
        name:[{required: true, message: '请输入姓名', trigger: 'blur'}],
      },
      editRules:{
        point: [{required: true, message: '请输入初始积分', trigger: 'blur'},{type: 'number',message:'积分应为整数数字'}],
        name:[{required: true, message: '请输入姓名', trigger: 'blur'}]
      },
      tableData: [],
      search: "",
      allData: [],
      total: 0,
      pagesize:10,
      pagesizes:[10,20,30],
      currentPage:1
    }
  },
  methods:{
    changeSize(){
      this.currentPage=1
      this.current_change(this.currentPage)
    },
    filterRole(value, row){
      for(let i of row.roleValue){
        if(value===i){
          return true
        }
      }
      return false
    },
    filterStatus(value, row){
      return row.statusCode === value
    },
    current_change:function(currentPage){
      let params={
        page:currentPage,
        size:this.pagesize
      }
      if(this.search !== ""){
        Vue.set(params,"key",this.search)
      }
      const config={
        url: getUserByPage,
        method: 'get',
        headers: {
          "Token": this.token
        },
        params:params
      }
      request(config).then((data)=>{
        if(data.data.code===0){
          this.tableData=data.data.data.map((user)=>{
            user.roleValue=[]
            for(let i of user.roles){
              user.roleValue.push(i.id)
            }
            let r=""
            for(let i of user.roles){
              r = r+i.name+";"
            }
            user.roles=r
            user.roles=user.roles.toString()
            if(user.statusCode===0){
              user.statusCode="锁定"
            }else{
              user.statusCode="启用"
            }
            return user
          })
        } else {
          alert(data.data.message)
        }
      }).catch(()=>{
        alert("服务器开小差啦")
      })
      this.currentPage = currentPage;
    },
    find(){
      if(this.search !==""){
        const param={
          page:1,
          size:this.pagesize,
          key:this.search
        }
        const config={
          url: getUserByPage,
          method: 'get',
          headers: {
            "Token": this.token
          },
          params:param
        }
        request(config).then((data)=>{
          if(data.data.code===0){
            this.tableData=data.data.data.map((user)=>{
              user.roleValue=[]
              for(let i of user.roles){
                user.roleValue.push(i.id)
              }
              let r=""
              for(let i of user.roles){
                r = r+i.name+";"
              }
              user.roles=r
              user.roles=user.roles.toString()
              if(user.statusCode===0){
                user.statusCode="锁定"
              }else{
                user.statusCode="启用"
              }
              return user
            })
            this.allData=this.tableData
            const conf={
              url: getUsernum,
              method: 'get',
              headers: {
                "Token": this.token
              },
              params:{
                key:this.search
              }
            }
            request(conf).then((data)=>{
              if(data.data.code===0){
                this.total=data.data.data
              }else {
                alert(data.data.message)
                this.total=this.tableData.length
              }
            }).catch(()=>{
              alert("服务器开小差啦")
            })
          }else {
            alert(data.data.message)
          }
        }).catch(()=>{
          alert("服务器开小差啦")
        })
        this.currentPage = 1;
      }
      else {
        const param={
          page:1,
          size:this.pagesize
        }
        const config={
          url: getUserByPage,
          method: 'get',
          headers: {
            "Token": this.token
          },
          params:param
        }
        request(config).then((data)=>{
          if(data.data.code===0){
            this.allData=data.data.data.map((user)=>{
              user.roleValue=[]
              for(let i of user.roles){
                user.roleValue.push(i.id)
              }
              let r=""
              for(let i of user.roles){
                r = r+i.name+";"
              }
              user.roles=r
              user.roles=user.roles.toString()
              if(user.statusCode===0){
                user.statusCode="锁定"
              }else{
                user.statusCode="启用"
              }
              return user
            })
            this.tableData=this.allData
            const conf={
              url: getUsernum,
              method: 'get',
              headers: {
                "Token": this.token
              },
            }
            request(conf).then((data)=>{
              if(data.data.code===0){
                this.total=data.data.data
              }else {
                alert(data.data.message)
                this.total=this.tableData.length
              }
            }).catch(()=>{
              alert("服务器开小差啦")
            })
          }else{
            alert(data.data.message)
          }
        }).catch(()=>{
          alert("服务器开小差了")
        })
      }
    },
    showAdd(){
      this.addForm.username=""
      this.addForm.password=""
      this.addForm.rpt=""
      this.addForm.name=""
      this.addForm.point=""
      this.addForm.roleCode= 1
      this.addForm.statusCode= "1"
      this.addFormVisible=true
    },
    add(){
      this.$refs.addForm.validate((valid)=>{
        if(valid){
          if(this.addForm.password!==this.addForm.rpt){
            alert("两次密码输入不相同，请确认")
          }else{
            const config={
              url:addUser,
              method: "post",
              headers:{
                "Token": this.$store.state.token
              },
              data:{
                username:this.addForm.username,
                password:this.addForm.password,
                rpt:this.addForm.rpt,
                name:this.addForm.name,
                point:this.addForm.point,
                roleCode:this.addForm.roleCode,
                statusCode:this.addForm.statusCode
              }
            }
            request(config).then((data)=>{
              if(data.data.code===0){
                alert("用户添加成功")
                let user=data.data.data;
                if(user.statusCode===0){
                  user.statusCode="锁定"
                }else{
                  user.statusCode="启用"
                }
                this.allData=data.data.data.map((user)=>{
                  user.roleValue=[]
                  for(let i of user.roles){
                    user.roleValue.push(i.id)
                  }
                  let r=""
                  for(let i of user.roles){
                    r = r+i.name+";"
                  }
                  user.roles=r
                  user.roles=user.roles.toString()
                  if(user.statusCode===0){
                    user.statusCode="锁定"
                  }else{
                    user.statusCode="启用"
                  }
                  return user
                })
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
        }
      })
    },
    showEdit(row){
      this.editFormVisible=true
      this.editForm.id=row.id
      this.editForm.username=row.username
      this.editForm.name=row.name
      this.editForm.point=row.point
      if(row.statusCode==="锁定"){
        this.editForm.statusCode="0"
      }else{
        this.editForm.statusCode="1"
      }
    },
    showRole(row){
      this.roleForm.id=row.id
      this.roleForm.username=row.username
      this.roleForm.roleList=row.roleValue
      this.roleFormVisable=true
    },
    editURole(){
      const config={
        url:editUserRole,
        method: "get",
        headers:{
          "Token": this.$store.state.token
        },
        params:{
          id:this.roleForm.id,
          roles:this.roleForm.roleList.toString()
        }
      }
      request(config).then((data)=>{
        if(data.data.code===0){
          alert("用户角色分配成功")
          for(let i in this.allData){
            if(this.allData[i].id===this.roleForm.id){
              Vue.set(this.allData[i],"roleValue",this.roleForm.roleList)
              let r=""
              for(let i of this.roleForm.roleList){
                for(let j of this.roleList){
                  if(j.value===i){
                    r=r+j.text+";"
                  }
                }
              }
              Vue.set(this.allData[i],"roles",r)
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

    },
    resetPwd(){
      const config={
        method:'get',
        url:resetPwd,
        headers:{
          "Token": localStorage.getItem("adminToken")
        },
        params:{
          id: this.editForm.id
        }
      }
      request(config).then((data)=>{
        alert(data.data.message)
      }).catch(()=>{
        alert("服务器开小差了")
      })
    },
    edit(){
      this.$refs.editForm.validate((valid)=>{
        if(valid){
            const config={
              url:editUser,
              method: "post",
              headers:{
                "Token": this.$store.state.token
              },
              data:{
                id:this.editForm.id,
                username:this.editForm.username,
                name:this.editForm.name,
                point:this.editForm.point,
                statusCode:this.editForm.statusCode
              }
            }
            request(config).then((data)=>{
              if(data.data.code===0){
                alert("用户修改成功")
                let user=data.data.data;
                if(user.statusCode===0){
                  user.statusCode="锁定"
                }else{
                  user.statusCode="启用"
                }
                for(let i in this.allData){
                  if(this.allData[i].id===user.id){
                    Vue.set(this.allData[i],"name",user.name)
                    Vue.set(this.allData[i],"statusCode",user.statusCode)
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
        url:delUser,
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
            if(this.tableData[i].id===row.id){
              this.tableData.splice(i,1)
              if(this.tableData.length===0){
                if(this.currentPage>1){
                  this.currentPage=this.currentPage-1
                  this.current_change(this.currentPage)
                }
              }
              this.total=this.total-1
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
      this.$router.push("/login")
    }
    this.token=token
    const param={
      page:1,
      size:this.pagesize
    }
    const config={
      url: getUserByPage,
      method: 'get',
      headers: {
        "Token": token
      },
      params:param
    }
    request(config).then((data)=>{
      if(data.data.code===0){
        this.allData=data.data.data.map((user)=>{
          user.roleValue=[]
          for(let i of user.roles){
            user.roleValue.push(i.id)
          }
          let r=""
          for(let i of user.roles){
            r = r+i.name+";"
          }
          user.roles=r
          user.roles=user.roles.toString()
          if(user.statusCode===0){
            user.statusCode="锁定"
          }else{
            user.statusCode="启用"
          }
          return user
        })
        this.tableData=this.allData
        const conf={
          url: getUsernum,
          method: 'get',
          headers: {
            "Token": token
          },
        }
        request(conf).then((data)=>{
          if(data.data.code===0){
            this.total=data.data.data
          }else {
            alert(data.data.message)
            this.total=this.tableData.length
          }
        }).catch(()=>{
          alert("服务器开小差啦")
        })
      }else{
        alert(data.data.message)
      }
    }).catch(()=>{
      alert("服务器开小差了")
    })
    const config1={
      url: getRoleList,
      method: 'get',
      headers: {
        "Token": token
      }
    }
    request(config1).then((data)=>{
      if(data.data.code===0){
        this.roleList=data.data.data
      }else{
        alert(data.data.message)
      }
    }).catch(()=>{
      alert("角色获取失败，服务器开小差了")
    })
  }
}
</script>
.el-table .warning-row {
  background: oldlace;
}
<style scoped>

</style>