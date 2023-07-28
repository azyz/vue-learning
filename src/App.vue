<script setup>
import { useUserStroe } from '@/stores/pinia'

const userStore = useUserStroe()
</script>

<template>
  <div>我是app</div>
  <el-button>按钮</el-button>
  <p>{{ userStore.token }}</p>
  <el-button @click="userStore.setToken('aadvsdad')">登录</el-button>
  <el-button @click="userStore.removeToken()">退出</el-button>
</template>

<style scoped></style>
