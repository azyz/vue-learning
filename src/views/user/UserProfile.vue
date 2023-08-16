<script setup>
import pageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { userUpdateInfoService } from '@/api/user'
import { ElMessage } from 'element-plus'

//使用仓库初始值，可以直接进行结构，无需用到响应式（结构会丢失响应式）
const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()
const formRef = ref()
const form = ref({
  id,
  username,
  nickname,
  email
})
const rules = ref({
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '用户昵称长度需为2-10个非空字符',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱账户', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change']
    }
  ]
})
const submitForm = async () => {
  //校验
  await formRef.value.validate()
  //提交修改
  await userUpdateInfoService(form.value)
  //通知user模块进行数据更新
  getUser()
  ElMessage.success('修改成功')
}
</script>
<template>
  <page-container title="基本资料">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      autocomplete="off"
    >
      <el-form-item label="登录名称">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
    </el-form>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交修改</el-button>
    </el-form-item>
  </page-container>
</template>
