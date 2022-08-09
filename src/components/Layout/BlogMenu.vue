<template>
  <div class="blog-menu-list">
    <el-link class="blog-menu-item" :class="{ 'active-item': activePath === menu.path }" :underline="false"
      v-for="menu in menuList" :key="menu.name" @click="toMenuPage(menu.path, menu.name)">
      {{ menu.name }}
    </el-link>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { IBlogRoute } from '../../api/blogRoute';

const props = defineProps({
  menuList: {
    type: Array<IBlogRoute>
  }
})
// 当前路由显示
const activePath = ref('')
const $route = useRoute()
watch($route, (v) => {
  activePath.value = v.path
}, { immediate: true })
// 路由跳转
const router = useRouter()
const toMenuPage = (path: string, name: string) => {
  router.push({ path, query: { category: name } })
}
</script>

<style lang="scss" scoped>
// 菜单列表
.blog-menu-list {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 80%;
  height: 100%;
  margin-left: 10%;

  // 菜单项
  .blog-menu-item {
    color: var(--blog-color);
    transition: color 0.2s;
    font-size: 18px;
  }

  .blog-menu-item:hover {
    color: var(--blog-menu-item-active);
  }

  .active-item {
    color: var(--blog-menu-item-active);
  }
}

// 屏幕宽度变小后，去掉margin
@media screen and (max-width: 800px) {
  .blog-menu-list {
    width: 100%;
    margin-left: 0;
  }
}
</style>
