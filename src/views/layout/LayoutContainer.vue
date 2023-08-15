<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  CaretBottom
} from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/el-message-box.css'
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
import avatar from '@/assets/icon.png'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
//跳转或退出登录
const router = useRouter()
const handleCommand = async (key) => {
  if (key === 'quit') {
    await ElMessageBox.confirm('您确认要退出吗?', '注意', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
    userStore.removeToken()
    userStore.setUser({})
    router.push('/login')
  } else {
    router.push(`/user/${key}`)
  }
}
//获取用户信息
const userStore = useUserStore()
onMounted(() => {
  userStore.getUser()
})
</script>
<template>
  <!-- el-menu --整个菜单组件
    :default-active="$route.path" => 配置默认的高亮菜单项
    router 开启router选项，后面的el-menu-item中的index设置路径就是点击跳转的路径 
    el-menu-item 菜单项
  -->
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside_logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/article/user">
          <!-- 多级菜单 --具名插槽 title-->
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <!-- 展开内容  --默认插槽 -->
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本信息</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>修改密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          用户:<strong>{{ userStore.user.username }}</strong>
        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.user.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="User"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="User"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="quit" :icon="User"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        Main
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    &_logo {
      height: 120px;
      background-image: url('~@/assets/icon.png');
    }
  }

  .el-menu {
    border-right: none;
  }
}
.el-header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-dropdown__box {
    display: flex;
    align-items: center;

    .el-icon {
      color: #999;
      margin-left: 10px;
    }

    &:active,
    &:focus {
      outline: none;
    }
  }
}
</style>
