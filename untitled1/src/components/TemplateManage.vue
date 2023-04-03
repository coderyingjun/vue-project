<template>
  <div>
    <el-row style="margin-left: 14%;height: 1%;line-height: 90px" >
      <el-col :span="2" style="text-align: right;margin-left: 3%" >搜索：</el-col>
      <el-col :span="5" >
        <el-input type="text" v-model="search" placeholder="类名" @keyup.native="find"></el-input>
      </el-col>
      <el-col :span="5" >
        <el-button size="medium"  @click.native="showCaseForm">使用模板</el-button>
      </el-col>
      <el-col :span="4" >
        <el-button size="medium" style="margin-left: 20%" @click.native="showAdd">添加模板</el-button>
      </el-col>
    </el-row>
    <el-dialog  :visible.sync="addFormVisible" >
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="name"  :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="addForm.name" type="text"  autocomplete="off" placeholder="模板名"></el-input>
        </el-form-item>
        <el-form-item prop="titleRule"  :label-width="'10'"  style="width: 100%;"  >
          <el-input placeholder="如标题的html标签为h1中且区分属性为clss=title，则规则为h1,class=title" v-model="addForm.titleRule">
            <template slot="prepend">标题规则：</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="contentRule"  :label-width="'10'"  style="width: 100%;"  >
          <el-input placeholder="如文章内容的html标签为div中且区分属性为clss=content，则规则为div,class=title" v-model="addForm.contentRule">
            <template slot="prepend">内容规则：</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add">确 定 添 加</el-button>
      </div>
    </el-dialog>
    <el-dialog  :visible.sync="caseFormVisible" >
      <el-form ref="caseForm" :model="caseForm" :rules="caseRules" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="url"  :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="caseForm.url" type="text"  autocomplete="off" placeholder="案例链接"></el-input>
        </el-form-item>
        <el-form-item prop="tid" style="margin-left: -13%">
          <el-select v-model="caseForm.tid" filterable placeholder="请选择模板" >
            <el-option
                v-for="item in allData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sid"  :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-form-item  prop="subject" >
            <el-cascader v-model="caseForm.sid"
                         placeholder="请选择学科"
                         :options="subjects"
                         filterable></el-cascader>
          </el-form-item>
        </el-form-item>
        <el-form-item prop="kid" style="margin-left: -13%">
          <el-select v-model="caseForm.kid" filterable placeholder="请选择类别" >
            <el-option
                v-for="item in classes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: -15%">
          <el-switch
              style="display: block"
              v-model="caseForm.statusCode"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value= 1
              inactive-value= 0
              active-text="发布"
              inactive-text="待发布">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCase">确 定 添 加</el-button>
      </div>
    </el-dialog>
    <el-dialog  :visible.sync="editFormVisible" >
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px" class="demo-ruleForm">
        <el-form-item   :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="editForm.id" type="text"  autocomplete="off" placeholder="编号" disabled></el-input>
        </el-form-item>
        <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px" class="demo-ruleForm">
          <el-form-item prop="name"  :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
            <el-input v-model="editForm.name" type="text"  autocomplete="off" placeholder="模板名"></el-input>
          </el-form-item>
          <el-form-item prop="titleRule"  :label-width="'10'"  style="width: 100%;"  >
            <el-input placeholder="如标题的html标签为h1中且区分属性为clss=title，则规则为h1,class=title" v-model="editForm.titleRule">
              <template slot="prepend">标题规则：</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="contentRule"  :label-width="'10'"  style="width: 100%;"  >
            <el-input placeholder="如文章内容的html标签为div中且区分属性为clss=content，则规则为div,class=title" v-model="editForm.contentRule">
              <template slot="prepend">内容规则：</template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit">保 存 修 改</el-button>
      </div>
    </el-dialog>
    <el-table  :data.sync="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 65%;margin-left: 15%;line-height: 30px" border stripe>
      <el-table-column prop="id"
                       label="编号" width="140"
                       header-align="center"
                       align="center"
      ></el-table-column>
      <el-table-column prop="name"
                       label="模板名称" width="120"
                       header-align="center"
                       align="center">
      </el-table-column>
      <el-table-column prop="author"
                       label="创建者" width="120"
                       header-align="center"
                       align="center">
      </el-table-column>
      <el-table-column prop="rule"
                       label="规则" width="180"
                       header-align="center"
                       align="center">
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row)">编辑</el-button>
          &nbsp;
          <el-popconfirm
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              :title="'确定删除 '+scope.row.name+' 这一模板吗'"
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
import {addTemplate, eidtTemplate, getTemplate, delTemplate, getSubjects, getKinds,addCaseByUrl} from "@/api/api";
import Vue from 'vue'
export default {
  name: "Templatemanage",
  data(){
    return {
      caseFormVisible:false,
      subjects:[],
      classes:[],
      addFormVisible: false,
      editFormVisible: false,
      caseForm:{
        url:"",
        tid:"",
        sid:"",
        kid:"",
        statusCode:'0',
      },caseRules:{
        url:[{required: true, message: '请输入文章地址', trigger: 'blur'}],
        tid: [{required: true, message: '请选择模板', trigger: 'blur'}],
        sid: [{required: true, message: '请选择学科', trigger: 'blur'}],
        kid: [{required: true, message: '请选择类别', trigger: 'blur'}],
      },
      addForm:{
        name:"",
        titleRule:"",
        contentRule:"",
      },
      editForm:{
        id:"",
        name:"",
        titleRule:"",
        contentRule:"",
      },
      addRules:{
        name: [{required: true, message: '请输入类名', trigger: 'blur'}],
        titleRule: [{required: true, message: '请输入标题规则', trigger: 'blur'}],
        contentRule: [{required: true, message: '请输入内容规则', trigger: 'blur'}],
      },
      editRules:{
        name:[{required: true, message: '请输入类名', trigger: 'blur'}],
        titleRule: [{required: true, message: '请输入标题规则', trigger: 'blur'}],
        contentRule: [{required: true, message: '请输入内容规则', trigger: 'blur'}],
      },
      tableData: [],
      search: "",
      allData: [],
      total: 8,
      pagesize:10,
      pagesizes:[10,16,20],
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
    showCaseForm(){
      this.caseForm.url=""
      this.caseForm.tid=""
      this.caseForm.sid=""
      this.caseForm.kid=""
      this.caseForm.statusCode="0"
      this.caseFormVisible=true
    },
    addCase(){
      this.$refs.caseForm.validate((valid)=>{
        if(valid){
          const config={
            url:addCaseByUrl,
            method: "post",
            headers:{
              "Token": this.$store.state.token
            },
            data:{
              url:this.caseForm.url,
              tid:this.caseForm.tid,
              sid:this.caseForm.sid[1],
              kid:this.caseForm.kid,
              statusCode:this.caseForm.statusCode
            }
          }
          request(config).then((data)=>{
            if(data.data.code===0){
              alert(data.data.message)
            }else{
              alert(data.data.message)
            }
          }).catch(()=>{
            alert("服务器开小差了")
          })
        }
      })
    },
    showAdd(){
      this.addForm.name=""
      this.addForm.titleRule=""
      this.addForm.contentRule=""
      this.addFormVisible=true
    },
    add(){
      this.$refs.addForm.validate((valid)=>{
        if(valid){
          const config={
            url:addTemplate,
            method: "post",
            headers:{
              "Token": this.$store.state.token
            },
            data:{
              name:this.addForm.name,
              rule:this.addForm.titleRule+";"+this.addForm.contentRule
            }
          }
          request(config).then((data)=>{
            if(data.data.code===0){
              alert(data.data.message)
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
      const rule=row.rule.split(";")
      this.editForm.titleRule=rule[0]
      this.editForm.contentRule=rule[1]
      this.editFormVisible=true
    },
    edit(){
      this.$refs.editForm.validate((valid)=>{
        if(valid){
          const config={
            url:eidtTemplate,
            method: "post",
            headers:{
              "Token": this.$store.state.token
            },
            data:{
              id:this.editForm.id,
              name:this.editForm.name,
              rule:this.editForm.titleRule+";"+this.editForm.contentRule
            }
          }
          request(config).then((data)=>{
            if(data.data.code===0){
              alert(data.data.message)
              let tmpt=data.data.data;
              for(let i in this.allData){
                if(this.allData[i].id===tmpt.id){
                  Vue.set(this.allData[i],"name",tmpt.name)
                  Vue.set(this.allData[i],"rule",tmpt.rule)
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
        url:delTemplate,
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
      url: getTemplate,
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
      url:getSubjects,
      method: 'get'
    }
    request(config1).then((data)=>{
      if(data.data.code===0){
        for(let i of data.data.data){
          const subject={value:i.id,
            label:i.name,
            children:[]}
          for(let j of i.subjects){
            const child={value:j.id,
              label:j.name}
            subject.children.push(child)
          }
          this.subjects.push(subject)
        }
      }else{
        alert("获取学科失败，请刷新重试")
      }
    }).catch(()=>{
      alert("服务器开小差了，请刷新重试")
    })
    const config2={
      url: getKinds,
      method: 'get',
    }
    request(config2).then((data)=>{
      if(data.data.code===0){
        this.classes=data.data.data.map((Kind)=>{
          Vue.set(Kind,'label',Kind.name)
          Vue.set(Kind,'value',Kind.id)
          return Kind
        })
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