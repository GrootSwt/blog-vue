<template>
  <BlogContent :category="(route.query.category as string)"></BlogContent>
</template>

<script setup lang="ts">
import BlogContent from '../../components/BlogContent/index.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>

</style>
