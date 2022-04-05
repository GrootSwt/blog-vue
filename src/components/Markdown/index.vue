<template>
  <div class="blog-mark-down">
    <!--markdown编辑器只查看-->
    <md-editor
      v-if="previewOnly"
      theme="dark"
      v-model="text"
      :previewOnly="true"
    >
    </md-editor>
    <!--markdown编辑器-->
    <md-editor
      v-else
      v-model="text"
      @on-save="saveFile"
    >
    </md-editor>
  </div>
</template>

<script>
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ref, toRefs, watch } from 'vue'

export default {
  name: 'Markdown',
  components: {
    // markdown编辑器
    MdEditor
  },
  props: {
    // 文档内容
    fileData: Object,
    previewOnly: Boolean
  },
  setup (props, { emit }) {
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
    return {
      text,
      saveFile,
      clearEditor,
      textIsChange,
      getText
    }
  }
}
</script>

<style lang="less" scoped>
// 整个markdown编辑器样式
.blog-mark-down {
  height: 100%;
  // 暗色主题markdown编辑器样式
  .md-dark {
    height: 100%;
  }
  // 亮色主题markdown编辑器样式
  .md {
    height: 100%;
  }
}
</style>
