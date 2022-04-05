<template>
  <div class="blog-content">
    <!--目录-->
    <catalogue-tree
      :category="category"
      :tree-list="catalogueTree"
      :current-node="currentNode"
      @nodeClick="nodeClick"
      @previewBlog="previewBlog"
      @createOrModifyCatalogue="createOrModifyCatalogue"
      @deleteById="deleteById"
      ref="catalogueTreeRef"
    ></catalogue-tree>
    <!--最近博客列表-->
    <recent-blogs
      :recent-blogs="recentBlogs"
      @showRecentBlog="showRecentBlog"
      v-show="recentShowFlag"
    ></recent-blogs>
    <!--markdown编辑器-->
    <markdown
      v-show="!recentShowFlag"
      :preview-only="previewOnly"
      :file-data="fileData"
      @saveFile="saveFile"
      ref="markdownRef"
    ></markdown>
  </div>
</template>

<script>
import { computed, onMounted, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { getNewest, getBlogCatalogueTree, deleteByIdArr, editCatalogue, getById } from '@/api/blogCatalogue'
import { getByFileId, updateText } from '@/api/blogContent'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPropListFromTree } from '@/utils'
import Markdown from '@/components/Markdown'
import CatalogueTree from '@/components/CatalogueTree'
import RecentBlogs from '@/components/RecentBlogs'

export default {
  name: 'BlogContent',
  components: {
    RecentBlogs,
    CatalogueTree,
    Markdown
  },
  props: {
    category: {
      type: String
    }
  },
  setup (props) {
    // 文档类别
    const { category } = toRefs(props)
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
      return !currentNode.value.id && currentNode.value.id === ''
    })
    const recentBlogs = ref([])
    const showRecentBlog = (currentBlog) => {
      currentNode.value = currentBlog
      getFileData(currentNode.value.id).then(() => {
        previewOnly.value = false
      })
    }
    // md编辑器引用
    const markdownRef = ref(null)
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
        const res = await getById(route.query.id)
        currentNode.value = res.data
        await getFileData(route.query.id)
      }
      // 获取最近编辑的博客
      const res2 = await getNewest(category.value)
      recentBlogs.value = res2.data
      // 获取目录列表
      const res3 = await getBlogCatalogueTree(category.value)
      catalogueTree.value = res3.data
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
      // ElMessage.success('获取博客内容成功！')
    }
    // 目录引用
    const catalogueTreeRef = ref(null)
    // 新增目录
    const createOrModifyCatalogue = async (catalogue) => {
      const res = await editCatalogue(catalogue)
      if (res.status !== 'success') {
        return ElMessage.error(catalogue.id ? '修改目录失败！' : '创建目录失败！')
      }
      catalogueTree.value = res.data
      catalogueTreeRef.value.cancelEditCatalogue()
      ElMessage.success(catalogue.id ? '修改目录成功！' : '创建目录成功！')
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
        return ElMessage.error('删除失败！')
      }
      catalogueTree.value = res.data
      ElMessage.success('删除成功！')
    }

    return {
      recentShowFlag,
      recentBlogs,
      showRecentBlog,
      catalogueTree,
      currentNode,
      nodeClick,
      previewOnly,
      previewBlog,
      fileData,
      saveFile,
      getFileData,
      createOrModifyCatalogue,
      markdownRef,
      catalogueTreeRef,
      deleteById
    }
  }
}
</script>

<style lang="less" scoped>
.blog-content {
  height: 100%;
}
</style>
