<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <!-- props定制标题 -->
        <span>{{ title }}</span>
        <!-- 具名插槽定制头部右侧额外的按钮 -->
        <div class="extra"><slot name="extra"></slot></div>
      </div>
    </template>
    <!-- 默认插槽定制内容主体 -->
    <slot></slot>
  </el-card>
</template>
<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center; //垂直居中
  }
}
</style>
