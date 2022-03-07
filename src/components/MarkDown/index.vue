<template>
  <div class="blog-mark-down">
    <el-button
      class="folder-btn"
      @click="blogTreeVisible = !blogTreeVisible"
      circle
      type="info"
    >
      <el-icon>
        <folder-opened/>
      </el-icon>
    </el-button>
    <!--抽屉文件列表-->
    <el-drawer
      v-model="blogTreeVisible"
      direction="ltr"
      :size="drawerWidth"
    >
      <template #title>
        <el-dropdown>
          <span class="el-dropdown-link" v-show="isBlogMenuShow">
            <el-icon :size="20"><circle-plus/></el-icon>
            &nbsp;
            <span>新建到此处</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>同级文档</el-dropdown-item>
              <el-dropdown-item>同级文件夹</el-dropdown-item>
              <el-dropdown-item>子级文档</el-dropdown-item>
              <el-dropdown-item>子级文件夹</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template #default>
        <el-tree
          :data="treeList"
          :props="treeProps"
          @node-click="handleNodeClick"
        >
          <template #default="{ node,data }">
            <el-icon :size="20">
              <folder v-if="data.type === '1'"/>
              <document v-else/>
            </el-icon>
            &nbsp;
            <span>{{ node.label }}</span>
          </template>
        </el-tree>
      </template>
    </el-drawer>
    <!--markdown编辑器-->
    <template v-if="previewOnly">
      <md-editor
        theme="dark"
        v-model="text"
        :previewOnly="true"
      >
      </md-editor>
    </template>
    <template v-else>
      <md-editor
        theme="dark"
        editor-class="editor-class"
        v-model="text"
        @on-save="saveFile"
      >
      </md-editor>
    </template>
  </div>
</template>

<script>
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { reactive, ref, toRefs, watch } from 'vue'
import { Folder, Document, CirclePlus, FolderOpened } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'index',
  components: {
    MdEditor,
    Folder,
    Document,
    CirclePlus,
    FolderOpened
  },
  props: {
    treeList: Array,
    fileData: Object
  },
  setup (props, { emit }) {
    // 监听屏幕宽度变化
    window.onresize = () => {
      const clientWidth = document.body.clientWidth
      if (clientWidth <= 800) {
        drawerWidth.value = '100%'
        isBlogMenuShow.value = false
        previewOnly.value = true
      } else {
        drawerWidth.value = '30%'
        isBlogMenuShow.value = true
        previewOnly.value = false
      }
    }
    const clientWidth = document.body.clientWidth
    // 文档目录抽屉是否展示
    const blogTreeVisible = ref(false)
    // 文档目录抽屉宽度
    const drawerWidth = ref(clientWidth <= 800 ? '100%' : '30%')
    // 是否展示文档目录操作按钮
    const isBlogMenuShow = ref(clientWidth > 800)
    // 是否预览模式
    const previewOnly = ref(clientWidth <= 800)
    // 当前markdown文件数据
    const { fileData } = toRefs(props)
    // 当markdown文件数据改变时，获取文档内容
    watch(fileData, (newValue) => {
      oldText.value = newValue.text
      text.value = newValue.text
    })
    // 树形结构配置项
    const treeProps = reactive({
      children: 'children',
      label: 'name'
    })
    // 当前节点
    const currentNode = ref({
      id: '',
      parentId: '',
      name: '',
      type: ''
    })
    // 文章原始内容
    const oldText = ref('')
    // 当前文章内容
    const text = ref('')
    // 点击节点
    const handleNodeClick = (data) => {
      if (oldText.value !== text.value) {
        open(data)
      } else {
        changeOtherNode(data)
      }
    }
    // 保存文章内容
    const save = () => {
      emit('saveFile', text)
    }
    // 点击保存按钮或者快捷键保存
    const saveFile = () => {
      save()
      oldText.value = text.value
    }
    // 清空编辑器内容
    const clearText = () => {
      oldText.value = ''
      text.value = ''
    }
    // 改变节点获取文章内容
    const changeOtherNode = (data) => {
      currentNode.value = data
      // 当前点击的为文件夹时清空oldText和text
      if (currentNode.value.type === '1') {
        clearText()
      } else {
        // TODO 获取文章内容
        emit('getFileData', currentNode.value.id)
        blogTreeVisible.value = false
      }
    }
    // 打开文件是否需要保存提示框
    const open = (data) => {
      ElMessageBox.confirm(
        '当前文章已更改，是否保存？',
        '提示',
        {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        save()
        ElMessage({
          type: 'success',
          message: '保存成功！'
        })
        changeOtherNode(data)
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消保存！'
        })
        changeOtherNode(data)
      })
    }
    return {
      currentNode,
      treeProps,
      handleNodeClick,
      save,
      saveFile,
      blogTreeVisible,
      isBlogMenuShow,
      drawerWidth,
      text,
      previewOnly
    }
  }
}
</script>

<style lang="less" scoped>
// 整个markdown编辑器样式
.blog-mark-down {
  height: 100%;
  // 抽屉展开按钮样式
  .folder-btn {
    position: absolute;
    right: 10px;
    top: 25%;
    z-index: 2023;
  }

  // 抽屉样式
  :deep(.el-drawer) {
    background-color: var(--blog-dark-background-color);
    color: var(--blog-dark-font-color);
  }

  // 抽屉头样式
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    display: flex;
    align-items: center;
  }

  // 下拉菜单样式
  .el-dropdown-link {
    cursor: pointer;
    color: var(--blog-dark-font-color);
    display: flex;
    align-items: center;
  }

  // 目录下拉操作菜单
  .el-dropdown-menu {
    background-color: var(--blog-dark-background-color);
    border: none;
  }

  // 目录下拉项
  .el-dropdown-menu__item {
    color: var(--blog-dark-font-color);
  }

  // 树形目录
  .el-tree {
    background: var(--blog-dark-background-color);
    color: var(--blog-dark-font-color);
    --el-tree-node-hover-bg-color: var(--blog-dark-font-color);
    --el-tree-text-color: var(--blog-dark-font-color);
    --el-tree-expand-icon-color: var(--blog-dark-font-color);
  }

  // markdown编辑器样式
  .md-dark {
    height: 100%;
    background-color: var(--blog-dark-background-color);
    color: var(--blog-dark-font-color);
  }
}
</style>
