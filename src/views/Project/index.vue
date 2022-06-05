<template>
  <BlogContent :category="route.query.category"></BlogContent>
</template>

<script setup>
import BlogContent from '@/components/BlogContent'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>

</style>
