<template>
  <div class="blog-mark-down">
    <!--菜单打开关闭按钮-->
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
        <div class="operation-list" v-show="isBlogMenuShow">
          <el-dropdown>
          <span class="el-dropdown-link">
            <el-icon :size="20"><circle-plus/></el-icon>
            &nbsp;
            <span>新建到此处</span>
          </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="createCatalogue('1')">同级文档</el-dropdown-item>
                <el-dropdown-item @click="createCatalogue('2')">同级文件夹</el-dropdown-item>
                <el-dropdown-item @click="createCatalogue('3')" v-if="currentNode.type ==='1'">子级文档</el-dropdown-item>
                <el-dropdown-item @click="createCatalogue('4')" v-if="currentNode.type ==='1'">子级文件夹</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="danger" size="small" :icon="deleteIcon" circle @click="deleteByNodeId">
          </el-button>
        </div>
      </template>
      <template #default>
        <el-tree
          :data="treeList"
          :props="treeProps"
          highlight-current
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
    <!--创建新目录-->
    <el-dialog
      v-model="createCatalogueFlag"
      title="新建目录"
      width="30%"
      :before-close="cancelCreateCatalogue"
    >
      <el-form
        ref="catalogueFormRef"
        :model="catalogue"
        :rules="catalogueRules"
      >
        <el-form-item label="目录名称" prop="name">
          <el-input v-model="catalogue.name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelCreateCatalogue">取消</el-button>
        <el-button type="primary" @click="submitCreateCatalogue">
          创建
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { reactive, ref, toRefs, watch } from 'vue'
import { Folder, Document, CirclePlus, FolderOpened, Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'index',
  components: {
    // markdown编辑器
    MdEditor,
    Folder,
    Document,
    CirclePlus,
    FolderOpened
  },
  props: {
    // 目录
    treeList: Array,
    // 文档内容
    fileData: Object,
    // 文档类别（Java等）
    category: String
  },
  setup (props, { emit }) {
    // 当前屏幕宽度
    const clientWidth = document.body.clientWidth
    // 文档目录抽屉是否展示
    const blogTreeVisible = ref(false)
    // 文档目录抽屉宽度
    const drawerWidth = ref(clientWidth <= 800 ? '100%' : '30%')
    // 是否展示文档目录操作按钮
    const isBlogMenuShow = ref(clientWidth > 800)
    // 是否预览模式
    const previewOnly = ref(clientWidth <= 800)
    // 监听屏幕宽度变化
    window.onresize = () => {
      const clientWidth = document.body.clientWidth
      // 屏幕宽度小于800px
      if (clientWidth <= 800) {
        // 目录抽屉宽度为屏幕宽度
        drawerWidth.value = '100%'
        // 不展示目录操作列表
        isBlogMenuShow.value = false
        // 文档内容只读
        previewOnly.value = true
      } else {
        drawerWidth.value = '30%'
        isBlogMenuShow.value = true
        previewOnly.value = false
      }
    }

    const {
      // 当前markdown文件数据
      fileData,
      // 文档类别
      category
    } = toRefs(props)

    // 获取文档内容
    watch(fileData, (newValue) => {
      oldText.value = newValue.text ? newValue.text : ''
      text.value = newValue.text ? newValue.text : ''
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
      type: '',
      children: []
    })

    // 文章原始内容
    const oldText = ref('')
    // 当前文章内容
    const text = ref('')
    // 点击目录节点
    const handleNodeClick = (data) => {
      // 文档内容改变，打开是否保存当前文档内容的提示框
      if (oldText.value !== text.value) {
        open(data)
      } else {
        // 更改节点
        changeOtherNode(data)
      }
    }
    // 保存文章内容
    const save = () => {
      emit('saveFile', text.value)
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
        emit('getFileData', currentNode.value.id)
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
    // 新建目录
    const catalogue = ref({
      type: '',
      parentId: '',
      name: ''
    })
    const catalogueRules = ref({
      name: [
        {
          required: true,
          message: '请输入目录名称！',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '目录名称字符长度在3-20之间！',
          trigger: 'blur'
        }
      ]
    })
    // 新建目录对话框标志位
    const createCatalogueFlag = ref(false)
    // 打开新建目录对话框
    const createCatalogue = (createType) => {
      const { parentId: currentParentId } = currentNode.value
      const { id: currentId } = currentNode.value
      switch (createType) {
        // 同级文档
        case '1':
          catalogue.value.parentId = currentParentId || '-1'
          catalogue.value.type = '2'
          break
        // 同级文件夹
        case '2':
          catalogue.value.parentId = currentParentId || '-1'
          catalogue.value.type = '1'
          break
        // 子级文档
        case '3':
          catalogue.value.parentId = currentId || '-1'
          catalogue.value.type = '2'
          break
        // 子级文件夹
        case '4':
          catalogue.value.parentId = currentId || '-1'
          catalogue.value.type = '1'
          break
      }
      createCatalogueFlag.value = true
    }
    const cancelCreateCatalogue = () => {
      catalogue.value.parentId = ''
      catalogue.value.type = ''
      catalogue.value.name = ''
      createCatalogueFlag.value = false
    }
    // TODO 提交表单和表单校验
    const catalogueFormRef = ref(null)
    const submitCreateCatalogue = () => {
      catalogueFormRef.value.validate(valid => {
        if (!valid) {
          ElMessage.warning('请根据表单提示完善表单！')
        } else {
          emit('create', {
            category: category.value,
            ...catalogue.value
          })
        }
      })
    }
    // 删除图标
    const deleteIcon = Delete
    const deleteByNodeId = () => {
      if (!currentNode.value.id) return ElMessage.warning('请选择将要删除的目录节点！')
      let hasChildren = false
      if (currentNode.value.children && currentNode.value.children.length !== 0) {
        hasChildren = true
      }
      ElMessageBox.confirm(
        hasChildren ? '当前目录节点下存在子节点，是否继续删除？' : '是否删除？',
        '提示',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        emit('deleteById', currentNode)
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消删除！'
        })
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
      previewOnly,
      createCatalogue,
      createCatalogueFlag,
      catalogue,
      catalogueRules,
      cancelCreateCatalogue,
      submitCreateCatalogue,
      catalogueFormRef,
      deleteIcon,
      deleteByNodeId
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

  // 下拉菜单样式
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }

  // 暗色主题markdown编辑器样式
  .md-dark {
    height: 100%;
  }
  // 亮色主题markdown编辑器样式
  .md {
    height: 100%;
  }
  // 操作列表样式
  .operation-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-right: 10px;
  }
}
</style>
