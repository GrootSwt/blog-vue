<template>
  <mark-down
    :tree-list="data"
    :file-data="fileData"
    @saveFile="saveFile"
    @getFileData="getFileData"
  ></mark-down>
</template>

<script>
import MarkDown from '@/components/MarkDown'
import { ref } from 'vue'

export default {
  name: 'Java',
  components: { MarkDown },
  setup () {
    const data = ref([])
    const fileData = ref({
      id: '',
      fileId: '',
      text: ''
    })
    data.value = [
      {
        id: '1',
        parentId: '0',
        name: 'Java基础',
        type: '1',
        children: [
          {
            id: '2',
            parentId: '1',
            name: '类加载器',
            type: '2'
          },
          {
            id: '3',
            parentId: '1',
            name: 'JVM',
            type: '2'
          }
        ]
      }
    ]
    const fileDataList = [
      {
        id: '1',
        fileId: '2',
        text: '### 333'
      },
      {
        id: '2',
        fileId: '3',
        text: '### 444444'
      }
    ]
    const saveFile = (text) => {
      fileData.value.text = text.value
    }

    const getFileData = (id) => {
      fileData.value = fileDataList.filter(item => item.fileId === id)[0]
    }

    return {
      data,
      fileData,
      saveFile,
      getFileData
    }
  }
}
</script>

<style scoped>

</style>
