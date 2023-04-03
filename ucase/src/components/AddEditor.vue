<template>
  <div>
    <el-form :model="ruleForm2" :rules="rules2"
             status-icon
             ref="ruleForm2"
             label-position="left"
             label-width="0px"
             class="demo-ruleForm login-page">
      <div style="width: 40%;margin-top: 40px ">
        <el-form-item  prop="title" >
          <el-input type="text"
                    v-model="ruleForm2.title"
                    auto-complete="off"
                    placeholder="请输入标题"
          ></el-input>
        </el-form-item>
      </div>
      <div style="width: 25%; ">
        <el-form-item  prop="keywords" >
          <el-input type="text"
                    v-model="ruleForm2.keywords"
                    auto-complete="off"
                    @keyup.native="replaceSem"
                    placeholder="请输入关键字,关键字间使用分号分割"
          ></el-input>
        </el-form-item>
      </div>
      <div style="margin-right: 90%;" >
        <el-form-item  prop="subject" >
          <el-cascader v-model="ruleForm2.subject"
                       placeholder="请选择学科"
                       :options="subjects"
                       @change="toValidate"
                       filterable></el-cascader>
        </el-form-item>
      </div>
      <div style="margin-right: 90%">
        <el-form-item prop="class" >
          <el-select v-model="ruleForm2.class" filterable placeholder="请选择类别" @change="toValidate">
            <el-option
                v-for="item in classes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <TEditor :my-key="myKey" ref="editor" v-model="ruleForm2.content" style="margin-bottom:0"></TEditor>
      <div v-if="showUpload" style="margin-right: 90%;height: 50px;margin-top: 65px">
        <el-upload class="upload-demo"
                   :action="uploadUrl"
                   :headers="{'Key':myKey}"
                   :on-preview="handlePreview"
                   :on-remove="handleRemove"
                   :before-remove="beforeRemove"
                   :multiple="false"
                   :limit="5"
                   :on-exceed="handleExceed"
                   :file-list="fileList"
                   :on-success="handleSuccess" >
          <el-button size="small" type="primary" >上传积分附件</el-button>
        </el-upload>
      </div>
      <el-button round style="margin-right:0%" @click="submit">提交</el-button>
    </el-form>
  </div>
</template>

<script>
import TEditor from '@/components/editor/TEditor'
import {request} from '@/network/request'
import {getKey,uploadPointfile,delPointfile,getKinds,getSubjects,addCase,updatePFname} from '@/api/api'
import Vue from 'vue'
export default {
  name: "AddEditor",
  components: {TEditor},
  data(){
    return {
      showUpload:true,
      uploadUrl:uploadPointfile,
      fileList:[],
      myKey:'',
      fname:["","",""],
      ruleForm2: {
        statusCode:'0',
        title:'',
        subject:'',
        keywords: '',
        class: '',
        content:''
      },rules2: {
        title: [{required: true, message: '请输入标题', trigger: 'blur'}],
        subject: [{required: true, message: '请选择学科', trigger: 'blur'}],
        keywords: [{required: true, message: '请输入至少一个关键字', trigger: 'blur'}],
        class: [{required: true, message: '请选择类别', trigger: 'blur'}],
        content: [{required: true, message: '输入内容不能为空', trigger: 'blur'}],
      },
      subjects:[],
      classes:[],
    }
  },
  methods:{
    toValidate(){
      this.$refs.ruleForm2.validate()
    },
    handleSuccess(response, file, fileList){
      this.fileList=fileList.map((i)=>{
        Vue.set(i,"id",i.response.data.id)
        Vue.set(i,"url",i.response.data.url)
        Vue.set(i,"name",i.response.data.name)
        for(let j in this.fileList){
          if(this.fileList[j].id===i.id){
            Vue.set(i,"name",this.fname[j])
            break
          }
        }
        return i
      })
    },
    replaceSem(){
      this.ruleForm2.keywords=this.ruleForm2.keywords.replace(/；/g,";")
      this.ruleForm2.keywords=this.ruleForm2.keywords.replace(/\s+/g,"")
    },
    submit(){
      this.$refs.ruleForm2.validate((valid) => {
        if(valid){
          const token=localStorage.getItem("uToken")
          if(token!==null||token!==''){
            const config={
              url:addCase,
              method: 'post',
              data:{
                statusCode:this.ruleForm2.statusCode,
                sid:this.ruleForm2.subject[1],
                kid:this.ruleForm2.class,
                title:this.ruleForm2.title,
                content:this.ruleForm2.content,
                keywords:this.ruleForm2.keywords
              },headers:{
                'Token':token,
                'Key':this.myKey
              }
            }
            request(config).then((data)=>{
              if(data.data.code===0){
                this.showUpload=false
                alert("案例提交成功")
                window.close()
              }else {
                alert(data.data.message)
              }
            }).catch(()=>{
              alert("服务器开小差了")
            })
          }else {
            alert("请先登录")
          }
        }else{
          alert("案例信息不完整")
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(fileList);
      console.log(this.fileList)
      const config={
        url:delPointfile,
        method: 'get',
        params:{
          id:file.response.data.id
        },headers:{
          'Key':this.myKey
        }
      }
      request(config).then((data)=>{
        if(data.data.code===0){
          alert("删除成功")
        }else{
          this.fileList.push(file)
          alert(data.data.message)
        }
      }).catch(()=>{
        this.fileList.push(file)
        alert("服务器开小差了")
      })
    },
    handlePreview(file) {
      const token = localStorage.getItem("adminToken")
      let id=file.id
      let url=file.url
      if(id===undefined){
        id=file.response.data.id
        url=file.response.data.url
      }
      this.$prompt('请输入名称', '更改附件名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        const config={
          url: updatePFname,
          method: 'get',
          headers:{
            "Token":token,
            "Key":this.myKey
          },
          params:{
            "id":id,
            "name":value
          },
        }
        request(config).then((data)=>{
          if(data.data.code===0){
            for(let i in this.fileList){
              if(this.fileList[i].id===id){
                const mf=this.fileList[i]
                Vue.set(mf,'name',value)
                this.fname[i]=value
                this.fileList.splice(i,1,mf)
                break
              }
            }
          }
          this.$message({
            type: 'success',
            message: '附件名称修改成功'
          });
        }).catch(()=>{
          this.$message({
            type: 'tip',
            message: '更改失败'
          });
        })

      }).catch(() => {

      });
      this.$notify.info({
        title: '下载地址',
        message: url
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      console.log(fileList)
      return this.$confirm(`确定移除 ${ file.name }？`)
    }
  },
  mounted() {
    //初始化获取key
    const token=localStorage.getItem("uToken")
    if(token!==undefined&&token!==null&&token!==''){
      const config={
        url:getKey,
        method: 'get',
        params:{
          token:token
        }
      }
      request(config).then((data)=>{
        if(data.data.code===0){
          this.myKey=data.data.data
        }else {
          alert(data.data.message)
        }
      }).catch(()=>{
        alert("服务器开小差了，请刷新重试")

      })
    }else {
      alert("请先登录")
      window.close()
    }
    //获取类别
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
    //获取学科
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
  }
}
</script>

<style scoped>
.upload-demo{
  margin-top:-50px
}
</style>