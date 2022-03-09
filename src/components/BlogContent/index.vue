<template>
  <markdown-and-catalogue-tree
    ref="markdownAndCatalogueTreeRef"
    :tree-list="data"
    :file-data="fileData"
    :category="category"
    @saveFile="saveFile"
    @getFileData="getFileData"
    @create="create"
  ></markdown-and-catalogue-tree>
</template>

<script>
import MarkdownAndCatalogueTree from '@/components/MarkdownAndCatalogueTree'
import { onMounted, ref, toRefs } from 'vue'
import { getBlogCatalogueTree, createCatalogue } from '@/api/blogCatalogue'
import { getByFileId, updateText } from '@/api/blogContent'

export default {
  name: 'BlogContent',
  components: { MarkdownAndCatalogueTree },
  props: {
    category: {
      type: String
    }
  },
  setup (props) {
    const { category } = toRefs(props)
    const data = ref([])
    const fileData = ref({
      id: '',
      fileId: '',
      text: ''
    })
    onMounted(async () => {
      const res = await getBlogCatalogueTree(category.value)
      data.value = res.data
    })
    const saveFile = async (text) => {
      fileData.value.text = text
      const res = await updateText(fileData.value)
      fileData.value = res.data
    }

    const getFileData = async (id) => {
      const res = await getByFileId(id)
      fileData.value = res.data
    }

    const markdownAndCatalogueTreeRef = ref(null)

    const create = async (catalogue) => {
      const res = await createCatalogue(catalogue)
      data.value = res.data
      markdownAndCatalogueTreeRef.value.cancelCreateCatalogue()
    }

    return {
      data,
      fileData,
      saveFile,
      getFileData,
      create,
      markdownAndCatalogueTreeRef
    }
  }
}
</script>

<style scoped>

</style>
