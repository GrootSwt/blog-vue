<template>
  <BlogContent :category="category"></BlogContent>
</template>

<script setup>
import { ref } from 'vue'
import BlogContent from '@/components/BlogContent'

const category = ref('HTML')
</script>

<style scoped>

</style>
