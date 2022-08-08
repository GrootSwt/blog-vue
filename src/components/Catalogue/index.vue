<template>
  <div class="catalogue-tree">
    <!--菜单打开关闭按钮-->
    <el-button class="folder-btn" @click="catalogueTreeVisible = !catalogueTreeVisible" circle type="info">
      <el-icon>
        <folder-opened />
      </el-icon>
    </el-button>
    <!--抽屉文件列表-->
    <el-drawer v-model="catalogueTreeVisible" direction="ltr">
      <!--操作下拉列表-->
      <template #header>
        <div class="operation-list">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-icon :size="20">
                <circle-plus />
              </el-icon>&nbsp;
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="createCatalogue('1')">同级文档</el-dropdown-item>
                <el-dropdown-item @click="createCatalogue('2')">同级文件夹</el-dropdown-item>
                <el-dropdown-item @click="createCatalogue('3')" v-if="currentNode.type === '1'">子级文档</el-dropdown-item>
                <el-dropdown-item @click="createCatalogue('4')" v-if="currentNode.type === '1'">子级文件夹</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
      <!--树形目录-->
      <template #default>
        <el-tree :data="treeList" :props="treeProps" highlight-current @node-click="nodeClick">
          <template #default="{ node, data }">
            <el-icon :size="20">
              <folder v-if="data.type === '1'" />
              <document v-else />
            </el-icon>
            &nbsp;
            <el-dropdown trigger="hover" placement="bottom-start">
              <span class="el-dropdown-link">
                {{ node.label }}
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="data.type === '2'" @click="previewBlog(data)">预览模式</el-dropdown-item>
                  <el-dropdown-item @click="modifyCatalogue(data)">修改目录</el-dropdown-item>
                  <el-dropdown-item @click="deleteByNodeId(data)">删除博客</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-tree>
      </template>
    </el-drawer>
    <!--编辑目录（新增或修改）-->
    <el-dialog v-model="editCatalogueFlag" :title="editStatus === '1' ? '新增目录' : '修改目录'" width="30%"
      :before-close="cancelEditCatalogue">
      <el-form ref="catalogueFormRef" :model="catalogue" :rules="catalogueRules">
        <el-form-item label="目录名称" prop="name">
          <el-input v-model="catalogue.name" @keyup.enter="submitEditCatalogue"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelEditCatalogue">取消</el-button>
          <el-button type="primary" @click="submitEditCatalogue">
            {{ editStatus === '1' ? '新增' : '修改' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import { CirclePlus, FolderOpened, Folder, Document } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { IBlogCatalogue } from '../../api/blogCatalogue';

const props = defineProps<{
  // 博客类别
  category: string,
  // 目录
  treeList: Array<IBlogCatalogue>,
  // 当前节点
  currentNode: IBlogCatalogue
}>()
const emit = defineEmits(['nodeClick', 'previewBlog', 'deleteById', 'createOrModifyCatalogue'])
// 目录抽屉控制位
const catalogueTreeVisible = ref(false)
// 目录树配置
const treeProps = {
  children: 'children',
  label: 'name'
}
const { currentNode } = toRefs(props)
// 点击节点
const nodeClick = (data: IBlogCatalogue) => {
  // 将当前节点数据传给父级组件
  emit('nodeClick', data)
}
// 点击只读按钮
const previewBlog = (data: IBlogCatalogue) => {
  emit('previewBlog', data)
}
// 删除目录
const deleteByNodeId = (data: IBlogCatalogue) => {
  if (!data.id) return ElMessage.warning('请选择将要删除的目录节点！')
  let hasChildren = false
  if (data.children && data.children.length !== 0) {
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
    emit('deleteById', data)
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除！'
    })
  })
}
// 目录表单引用
const catalogueFormRef = ref<FormInstance>()
// 新增或修改状态
const editStatus = computed(() => {
  return catalogue.value.id ? '2' : '1'
})
// 新建或编辑目录对话框控制位
const editCatalogueFlag = ref(false)
// 新建或修改目录表单
const catalogue = ref({
  id: '',
  parentId: '',
  name: '',
  type: ''
})
// 目录表单校验规则
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
// 打开新建目录表单对话框
const createCatalogue = (createType: string) => {
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
  editCatalogueFlag.value = true
}
// 打开目录修改表单对话框
const modifyCatalogue = (data: IBlogCatalogue) => {
  catalogue.value = JSON.parse(JSON.stringify(data))
  editCatalogueFlag.value = true
}
// 博客类别
const { category } = toRefs(props)
// 提交目录表单
const submitEditCatalogue = () => {
  catalogueFormRef.value && catalogueFormRef.value.validate(valid => {
    if (!valid) {
      ElMessage.warning('请根据表单提示完善表单！')
    } else {
      emit('createOrModifyCatalogue', {
        category: category.value,
        ...catalogue.value
      })
    }
  })
}
// 关闭目录表单对话框
const cancelEditCatalogue = () => {
  catalogue.value.id = ''
  catalogue.value.parentId = ''
  catalogue.value.type = ''
  catalogue.value.name = ''
  editCatalogueFlag.value = false
}
const hiddenCatalogueTree = () => {
  catalogueTreeVisible.value = false
}

defineExpose({
  cancelEditCatalogue,
  hiddenCatalogueTree
})
</script>

<style lang="scss" scoped>
.catalogue-tree {

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
    cursor: pointer;
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
