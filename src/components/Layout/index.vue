<template>
  <el-container>
    <el-header>
      <blog-menu :menuList="menuList"></blog-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import { reactive } from 'vue'
import BlogMenu from '@/components/Layout/BlogMenu'

export default {
  name: 'Layout',
  components: { BlogMenu },
  setup () {
    const menuList = reactive([
      {
        name: 'Java',
        path: '/java'
      },
      {
        name: 'Spring',
        path: '/spring'
      },
      {
        name: 'HTML',
        path: '/html'
      },
      {
        name: 'JavaScript',
        path: '/java-script'
      },
      {
        name: 'CSS',
        path: '/css'
      },
      {
        name: 'VUE',
        path: '/vue'
      }
    ])
    return {
      menuList
    }
  }
}
</script>

<style scoped lang="less">

.el-container {
  background: #f6f6f6;
  height: 100%;

  .el-header {
    background: #303030;
    padding: 0;
  }

  .el-main {
    padding: 0;
  }
}
</style>
