<template>
  <div class="blog-content">
    <div class="catalogue-box">
      <Catalogue :category="category" :treeList="catalogueTree" :currentNode="currentNode" @nodeClick="nodeClick"
      @editBlog="editBlog" @createOrModifyCatalogue="createOrModifyCatalogue" @deleteById="deleteById"
      ref="catalogueTreeRef"></Catalogue>
    </div>
    <!--markdown编辑器-->
    <div class="markdown-box" :class="{'recent-show': recentShowFlag}">
      <!--最近博客列表-->
      <RecentBlogs :recent-blogs="recentBlogs" @showRecentBlog="showRecentBlog" v-show="recentShowFlag"></RecentBlogs>
      <markdown v-show="!recentShowFlag" :preview-only="previewOnly" :file-data="fileData" @saveFile="saveFile"
      ref="markdownRef"></markdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getNewest, getBlogCatalogueTree, deleteByIdArr, editCatalogue, getById, IBlogCatalogue } from '../../api/blogCatalogue'
import { getByFileId, updateText } from '../../api/blogContent'
import { getPropListFromTree } from '../../utils'
import Catalogue from '../../components/Catalogue/index.vue'
import Markdown from '../../components/Markdown/index.vue'
import RecentBlogs from '../../components/RecentBlogs/index.vue'

const getRecentBlogs = async (category: string) => {
  const res2 = await getNewest(category)
  recentBlogs.value = res2.data
}

const getBlogCatalogue = async (category: string) => {
  const res2 = await getBlogCatalogueTree(category)
  catalogueTree.value = res2.data
}

const getCurrentNode = async (id: string) => {
  if (route.query.id) {
    const res = await getById(route.query.id as string)
    currentNode.value = res.data
    await getFileData(route.query.id as string)
  }
}

const props = defineProps<{
  category: string;
}>()
// 文档类别
const { category } = toRefs(props)
watch(category, async (value) => {
  currentNode.value = {
    id: '',
    parentId: '',
    name: '',
    type: '',
    category: '',
    children: []
  }
  if (route.query.id) {
    await getCurrentNode(route.query.id as string)
  }
  // 获取最近编辑的博客
  await getRecentBlogs(value)
  // 获取目录列表
  getBlogCatalogue(value)
})
// 目录列表
const catalogueTree = ref<Array<IBlogCatalogue>>([])
// 当前目录节点
const currentNode = ref<IBlogCatalogue>({
  id: '',
  parentId: '',
  name: '',
  type: '',
  category: '',
  children: []
})
// 最近博客列表是否展示控制位
const recentShowFlag = computed(() => {
  return !currentNode.value.id
})
const recentBlogs = ref<Array<IBlogCatalogue>>([])
const showRecentBlog = (currentBlog: IBlogCatalogue) => {
  currentNode.value = currentBlog
  getFileData(currentNode.value.id).then(() => {
    previewOnly.value = true
  })
}
// md编辑器引用
const markdownRef = ref()
// 目录节点点击
const nodeClick = (data: IBlogCatalogue) => {
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
            previewOnly.value = true
          })
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消保存！'
        })
        getFileData(currentNode.value.id).then(() => {
          catalogueTreeRef.value.hiddenCatalogueTree()
          previewOnly.value = true
        })
      })
    } else {
      getFileData(currentNode.value.id).then(() => {
        catalogueTreeRef.value.hiddenCatalogueTree()
        previewOnly.value = true
      })
    }
  }
}
const previewOnly = ref(true)
const editBlog = (data: IBlogCatalogue) => {
  currentNode.value = data
  getFileData(currentNode.value.id).then(() => {
    previewOnly.value = false
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
    await getCurrentNode(route.query.id as string)
  }
  // 获取最近编辑的博客
  await getRecentBlogs(category.value)
  // 获取目录列表
  await getBlogCatalogue(category.value)
})
// 保存文档内容
const saveFile = async (text: string) => {
  fileData.value.text = text
  const res = await updateText(fileData.value)
  if (res.status !== 'success') {
    return ElMessage.error('保存失败！')
  }
  ElMessage.success('保存成功！')
  fileData.value = res.data
}
// 获取文档内容
const getFileData = async (id: string) => {
  const res = await getByFileId(id)
  if (res.status !== 'success') {
    return ElMessage.error('获取博客内容失败！')
  }
  fileData.value = res.data
}
// 目录引用
const catalogueTreeRef = ref()
// 新增目录
const createOrModifyCatalogue = async (catalogue: IBlogCatalogue) => {
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
const deleteById = async (cNode: IBlogCatalogue) => {
  const idArr: Array<string> = []
  getPropListFromTree(cNode, idArr)
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
    currentNode.value = {
      id: '',
      parentId: '',
      name: '',
      type: '',
      category: '',
      children: []
    }
  }
  ElMessage.success('删除成功！')
}
</script>

<style lang="scss" scoped>
.blog-content {
  display: flex;
  height: 100%;

  .catalogue-box {
    box-sizing: border-box;
    width: 20%;
    height: 100%;
    border-top: 1px solid var(--border-color);
  }

  .markdown-box {
    width: 80%;
    height: 100%;
  }
  .recent-show {
    border-left: 1px solid var(--border-color);
  }
}
</style>
