<script setup>
import pageContainer from '@/components/pageContainer.vue'
import { ref } from 'vue'
import { userPwdUpdateService } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user.js'
import { useRouter } from 'vue-router'

const pwdFromRef = ref()
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const checkDifferent = (rule, value, callback) => {
  //检验新密码与原密码不同
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}
const checkSameAsNewPwd = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('请确认两次新密码相同'))
  } else {
    callback()
  }
}
const rules = ref({
  old_pwd: [
    { required: true, message: '请输入当前账号密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '原密码长度在6-12位之间',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '请输入新的密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '新密码必须是6-12为的字符',
      trigger: 'blur'
    },
    { validator: checkDifferent, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '新密码必须是6-12为的字符',
      trigger: 'blur'
    },
    { validator: checkSameAsNewPwd, trigger: 'blur' }
  ]
})

const userStore = useUserStore()
const router = useRouter()
const onSubmit = async () => {
  await pwdFromRef.value.validate()
  await userPwdUpdateService(pwdForm.value)
  ElMessage.success('密码修改成功')
  //密码修改成功退出重新登录,清空本地token和个人信息
  userStore.setToken('')
  userStore.setUser({})
  router.push('/login')
}
const onReset = () => {
  pwdFromRef.value.resetFields()
}
</script>
<template>
  <page-container title="修改密码">
    <el-row>
      <el-col :span="12">
        <el-form
          ref="pwdFromRef"
          :model="pwdForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="re_pwd">
            <el-input v-model="pwdForm.re_pwd" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">修改密码</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>
