<script setup>
import { artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'
//父传子数据
defineProps({
  modelValue: {
    type: [Number, String]
  }
})
//声明所要提交的事件
const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannelList()
</script>
<template :modelValue="modelValue">
  <!-- label 展示给用户看的， value 提交给后台看 -->
  <!-- @update:modelValue绑定emit触发事件，传上对应参数$event，后续选中什么参数就更新什么参数,
    el-select一旦修改，就会触发@update:modelValue事件，进行子传父，将触发得到的值更新到id里，相当于完成了双向绑定 -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="channel in channelList"
      :label="channel.cate_name"
      :key="channel.id"
      :value="channel.id"
    ></el-option>
    <el-option></el-option>
  </el-select>
</template>
