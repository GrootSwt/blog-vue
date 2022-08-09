<template>
  <RecentBlogs
    :recent-blogs="recentBlogs"
    @showRecentBlog="showRecentBlog"
  ></RecentBlogs>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RecentBlogs from '../../components/RecentBlogs/index.vue'
import { useRouter } from 'vue-router'
import { getNewest, IBlogCatalogue } from '../../api/blogCatalogue'
import { useAppStore } from '../../store'

const { state } = useAppStore();
const recentBlogs = ref<Array<IBlogCatalogue>>([])
onMounted(async () => {
  // 获取最近编辑的博客
  const res = await getNewest()
  recentBlogs.value = res.data
})
const router = useRouter()
const showRecentBlog = (currentBlog: IBlogCatalogue) => {
  const category = state.routeTree.find(a => a.name === currentBlog.category)
  if (category) {
    router.push({
      path: category.path,
      query: {
        id: currentBlog.id,
        category: currentBlog.category
      }
    })
  }
}
</script>
