<template>
  <RecentBlogs
    :recent-blogs="recentBlogs"
    @showRecentBlog="showRecentBlog"
  ></RecentBlogs>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RecentBlogs from '../../components/RecentBlogs/index.vue'
import enums from '../enums'
import { useRouter } from 'vue-router'
import { getNewest, IBlogCatalogue } from '../../api/blogCatalogue'

const recentBlogs = ref<Array<IBlogCatalogue>>([])
onMounted(async () => {
  // 获取最近编辑的博客
  const res = await getNewest()
  recentBlogs.value = res.data
})
const router = useRouter()
const showRecentBlog = (currentBlog: IBlogCatalogue) => {
  const categories = enums.categories.filter(item => item.name === currentBlog.category)
  if (categories.length === 1) {
    router.push({
      path: categories[0].path,
      query: {
        id: currentBlog.id,
        category: currentBlog.category
      }
    })
  }
}
</script>
