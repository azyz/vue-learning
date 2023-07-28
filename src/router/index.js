import { createRouter, createWebHistory } from 'vue-router'

//createRouter创建路由实例
//配置history模式
//history模式：createWebHistory  地址栏不带 “#”
//hash模式： createWebHashHistory  地址栏带 “#”
//vite中的环境变量  import.meta.env.BASE_URL  可在vite.config.js中加base配置前缀
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

export default router
