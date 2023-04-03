<template>
  <div>
    <el-row style="margin: 0;height: 1%;line-height: 90px" >
      <el-col :span="2" style="text-align: right;margin-left: 3%" >搜索：</el-col>
      <el-col :span="8" >
        <el-input type="text" v-model="search" placeholder="标题/作者" @keyup.enter.native="find"></el-input>
      </el-col>
      <el-col :span="7" style="text-align: right;" >积分模式：
      <el-switch
          v-model="mode"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value= 1
          inactive-value= 0
          active-text="启用"
          inactive-text="关闭"
          @change="changeMode">
      </el-switch>
      </el-col>
      <el-col :span="4" >
        <el-button size="medium" style="margin-left: 50%" @click.native="toAdd">添加案例</el-button>
      </el-col>
    </el-row>
    <el-table  :data.sync="tableData"
               style="width: 90%;margin-left: 5%;line-height: 30px" border stripe
    >
      <el-table-column prop="id"
                       label="编号" width="70"
                       header-align="center"
                       align="center"
      ></el-table-column>
      <el-table-column prop="fname"
                       label="学科门类" width="120"
                       header-align="center"
                       align="center"
                       :filters="this.Fields"
                       :filter-method="filterField">
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
      <el-table-column prop="title"
                       label="标题"
                       width="200"
                       header-align="center"
                       align="center">
        <template slot-scope="scope">
          <el-link  @click="toCasedetail(scope.row.id)">{{ scope.row.title }}</el-link >
        </template>
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
                       fixed="right"
                       width="180"
                       label="操作">
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
          @current-change="current_change"
          @size-change="changeSize">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {request} from "@/network/request";
import {getCasenum,delCase,getFields,getKinds,getMode,changeMode,getCaseByPage} from "@/api/api";
import Vue from 'vue';
export default {
  name: "Usermanage",
  data(){
    return {
      mode: "0",
      Kinds:[],
      Fields:[],
      tableData: [],
      search: "",
      allData: [],
      total: 0,
      pagesize:10,
      pagesizes:[10,20,30],
      currentPage:1,
      token:""
    }
  },
  methods:{
    changeSize(){
      this.currentPage=1
      this.current_change(this.currentPage)
    },
    toCasedetail(id){
      let routeUrl = this.$router.resolve({
        path: "/casedetail",
        query: {id:id}
      });
      window.open(routeUrl.href, '_blank')
    },
    changeMode() {
      const config={
        url:changeMode,
        method: "get",
        headers:{
          "Token": this.$store.state.token
        },
        params:{
          "code": this.mode
        }
      }
      request(config).then((data)=>{
        if(data.data.code===0){
          this.$notify({
            title: 'tip',
            message: data.data.message,
            duration: 2000
          });
        }
      }).catch((err)=>{
        console.log(err)
        alert("服务器开小差了")
      })
    },
    filterKind(value, row){
      return row.kname === value
    },
    filterField(value, row){
      return row.fname === value
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
      // this.tableData=this.tableData.filter(i=>{
      //   return i.statusCode.indexOf(value)>-1;
      // })
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
        url: getCaseByPage,
        method: 'get',
        headers: {
          "Token": this.token
        },
        params:params
      }
      request(config).then((data)=>{
          if(data.data.code===0){
            this.tableData=data.data.data.map((d)=>{
              if (d.statusCode === 0) {
                d.statusCode = "待审核"
              } else {
                d.statusCode = "已发布"
              }
              return d
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
        this.tableData=this.allData
        const param={
          page:1,
          size:this.pagesize,
          key:this.search
        }
        const config={
          url: getCaseByPage,
          method: 'get',
          headers: {
            "Token": this.token
          },
          params:param
        }
        request(config).then((data)=>{
          if(data.data.code===0){
            this.tableData=data.data.data.map(d=>{
              if(d.statusCode===0){
                d.statusCode="待审核"
              }else {
                d.statusCode="已发布"
              }
              return d
            })
            this.allData=this.tableData
            const conf={
              url: getCasenum,
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
      else{
        let params={
          page:1,
          size:this.pagesize
        }
        const config={
          url: getCaseByPage,
          method: 'get',
          headers: {
            "Token": this.token
          },
          params:params
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
              return cas
            })
            this.tableData=this.allData
            const conf={
              url: getCasenum,
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
    toAdd(){
      // this.$router.push("/addCase")
      let routeUrl = this.$router.resolve({
        path: "/addCase",
      });
      window.open(routeUrl.href, '_blank')
    },
    edit(row){
      let routeUrl = this.$router.resolve({
        path: "/editCase/"+row.id,
      });
      window.open(routeUrl.href, '_blank')
    },
    del(row){
      const config={
        url:delCase,
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
              }else{
                this.current_change(this.currentPage)
              }
              this.total=this.total-1
              break
            }
          }
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
    this.token=token
    let params={
      page:1,
      size:this.pagesize
    }
    const config={
      url: getCaseByPage,
      method: 'get',
      headers: {
        "Token": token
      },
      params:params
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
          return cas
        })
        this.tableData=this.allData
        const conf={
          url: getCasenum,
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
      url: getFields,
      method: 'get',
    }
    request(config1).then((data)=>{
      if(data.data.code===0){
        this.Fields=data.data.data.map((Field)=>{
          Vue.set(Field,'text',Field.name)
          Vue.set(Field,'value',Field.name)
          return Field
        })
      }else{
        alert(data.data.message)
      }
    }).catch(()=>{
      alert("服务器开小差了")
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
    const config3={
      url: getMode,
      method: 'get',
    }
    request(config3).then((data)=>{
      if(data.data.code===0){
        this.mode=data.data.data
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