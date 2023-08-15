<script setup>
import 'element-plus/theme-chalk/el-message.css' //element-plus引入message样式丢失，重新按需引入
import { userRegisterService, userLoginService } from '@/api/user.js'
import { User, Lock, Right, Back } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const isRegister = ref(false)
const form = ref()
const userStore = useUserStore()
const router = useRouter()

//监听，切换表单时重置信息
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
//注册校验
const register = async () => {
  await form.value.validate() //触发校验
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功!')
  isRegister.value = false
}
//登录校验
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  ElMessage.success('登录成功！')
  router.push('/')
}
//整个的用于提交的form数据对象
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
//整个表单的校验规则
//1.非空校验：required:true非空  message-提示信息  trigger-触发校验的时机 blur失焦触发 change实时触发
//2.长度校验：min：xx max：xx
//3.正则校验：pattern：正则规则  \S 非空字符
//4.自定义校验： => 自己写逻辑校验（校验函数）
// validator:(rule, value, callback)
// (1)rule 当前校验规则相关信息
// (2)value 所校验的表单元素目前的表单值
// (3)callback
//   -callback() 校验成功
//   -callback(new Error(错误信息)) 校验失败
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '用户名必须是2-10位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-12位的字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-12位的字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        //判断value和当前form中的password是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback() //校验成功,注意：校验成功了也要callback
        }
      },
      trigger: 'blur'
    }
  ]
}
</script>
<template>
  <el-row class="login-page">
    <!-- el-row将行分成24个格子，el-col分成左右两块，左12，右3+6+3 -->
    <el-col :span="12" class="background"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 校验相关
    1.el-form => :model="ruleForm"   绑定整个form的数据对象
    2.el-form => :rules="rules"      绑定整个rules规则对象 （与form数据对应）
    3.表单元素 => v-model="ruleForm.xx" 表单元素绑定form的子属性
    4.el-form-item => prop配置生效的是哪个校验规则（与rules中的字段对应） -->

      <!-- 注册表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item><h1>注册</h1></el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
            >注册</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false"
            ><el-icon><Back /></el-icon><span>返回</span></el-link
          >
        </el-form-item>
      </el-form>
      <!-- 登录表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item><h1>登录</h1></el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <el-checkbox class="flex1" v-model="checked1" label="记住我" size="middle" />
          <el-link type="primary" :underline="false">忘记密码？</el-link>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true"
            ><span>注册</span> <el-icon><Right /></el-icon>
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.login-page {
  .form {
    display: flex;
    // margin: 100px auto;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-around;
      .flex1 {
        margin-right: auto;
      }
    }
  }
}
</style>
