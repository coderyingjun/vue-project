<template>
  <div style="width:500px;margin-top:-25px;">
    <div v-if="type==='subject'" style="height: 100px">
      <el-select  v-model="type" @change="search=''" placeholder="请选择" style="height:100px;width: 100px">
        <el-option label="标题" value="title"></el-option>
        <el-option label="作者" value="author"></el-option>
        <el-option label="关键词" value="keywords"></el-option>
        <el-option label="学科" value="subject" @select="search=''"></el-option>
        <el-option label="类别" value="kind" @select="search=''"></el-option>
      </el-select>
      <el-cascader :options="subjects"
                   :props="{ checkStrictly: true }"
                   v-model="search"
                   filterable
                   clearable class="input-with-select">
      </el-cascader>
      <el-select placeholder="请选择1" value="value">
        <el-option label="精确" value="pre"></el-option>
      </el-select>
    </div>
    <div v-else-if="type==='kind'" style="height: 100px">
      <el-select v-model="type"  placeholder="请选择" @change="search=''" style="height:100px;width: 100px">
        <el-option label="标题" value="title"></el-option>
        <el-option label="作者" value="author"></el-option>
        <el-option label="关键词" value="keywords"></el-option>
        <el-option label="学科" value="subject" @select="search=''"></el-option>
        <el-option label="类别" value="kind" @select="search=''"></el-option>
      </el-select>
      <el-select v-model="search" placeholder="请选择" style="height:100px;width: 200px">
        <el-option  label="标题" value="title"></el-option>
      </el-select>
      <el-select placeholder="请选择" slot="prefix" value="pre" style="height:100px;width: 300px">
        <el-option label="精确" value="pre"></el-option>
      </el-select>
    </div>
    <div v-else>
      <el-input v-if="type!=='subject'" placeholder="请输入搜索内容" v-model="search" class="input-with-select">
        <el-select v-model="type" slot="prepend" @change="search=''" placeholder="请选择" style="width: 100px">
          <el-option label="标题" value="title"></el-option>
          <el-option label="作者" value="author"></el-option>
          <el-option label="关键词" value="keywords"></el-option>
          <el-option label="学科" value="subject" ></el-option>
          <el-option label="类别" value="kind" @select="search=''"></el-option>
        </el-select>
        <el-select placeholder="请选择" value="pre" slot="append" style="width: 80px">
          <el-option label="精确" value="pre"></el-option>
        </el-select>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: "CpxInput",
  props:{
    kinds:[],
    subjects:[]
  },
  data(){
    return {
      type:""
    }
  }
}
</script>

<style scoped>

</style>