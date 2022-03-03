<template>
  <div class="blog-mark-down">
    <div class="blog-operation">
      <div>
        <el-button>创建同级文件夹</el-button>
        <el-button v-show="currentNode.type === '1'">创建子级文件夹</el-button>
        <el-button>创建同级文件</el-button>
        <el-button v-show="currentNode.type === '1'">创建子级文件</el-button>
        <el-button>删除</el-button>
      </div>
      <div>
        <el-button v-show="currentNode.type === '2'" @click="save(true)">保存草稿</el-button>
        <el-button v-show="currentNode.type === '2'" @click="save(false)">保存</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="blog-mark-down-box">
      <el-col :span="6">
        <div class="blog-list">
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
        </div>
      </el-col>
      <el-col :span="18">
        <md-editor
          editor-class="editor-class"
          v-model="text"
        >
        </md-editor>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { reactive, ref, toRefs, watch } from 'vue'
import { Folder, Document } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'index',
  components: {
    MdEditor,
    Folder,
    Document
  },
  props: {
    treeList: Array,
    fileData: Object
  },
  setup (props, { emit }) {
    const { fileData } = toRefs(props)
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
    const save = (isDraft) => {
      emit('saveFile', text, currentNode.value.id, isDraft)
      clearText()
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
      }
    }

    const open = (data) => {
      ElMessageBox.confirm(
        '当前文章已更改，是否保存？',
        'Warning',
        {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // TODO 保存文章内容
          save(true)
          ElMessage({
            type: 'success',
            message: '保存成功！'
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消保存！'
          })
        })
    }
    return {
      currentNode,
      treeProps,
      handleNodeClick,
      save,
      text
    }
  }
}
</script>

<style lang="less" scoped>
@operationHeight: 60px;
@blogMargin: 10px;
@blogPadding: 10px;

.blog-mark-down {
  height: calc(100% - @blogMargin);
  margin: 0 10px 10px;

  .blog-operation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: @operationHeight;
  }

  .blog-mark-down-box {
    height: calc(100% - @operationHeight);

    .blog-list {
      background: #ffffff;
      height: calc(100% - 2 * @blogPadding);
      border: 1px solid #e6e6e6;
      padding: @blogPadding;
    }

    .editor-class {
      height: 100%;
    }
  }
}

</style>
