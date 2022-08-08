<template>
  <BlogContent :category="route.query.category"></BlogContent>
</template>

<script setup lang="ts">
import BlogContent from '/src/components/BlogContent/index.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>

</style>
