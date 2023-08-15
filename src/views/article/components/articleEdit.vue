<script setup>
import { ref } from 'vue'
import channelSelect from './channelSelect.vue'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'

const defaultForm = {
  title: '', //标题
  cate_id: '', //分类id
  cover_img: '', //封面图片 file对象
  content: '', // string文本内容
  state: '' //状态
}
const formModel = ref({ ...defaultForm })
const drawer = ref(false)
// 对外暴露一个方法open，基于传入open的参数判断进行的功能是添加还是编辑
// 如果传入的是open({}) 表单无需渲染，则为添加
// 如果传入的是open({id, ... , ...}) 表单需要渲染，为编辑
// 调用open()打开抽屉
const editorRef = ref()
const open = async (row) => {
  drawer.value = true //显示抽屉
  //判断为编辑还是添加
  if (row.id) {
    //基于row.id 发送请求,获取编辑的详细数据(获取其中额外的图片和文本数据),进行回显
    const res = artGetDetailService(row.id)
    formModel.value = res.data.data
    //其中图片回显需要单独处理回显，其地址中没有前缀，要拼上前缀才能赋值
    imgUrl.value = baseURL + formModel.value.cover_img
  } else {
    //如果没有id,基于默认数据,进行form数据重置
    formModel.value = { ...defaultForm }
    //图片和富文本需要手动重置,否则可能会没有重置干净,富文本重置有对应方法setHTML(html)
    imgUrl.value = ''
    if (formModel.value.content !== '') {
      editorRef.value.setHTML('')
    }
  }
}
defineExpose({
  open
})

//图片上传逻辑
const imgUrl = ref('')
const onUploadFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //本地预览图片方法
  formModel.value.cover_img = uploadFile.raw //将图片对象存入formModel中，用于后边提交
}

//发布文章
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  //将新传入的状态存入formModel
  formModel.value.state = state
  //当前接口对象需要的是formData对象，转换操作：普通对象=>formData对象
  const fd = new FormData()
  //需要formModel中所有数据，进行遍历
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  //转换成功进行发请求操作
  //判断为编辑还是添加操作
  if (formModel.value.id) {
    await artEditService(fd)
    ElMessage.success('修改成功')
    drawer.value = false
    emit('success', 'edit')
  } else {
    //添加请求
    await artPublishService(fd)
    ElMessage.success('添加成功')
    drawer.value = false
    //通知父组件添加成功，额外传参add，加标识，添加的新数据在最后一页，根据标识进行渲染
    emit('success', 'add')
  }
}
</script>
<template>
  <!-- 抽屉 -->
  <el-drawer v-model="drawer" title="抽屉" :direction="rtl" size="40%">
    <!-- 发表文章表单 -->
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="文章标题" props="title" style="width: 320px">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" props="cate_id">
        <channel-select v-model="formModel.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" props="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" props="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="formModel.content"
            theme="snow"
            content-type="html"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
