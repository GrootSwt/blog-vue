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

<script setup lang="ts">
import { onMounted } from 'vue'
import BlogMenu from './BlogMenu.vue'
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
    background-color: var(--blog-bg-color);
    padding: 0;
  }

  .el-main {
    padding: 0;
    background-color: var(--blog-bg-color);
  }
}
</style>
