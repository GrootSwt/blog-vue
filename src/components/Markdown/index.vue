<template>
  <div class="blog-mark-down">
    <!--markdown编辑器只查看-->
    <MdEditor v-if="previewOnly" theme="dark" v-model="text" :previewOnly="true">
    </MdEditor>
    <!--markdown编辑器-->
    <MdEditor v-else theme="dark" v-model="text" @on-save="saveFile">
    </MdEditor>
  </div>
</template>

<script setup lang="ts">
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ref, toRefs, watch } from 'vue'
import { IBlogContent } from '../../api/blogContent';

const props = defineProps<{
  // 文档内容
  fileData: IBlogContent,
  previewOnly: boolean
}>()
const emit = defineEmits(['saveFile'])
const { fileData } = toRefs(props)
// 获取文档内容
watch(fileData, (newValue) => {
  oldText.value = newValue.text ? newValue.text : ''
  text.value = newValue.text ? newValue.text : ''
})
// 文章原始内容
const oldText = ref('')
// 当前文章内容
const text = ref('')
// 点击保存按钮或者快捷键保存
const saveFile = () => {
  emit('saveFile', text.value)
  oldText.value = text.value
}
// 清空编辑器内容
const clearEditor = () => {
  oldText.value = ''
  text.value = ''
}
// 判断编辑器内容是否更改
const textIsChange = () => {
  return oldText.value !== text.value
}
const getText = () => {
  return text.value
}

defineExpose({
  clearEditor,
  textIsChange,
  getText
})
</script>

<style lang="scss" scoped>
// 整个markdown编辑器样式
.blog-mark-down {
  height: 100%;

  .md {
    height: 100%;
  }
}
</style>
