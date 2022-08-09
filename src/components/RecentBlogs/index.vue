<template>
  <div class="recent-blog">
    <div v-if="recentBlogs.length === 0" class="blog-status">暂无博客...</div>
    <div v-else class="blog-status">最近编辑</div>
    <el-card class="recent-blog-card" v-for="item in recentBlogs" :key="item.id" @click="showRecentBlog(item)">
      <div class="blog-category-time">
        <span>{{ item.category }}</span>
        <span>{{ formatTimeToStr(item.lastUpdateTime) }}</span>
      </div>
      <h3 class="blog-title">{{ item.name }}</h3>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { IBlogCatalogue } from '../../api/blogCatalogue';
import { formatTime } from '../../utils/index'
defineProps<{ recentBlogs: Array<IBlogCatalogue> }>()
const emit = defineEmits(['showRecentBlog'])
const formatTimeToStr = (time?: number) => {
  return time ? formatTime(time) : ''
}
const showRecentBlog = (currentBlog: IBlogCatalogue) => {
  emit('showRecentBlog', currentBlog)
}
</script>

<style lang="scss" scoped>
.recent-blog {
  overflow: auto;
  color: var(--blog-color);

  .blog-status {
    line-height: 43px;
    font-size: 18px;
    font-weight: 800;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 10px;
    padding-left: 20px;
  }

  .recent-blog-card {
    cursor: pointer;
    width: 40%;
    margin-bottom: 10px;
    min-width: 480px;
    margin-left: 20px;

    .blog-category-time {
      display: flex;
      justify-content: space-between;
    }

    .blog-title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
