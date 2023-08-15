<script setup>
import { artGetChannelsService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import channelEdit from './components/channelEdit.vue'
import { artDeleteChannelsService } from '../../api/article'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const channelList = ref([])
//获取数据
const getChannels = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  console.log(channelList.value)
  loading.value = false
}
getChannels()

const dialog = ref()
const onAddChannel = () => {
  dialog.value.open({})
}
const onEditChannel = (row) => {
  dialog.value.open(row)
}
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('您确定要删除该分类吗', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDeleteChannelsService(row.id)
  ElMessage.success('删除成功')
  getChannels()
}
const onSuccess = () => {
  getChannels()
}
</script>
<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel" type="primary">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" lable="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" lable="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" lable="分类别名"></el-table-column>
      <el-table-column lable="操作" width="150">
        <!-- 默认插槽，解构出row和index，row是行信息，$index是下标 -->
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <channelEdit ref="dialog" @success="onSuccess"></channelEdit>
  </page-container>
</template>
<style lang="scss" scoped></style>
