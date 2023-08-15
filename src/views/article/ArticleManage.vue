<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import channelSelect from './components/channelSelect.vue'
import articleEdit from './components/articleEdit.vue'
import { ref } from 'vue'
import { artGetListService, artDeleteService } from '@/api/article.js'
import { formatTime } from '@/utils/format.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const articleList = ref([]) //文章列表
const total = ref(0) //响应匹配数据总数
//定义请求参数对象
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_Id: '',
  state: ''
})

//基于params参数获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
// getArticleList()

//分页逻辑
//修改当前页展示信息条数
const handleSizeChange = (size) => {
  //回到第一页，每页数据条数重置，以防修改后当前页面没有信息
  params.value.pagenum = 1
  //调整每页展示信息条数
  params.value.pagesize = size
  //基于最新数据重新渲染
  getArticleList()
}

//当前页面跳转
const handleCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}

//搜索逻辑
const onSearch = () => {
  //选择分类和状态前面已经设置绑定,可以直接检索,跳转到首页即可
  params.value.pagenum = 1
  getArticleList() // 重新渲染
}

//重置逻辑
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_Id = '' //分类和状态重置为空
  params.value.state = ''
  getArticleList()
}

//ref绑定
const articleEditRef = ref()
//添加逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}
//编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open({ row })
}
//删除逻辑
const onDelteArticle = async (row) => {
  await ElMessageBox.confirm('您确定要删除该分类吗', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDeleteService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}

//添加或编辑成功 回调
const onSuccess = (type) => {
  if (type === 'add') {
    //判断若是添加，渲染到最后一页展示新添加数据，更新到最大页码数渲染
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <!-- v-model绑定对应属性编号 -->
        <channel-select v-model="params.cate_Id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态:">
        <el-select v-model="params.state">
          <!-- 此处value后台也是同样用中文标记，因此此处也是中文 -->
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <!-- label后的内容prop未配置 -->
      <el-table-column label="文章标题">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" props="cate_name"></el-table-column>
      <el-table-column label="发表时间" props="pub_date">
        <!-- 默认插槽引入，格式化时间 -->
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" props="state"></el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据 -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDelteArticle(row)"
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>
<style lang="scss" scoped></style>
