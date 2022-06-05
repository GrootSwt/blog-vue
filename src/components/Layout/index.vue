<template>
  <el-container>
    <el-header>
      <BlogMenu :menuList="state.routeTree"></BlogMenu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { onMounted } from 'vue'
import BlogMenu from '@/components/Layout/BlogMenu'
import { useStore } from 'vuex'
const { state, dispatch } = useStore()
onMounted(async () => {
  dispatch('getRouteTree')
})
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;

  .el-header {
    background-color: var(--blog-header-bg-color);
    padding: 0;
  }

  .el-main {
    padding: 0;
    background-color: var(--blog-main-bg-color);
  }
}
</style>
