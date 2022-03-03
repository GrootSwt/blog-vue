<template>
  <div class="blog-mark-down">
    <div class="blog-operation">
      <div>
        <el-button>创建文件夹</el-button>
        <el-button>创建文件</el-button>
        <el-button>删除</el-button>
      </div>
      <div>
        <el-button>保存草稿</el-button>
        <el-button>保存</el-button>
      </div>
    </div>
    <el-row :gutter="20" class="blog-mark-down-box">
      <el-col :span="6">
        <div class="blog-list"></div>
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
import { ref } from 'vue'

export default {
  name: 'index',
  components: {
    MdEditor
  },
  setup () {
    const text = ref('')
    return {
      text
    }
  }
}
</script>

<style lang="less" scoped>
@operationHeight: 60px;

.blog-mark-down {
  height: calc(100% - 10px);
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
      height: 100%;
      border: 1px solid #e6e6e6;
    }

    .editor-class {
      height: 100%;
    }
  }
}

</style>
