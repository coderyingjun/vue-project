<template>
  <div class="tinymce-box">
    <Editor v-model="contentValue" :init="init" :disabled="disabled" @onClick="onClick" />
    <el-dialog
        title="上传进度"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >
      <span>上传进度：
        <el-progress :percentage="process" :format="format"></el-progress>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancleUpload" :disabled="this.cantCancle">取消上传</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {uploadImg,uploadVideo,uploadFile} from '@/api/api'
import axios from "axios";
import Vue from 'vue'
import Editor from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce' //tinymce默认hidden，不引入则不显示编辑器
import 'tinymce/skins/ui/oxide/skin.css' //不引入不显示
import 'tinymce/themes//silver'  //编辑器主题，不引入则报错
import 'tinymce/icons/default'  //引入编辑器图标icon，不引入则不显示对应图标
import 'tinymce/plugins/advlist'  //高级列表
import 'tinymce/plugins/anchor'  //锚点
import 'tinymce/plugins/autolink'  //自动链接
import 'tinymce/plugins/autoresize'  //编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
import 'tinymce/plugins/autosave'  //自动存稿
import 'tinymce/plugins/charmap'  //特殊字符
import 'tinymce/plugins/code'  //编辑源码
import 'tinymce/plugins/codesample'  //代码示例
import 'tinymce/plugins/directionality'  //文字方向
import 'tinymce/plugins/fullpage'  //文档属性
import 'tinymce/plugins/fullscreen'  //全屏
import 'tinymce/plugins/help'  //帮助
import 'tinymce/plugins/hr'  //水平分割线
import 'tinymce/plugins/image'  //插入编辑图片
import 'tinymce/plugins/importcss'  //引入css
import 'tinymce/plugins/insertdatetime'  //插入日期时间
import 'tinymce/plugins/link'  //超链接
import 'tinymce/plugins/lists' //列表插件
import 'tinymce/plugins/media' //插入编辑媒体
import 'tinymce/plugins/nonbreaking' //插入不间断空格
import 'tinymce/plugins/pagebreak' //插入分页符
import 'tinymce/plugins/paste' //粘贴插件
import 'tinymce/plugins/preview'//预览
import 'tinymce/plugins/quickbars'  //快速工具栏
import 'tinymce/plugins/save'  //保存
import 'tinymce/plugins/searchreplace'  //查找替换
import 'tinymce/plugins/tabfocus'  //切入切出，按tab键切出编辑器，切入页面其他输入框中
import 'tinymce/plugins/table'  //表格
import 'tinymce/plugins/template'  //内容模板
import 'tinymce/plugins/textcolor'  //文字颜色
import 'tinymce/plugins/textpattern'  //快速排版
import 'tinymce/plugins/toc'  //目录生成器
import 'tinymce/plugins/visualblocks'  //显示元素范围
import 'tinymce/plugins/visualchars'  //显示不可见字符
import 'tinymce/plugins/wordcount'  //字数统计
Vue.prototype.axios = axios;
export default {
  name: "TEditor",
  components: {Editor},
  props: {
    myKey:{
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave '
    },
    toolbar: {
      type: [String, Array],
      default: 'fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
                styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
                table image media charmap hr pagebreak insertdatetime  preview | code selectall searchreplace visualblocks | indent2em lineheight formatpainter axupimgs'
    }
  },
    data() {
      return {
        cantCancle: false,
        dialogVisible:false,
        process: 0,
        CancelToken: "",         //用于取消上传
        source:"",               //用于取消上传
        init: {
          media_live_embeds: true,
          language_url: '/tinymce/langs/zh_CN.js',  //引入语言包文件
          language: 'zh_CN',  //语言类型
          // skin_url: '/tinymce/skins/ui/oxide',  //皮肤：浅色
          plugins: this.plugins,  //插件配置
          toolbar: this.toolbar,  //工具栏配置，设为false则隐藏
          fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px',  //字体大小
          font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',  //字体样式
          lineheight_formats: "0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5",  //行高配置，也可配置成"12px 14px 16px 20px"这种形式
          height: 400,  //注：引入autoresize插件时，此属性失效
          placeholder: '在这里编辑案例',
          branding: false,  //tiny技术支持信息是否显示
          resize: false,  //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
          elementpath: false,  //元素路径是否显示
          content_style: "img {max-width:100%;}", //直接自定义可编辑区域的css样式
          // images_upload_url: '/apib/api-upload/uploadimg',  //后端处理程序的url，建议直接自定义上传函数image_upload_handler，这个就可以不用了
          // images_upload_base_path: '/demo',  //相对基本路径--关于图片上传建议查看--http://tinymce.ax-z.cn/general/upload-images.php
          paste_data_images: true,  //图片是否可粘贴
          images_upload_handler: (blobInfo, success, failure) => {
            if(this.myKey===""){
              alert("初始化中，请稍候")
              return
            }
            if (blobInfo.blob().size / 1024 / 1024 > 2) {
              failure("上传失败，图片大小请控制在 2M 以内")
            } else {
              let params = new FormData()
              params.append('file', blobInfo.blob())
              let config = {
                headers: {
                  "Key": this.myKey,
                  "Content-Type": "multipart/form-data"
                }
              }
              this.axios.post(uploadImg, params, config).then(res => {
                if (res.data.code > -1) {
                  success(res.data.data)  //上传成功，在成功函数里填入图片路径
                } else {
                  failure("上传失败")
                }
              }).catch(() => {
                failure("上传出错，服务器开小差了呢")
              })
            }
          },
          file_callback: function(file, succFun){
            console.log(1234566777777)
            succFun(123456,{text: 'xx.pdf'})
          },
          file_picker_types: 'image media file',  //分别对应三个类型文件的上传：link插件，image插件，media插件
          file_picker_callback: (callback,value, meta)=>{
            console.log(meta)
            if(this.myKey===""){
              alert("初始化中，请稍候")
              return
            }
            let filetype='.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4, .jpg';  //限制文件的上传类型
            let inputElem = document.createElement('input');  //创建文件选择
            inputElem.setAttribute('type', 'file');
            inputElem.setAttribute('accept', filetype);
            inputElem.click();
            inputElem.onchange=()=>{
              let upurl=""
              let file=inputElem.files[0]  //获取文件信息
              console.log(file.type)
              if(file.type.slice(0,5)==='video'){  //判断文件类型
                upurl= uploadVideo
              }else if(file.type.slice(0,5)==='image'){
                upurl= uploadImg
              }else{
                upurl= uploadFile
              }
              if(file.type.slice(0,5)==='image'&&file.size/1024/1024>2){
                console.log("上传图片")
                alert("上传失败，图片大小请控制在2M以内")
              }else if(file.type.slice(0,5)==='video'&&file.size/1024/1024>50){
                console.log("这是视频")
                alert("上传失败，视频大小请控制在 100M 以内")
              }else if(file.size/1024/1024>30){
                console.log("上传文件")
                alert("上传失败，文件大小请控制在 20M 以内")
              }else{
                let params=new FormData()
                params.append('file',file)
                this.CancelToken = this.axios.CancelToken
                this.source = this.CancelToken.source()
                let config={
                  cancelToken: this.source.token,
                  headers:{
                    "Key": this.myKey,
                    "Content-Type":"multipart/form-data"
                  },onUploadProgress: (progressEvent) => {          //进度条
                    if(progressEvent.lengthComputable){
                      this.dialogVisible = true
                      let complete = (( (progressEvent.loaded / progressEvent.total) * 100) | 0);
                      this.process=complete
                      if( complete === 100) {         //成功上传至服务器，等待服务器将文件存储至OSS
                        this.process = 100
                        this.cantCancle = true
                        this.CancelToken = ""
                        this.source = ""
                      }
                    }
                  }
                }
                this.axios.post(upurl,params,config).then(res=>{
                  if(res.data.code>-1){
                    console.log("上传成功")
                    this.dialogVisible = false
                    callback(res.data.data)   //上传成功，在回调函数里填入文件路径
                  }else{
                    this.dialogVisible = false
                    alert("案例已提交或"+res.data.message)
                  }
                }).catch((err)=>{
                  if(this.axios.isCancel(err)) {
                    alert("上传取消")
                    this.process = "上传以终止"
                    this.cantCancle = true
                  }else {
                    alert("上传出错，服务器开小差了呢")
                  }
                })
              }
            }
          },
        },

        contentValue: this.value,
      }
    },
    watch:{
      value (newValue) {
        this.contentValue = newValue
      },
      contentValue (newValue) {
        this.$emit('input', newValue)
      },
    },
    created(){

    },
    mounted(){
      tinymce.init({})
    },
  methods: {
    format(percentage) {
      return percentage === 100 ? '上传完成，请耐心等待服务器处理，处理完成后将自动关闭弹窗' : `${percentage}%`;
    },
    cancleUpload(){
      if(this.source !== ''){
        this.source.cancel("取消上传")
      }else {
        this.cantCancle = true
      }
    },
    handleClose(){
      this.dialogVisible = false
    },
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    onClick(e){
      this.$emit('onClick', e, tinymce)
    },
    //清空内容
    clear(){
      this.contentValue = ''
    },
  },
  }


</script>

<style scoped>

</style>