<template>
  <div style="width:500px;margin-top:-50px;margin-left:480px;height: 100px">
    <div v-if="type==='subject'" style="height: 100px">
      <el-select  v-model="type" @change="search=''" placeholder="请选择" style="height:100px;width:100px">
        <el-option label="标题" value="title"></el-option>
        <el-option label="作者" value="author"></el-option>
        <el-option label="关键词" value="keywords"></el-option>
        <el-option label="学科" value="subject" ></el-option>
        <el-option label="类别" value="kind" ></el-option>
      </el-select>
      <el-cascader :options="subjects"
                   :props="{ checkStrictly: true }"
                   v-model="search"
                   filterable
                   clearable class="input-with-select">
      </el-cascader>
      <el-button  icon="el-icon-search" @click="toSearch"></el-button>
    </div>
    <div v-else-if="type==='kind'" style="height: 100px">
      <el-select v-model="type"  placeholder="请选择" @change="search=''" style="height:100px;width: 100px">
        <el-option label="标题" value="title"></el-option>
        <el-option label="作者" value="author"></el-option>
        <el-option label="关键词" value="keywords"></el-option>
        <el-option label="学科" value="subject" @select="search=''"></el-option>
        <el-option label="类别" value="kind" @select="search=''"></el-option>
      </el-select>
      <el-select v-model="search" placeholder="请选择" style="height:100px;">
        <el-option v-for="item in kinds"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-button  icon="el-icon-search" @click="toSearch" ></el-button>
    </div>
    <div v-else>
      <el-input placeholder="请输入搜索内容" v-model="search" class="input-with-select">
        <el-select v-model="type" slot="prepend" @change="search=''" placeholder="请选择" style="width: 90px">
          <el-option label="标题" value="title"></el-option>
          <el-option label="作者" value="author"></el-option>
          <el-option label="关键词" value="keywords"></el-option>
          <el-option label="学科" value="subject" ></el-option>
          <el-option label="类别" value="kind" ></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="toSearch"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
import {getSubjects,getKinds} from '@/api/api'
import {request} from "@/network/request"
export default {
  name: "MySearch",
  props: {
    pEvent: String,
  },
    methods: {
      toSearch() {
        this.$emit('search', {type: this.type, value: this.search})
      }
    },
    data() {
      return {
        type:"title",
        search:"",
        subjects: this.$store.state.fields,
        kinds: this.$store.state.kinds
      }
    },
    beforeCreate() {
      //获取类别
      const config0 = {
        url: getKinds,
        method: 'get'
      }
      request(config0).then((data) => {
        if (data.data.code === 0) {
          this.kinds = []
          for (let i of data.data.data) {
            const class0 = {value: i.id, label: i.name}
            this.kinds.push(class0)
          }
          this.$store.commit('setKinds', this.kinds)
        } else {
          alert("获取类别失败，请刷新重试")
        }
      }).catch(() => {
        alert("服务器开小差了，请刷新重试")
      })
      const config1 = {
        url: getSubjects,
        method: 'get'
      }
      request(config1).then((data) => {
        this.subjects = []
        if (data.data.code === 0) {
          for (let i of data.data.data) {
            const subject = {
              value: i.id,
              label: i.name,
              children: []
            }
            for (let j of i.subjects) {
              const child = {
                value: j.id,
                label: j.name
              }
              subject.children.push(child)
            }
            this.subjects.push(subject)
          }
          this.$store.commit('setFields', this.subjects)
        } else {
          alert("获取学科失败，请刷新重试")
        }
      }).catch(() => {
        alert("服务器开小差了，请刷新重试")
      })
    },
    mounted() {
      if(this.$route.path.indexOf("search")>-1){
        this.type=this.$route.params.type
        if(this.type==="subject"){
          this.search=this.$route.params.search.split(",")
        }else if(this.type==="kind"){
          this.search=[this.$route.params.search]
        }else{
          this.search=this.$route.params.search
        }
      }
    }
}
</script>

<style scoped>
.el-main[data-v-5c886d6e]{
  line-height: 100px;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

</style>