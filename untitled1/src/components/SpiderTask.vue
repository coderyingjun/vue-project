<template>
  <div>
    <el-row style="margin: 0;height: 1%;line-height: 90px" >
      <el-col :span="2" style="text-align: right;margin-left: 3%" >搜索：</el-col>
      <el-col :span="8" >
        <el-input type="text" v-model="search" placeholder="关键词" @keyup.native="find"></el-input>
      </el-col>
      <el-col :span="4" >
        <el-button size="medium" style="margin-left: 150%" @click.native="toAdd">制定爬虫任务</el-button>
      </el-col>
    </el-row>
    <el-dialog  :visible.sync="formVisible" >
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="keyword"  :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="addForm.keyword" type="text"  autocomplete="off" placeholder="检索关键词"></el-input>
        </el-form-item>
        <el-form-item prop="sid"  :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-form-item  prop="subject" >
            <el-cascader v-model="addForm.sid"
                         placeholder="请选择学科"
                         :options="subjects"
                         @change="toValidate"
                         filterable></el-cascader>
          </el-form-item>
        </el-form-item>
        <el-form-item prop="cid" style="margin-left: -13%">
          <el-select v-model="addForm.kid" filterable placeholder="请选择类别" @change="toValidate">
            <el-option
                v-for="item in classes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="limit"  :label-width="'10'"  style="width: 25%;margin-left: 35%"  >
          <el-input v-model="addForm.limit" type="text"  autocomplete="off" placeholder="爬取数量"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: -15%">
          <el-switch
              style="display: block"
              v-model="addForm.statusCode"
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
        <el-button type="primary" @click="add">确 定 添 加</el-button>
      </div>
    </el-dialog>
    <el-table  :data.sync="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
               style="width: 90%;margin-left: 5%;line-height: 30px" border stripe
    >
      <el-table-column prop="id"
                       label="编号" width="70"
                       header-align="center"
                       align="center"
      ></el-table-column>
<!--      <el-table-column prop="fname"-->
<!--                       label="学科门类" width="120"-->
<!--                       header-align="center"-->
<!--                       align="center"-->
<!--                       :filters="this.Fields"-->
<!--                       :filter-method="filterField">-->
<!--      </el-table-column>-->
      <el-table-column prop="sname"
                       label="案例初始学科"
                       width="120"
                       header-align="center"
                       align="center">
      </el-table-column>
      <el-table-column prop="kname"
                       label="案例初始类别"
                       width="120"
                       header-align="center"
                       align="center"
                       :filters="this.Kinds"
                       :filter-method="filterKind">
      </el-table-column>
      <el-table-column prop="keyword"
                       label="检索关键词"
                       width="200"
                       header-align="center"
                       align="center">
      </el-table-column>
      <el-table-column prop="createTime"
                       label="创建时间"
                       width="150"
                       header-align="center"
                       align="center">
      </el-table-column>
      <el-table-column prop="statusCode"
                       label="案例初始状态"
                       width="120"
                       header-align="center"
                       align="center"
                       :filters="[{ text: '已发布', value: '已发布' }, { text: '待审核', value: '待审核' },{ text: '审核不通过', value: '审核不通过' }]"
                       :filter-method="filterStatus"
                       filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
              :type="getStatus(scope.row)"
              disable-transitions>{{scope.row.statusCode}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="author"
                       label="发布人员"
                       width="120"
                       header-align="center"
                       align="center"
      >
      </el-table-column>
      <el-table-column prop="limit"
                       label="爬取数量"
                       width="80"
                       header-align="center"
                       align="center"
      >
      </el-table-column>
      <el-table-column prop="num"
                       label="入库数量"
                       width="80"
                       header-align="center"
                       align="center"
      >
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       fixed="right"
                       width="180"
                       label="操作">
        <template slot-scope="scope">
          <el-popconfirm
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              :title="'确定删除记录'+scope.row.keyword+' 吗？'"
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
import {getTasks, delTask, getKinds, getSubjects, addTask} from "@/api/api";
import Vue from 'vue';
export default {
  name: "Spidermanage",
  data(){
    return {
      subjects:[],
      classes:[],
      formVisible:false,
      addForm:{
        keyword:"",
        limit:5,
        sid:"",
        kid:"",
        statusCode:'0',
      },addRules:{
        keyword: [{required: true, message: '请输入用于检索的关键词', trigger: 'blur'}],
        sid: [{required: true, message: '请选择学科', trigger: 'blur'}],
        kid: [{required: true, message: '请选择类别', trigger: 'blue'}],
      },
      Kinds:[],
      Fields:[],
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
    add(){
      this.$refs.addForm.validate((valid)=>{
        if(valid){
          const config={
            url:addTask,
            method: "post",
            headers:{
              "Token": this.$store.state.token
            },
            keyword:"",
            limit:5,
            sid:"",
            kid:"",
            statusCode:'0',
            data:{
              keyword:this.addForm.keyword,
              limit:this.addForm.limit,
              sid:this.addForm.sid[1],
              kid:this.addForm.kid,
              statusCode:this.addForm.statusCode,
            }
          }
          request(config).then((data)=>{
            if(data.data.code===0){
              alert("任务添加成功")
              this.allData=data.data.data.map((cas)=>{
                if(cas.statusCode===1){
                  cas.statusCode="已发布"
                }else if(cas.statusCode===0){
                  cas.statusCode="待审核"
                }else{
                  cas.statusCode="审核不通过"
                }
                if(cas.code===0){
                  cas.code="工作中"
                }else {
                  cas.code="完成"
                }
                return cas
              })
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
    toValidate(){
      this.$refs.addForm.validate()
    },
    filterKind(value, row){
      return row.kname === value
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
    filterStatus(value, row){
      return row.statusCode === value
    },
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
          return i.keyword.indexOf(this.search)>-1
        })
      }
      this.total=this.tableData.length
    },
    toAdd(){
      this.addForm.keyword=""
      this.addForm.limit=5
      this.addForm.sid=""
      this.addForm.kid=""
      this.addForm.statusCode=0
      this.formVisible=true
    },
    del(row){
      const config={
        url:delTask,
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
      }).catch((err)=>{
        console.log(err)
        alert("服务器开小差了")
      })
    }
  },
  mounted() {
    const token=localStorage.getItem("adminToken")
    if(token==null||token===""){
      this.$router.push("/login")
    }
    const config={
      url: getTasks,
      method: 'get',
      headers: {
        "Token": token
      }
    }
    request(config).then((data)=>{
      if(data.data.code===0){
        this.allData=data.data.data.map((cas)=>{
          if(cas.statusCode===1){
            cas.statusCode="已发布"
          }else if(cas.statusCode===0){
            cas.statusCode="待审核"
          }else{
            cas.statusCode="审核不通过"
          }
          if(cas.code===0){
            cas.code="工作中"
          }else {
            cas.code="完成"
          }
          return cas
        })
        this.tableData=this.allData
        this.total=this.tableData.length
      }else{
        alert(data.data.message)
      }
    }).catch(()=>{
      alert("服务器开小差了")
    })
    // const config1={
    //   url: getFields,
    //   method: 'get',
    // }
    // request(config1).then((data)=>{
    //   if(data.data.code===0){
    //     this.Fields=data.data.data.map((Field)=>{
    //       Vue.set(Field,'text',Field.name)
    //       Vue.set(Field,'value',Field.name)
    //       return Field
    //     })
    //   }else{
    //     alert(data.data.message)
    //   }
    // }).catch(()=>{
    //   alert("服务器开小差了")
    // })
    const config0={
      url:getKinds,
      method: 'get'
    }
    request(config0).then((data)=>{
      if(data.data.code===0){
        for(let i of data.data.data){
          const class0={value:i.id,label:i.name}
          this.classes.push(class0)
        }
      }else{
        alert("获取类别失败，请刷新重试")
      }
    }).catch(()=>{
      alert("服务器开小差了，请刷新重试")
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
  }
}
</script>
.el-table .warning-row {
background: oldlace;
}
<style scoped>

</style>