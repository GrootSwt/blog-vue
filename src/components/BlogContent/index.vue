<template>
  <div class="blog-content">
    <!--目录-->
    <Catalogue :category="category" :treeList="catalogueTree" :currentNode="currentNode" @nodeClick="nodeClick"
      @previewBlog="previewBlog" @createOrModifyCatalogue="createOrModifyCatalogue" @deleteById="deleteById"
      ref="catalogueTreeRef"></Catalogue>
    <!--最近博客列表-->
    <RecentBlogs :recent-blogs="recentBlogs" @showRecentBlog="showRecentBlog" v-show="recentShowFlag"></RecentBlogs>
    <!--markdown编辑器-->
    <markdown v-show="!recentShowFlag" :preview-only="previewOnly" :file-data="fileData" @saveFile="saveFile"
      ref="markdownRef"></markdown>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getNewest, getBlogCatalogueTree, deleteByIdArr, editCatalogue, getById } from '@/api/blogCatalogue'
import { getByFileId, updateText } from '@/api/blogContent'
import { getPropListFromTree } from '@/utils'
import Catalogue from '@/components/Catalogue'
import Markdown from '@/components/Markdown'
import RecentBlogs from '@/components/RecentBlogs'

const getRecentBlogs = async (category) => {
  const res2 = await getNewest(category)
  recentBlogs.value = res2.data
}

const getBlogCatalogue = async (category) => {
  const res2 = await getNewest(category)
  recentBlogs.value = res2.data
}

const getCurrentNode = async (id) => {
  const res = await getById(route.query.id)
  currentNode.value = res.data
  await getFileData(route.query.id)
}

const props = defineProps({
  category: {
    type: String
  }
})
// 文档类别
const { category } = toRefs(props)
watch(category, async (value) => {
  currentNode.value = []
  if (route.query.id) {
    await getCurrentNode(route.query.id)
  }
  // 获取最近编辑的博客
  await getRecentBlogs(value)
  // 获取目录列表
  getBlogCatalogue(value)
})
// 目录列表
const catalogueTree = ref([])
// 当前目录节点
const currentNode = ref({
  id: '',
  parentId: '',
  name: '',
  type: '',
  children: []
})
// 最近博客列表是否展示控制位
const recentShowFlag = computed(() => {
  return !currentNode.value.id
})
const recentBlogs = ref([])
const showRecentBlog = (currentBlog) => {
  currentNode.value = currentBlog
  getFileData(currentNode.value.id).then(() => {
    previewOnly.value = false
  })
}
// md编辑器引用
const markdownRef = ref()
// 目录节点点击
const nodeClick = (data) => {
  currentNode.value = data
  if (currentNode.value.type === '2') {
    if (markdownRef.value.textIsChange()) {
      ElMessageBox.confirm(
        '当前文章已更改，是否保存？',
        '提示',
        {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        saveFile(markdownRef.value.getText()).then(() => {
          getFileData(currentNode.value.id).then(() => {
            catalogueTreeRef.value.hiddenCatalogueTree()
            previewOnly.value = false
          })
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消保存！'
        })
        getFileData(currentNode.value.id).then(() => {
          catalogueTreeRef.value.hiddenCatalogueTree()
          previewOnly.value = false
        })
      })
    } else {
      getFileData(currentNode.value.id).then(() => {
        catalogueTreeRef.value.hiddenCatalogueTree()
        previewOnly.value = false
      })
    }
  }
}
const previewOnly = ref(false)
const previewBlog = (data) => {
  currentNode.value = data
  getFileData(currentNode.value.id).then(() => {
    previewOnly.value = true
    catalogueTreeRef.value.hiddenCatalogueTree()
  })
}
// 文档内容
const fileData = ref({
  id: '',
  fileId: '',
  text: ''
})
const route = useRoute()
onMounted(async () => {
  if (route.query.id) {
    await getCurrentNode(route.query.id)
  }
  // 获取最近编辑的博客
  await getRecentBlogs(category.value)
  // 获取目录列表
  await getBlogCatalogue(category.value)
})
// 保存文档内容
const saveFile = async (text) => {
  fileData.value.text = text
  const res = await updateText(fileData.value)
  if (res.status !== 'success') {
    return ElMessage.error('保存失败！')
  }
  ElMessage.success('保存成功！')
  fileData.value = res.data
}
// 获取文档内容
const getFileData = async (id) => {
  const res = await getByFileId(id)
  if (res.status !== 'success') {
    return ElMessage.error('获取博客内容失败！')
  }
  fileData.value = res.data
}
// 目录引用
const catalogueTreeRef = ref()
// 新增目录
const createOrModifyCatalogue = async (catalogue) => {
  const res = await editCatalogue(catalogue)
  if (res.status !== 'success') {
    return ElMessage.error(catalogue.id ? '修改目录失败！' : '创建目录失败！')
  }
  catalogueTree.value = res.data
  catalogueTreeRef.value.cancelEditCatalogue()
  await getRecentBlogs(category.value)
  ElMessage.success(catalogue.id ? '修改目录成功！' : '创建目录成功！')
}
// 删除目录
const deleteById = async (cNode) => {
  const idArr = []
  getPropListFromTree(cNode, idArr, 'id', 'children')
  const res = await deleteByIdArr({
    idArr,
    category: cNode.category
  })
  if (res.status !== 'success') {
    return ElMessage.error('删除失败！')
  }
  catalogueTree.value = res.data
  await getRecentBlogs(category.value)
  if (idArr.indexOf(currentNode.value.id) !== -1) {
    currentNode.value = {}
  }
  ElMessage.success('删除成功！')
}
</script>

<style lang="scss" scoped>
.blog-content {
  height: 100%;
}
</style>
