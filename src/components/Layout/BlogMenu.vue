<template>
  <div class="blog-menu-list">
    <el-link
      class="blog-menu-item"
      :underline="false"
      v-for="menu in menuList"
      :key="menu.name"
      @click="toMenuPage(menu.path)"
    >
      {{ menu.name }}
    </el-link>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'BlogMenu',
  props: {
    menuList: {
      type: Array
    }
  },
  setup () {
    const router = useRouter()
    const toMenuPage = (path) => {
      router.push({ path })
    }
    return {
      toMenuPage
    }
  }
}
</script>

<style scoped lang="less">
// 菜单列表
.blog-menu-list {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 50%;
  height: 100%;
  margin-left: 25%;
  // 菜单项
  .blog-menu-item {
    color: #999;
    transition: color 0.2s;
    font-size: 18px;
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
