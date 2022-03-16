<template>
  <markdown-and-catalogue-tree
    ref="markdownAndCatalogueTreeRef"
    :tree-list="data"
    :file-data="fileData"
    :category="category"
    @saveFile="saveFile"
    @getFileData="getFileData"
    @create="create"
    @deleteById="deleteById"
  ></markdown-and-catalogue-tree>
</template>

<script>
import MarkdownAndCatalogueTree from '@/components/MarkdownAndCatalogueTree'
import { onMounted, ref, toRefs } from 'vue'
import { getBlogCatalogueTree, createCatalogue, deleteByIdArr } from '@/api/blogCatalogue'
import { getByFileId, updateText } from '@/api/blogContent'
import { ElMessage } from 'element-plus'
import { getPropListFromTree } from '@/utils'

export default {
  name: 'BlogContent',
  components: { MarkdownAndCatalogueTree },
  props: {
    category: {
      type: String
    }
  },
  setup (props) {
    // 文档类别
    const { category } = toRefs(props)
    // 目录列表
    const data = ref([])
    // 文档内容
    const fileData = ref({
      id: '',
      fileId: '',
      text: ''
    })
    onMounted(async () => {
      // 获取目录列表
      const res = await getBlogCatalogueTree(category.value)
      data.value = res.data
    })
    // 保存文档内容
    const saveFile = async (text) => {
      fileData.value.text = text
      const res = await updateText(fileData.value)
      fileData.value = res.data
    }
    // 获取文档内容
    const getFileData = async (id) => {
      const res = await getByFileId(id)
      fileData.value = res.data
    }
    // 子级组件目录列表和md编辑器引用
    const markdownAndCatalogueTreeRef = ref(null)
    // 新增目录
    const create = async (catalogue) => {
      const res = await createCatalogue(catalogue)
      if (res.status !== 'success') {
        return ElMessage.error('创建目录失败！')
      }
      data.value = res.data
      markdownAndCatalogueTreeRef.value.cancelCreateCatalogue()
      ElMessage.success('创建目录成功！')
    }
    // 删除目录
    const deleteById = async (currentNode) => {
      const idArr = []
      getPropListFromTree(currentNode, idArr, 'id', 'children')
      const res = await deleteByIdArr({
        idArr,
        category: currentNode.category
      })
      if (res.status !== 'success') {
        return ElMessage.error('删除操作失败！')
      }
      data.value = res.data
      ElMessage.success('删除操作成功！')
    }

    return {
      data,
      fileData,
      saveFile,
      getFileData,
      create,
      markdownAndCatalogueTreeRef,
      deleteById
    }
  }
}
</script>

<style scoped>

</style>
