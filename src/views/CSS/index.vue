<template>
  <blog-content :category="category"></blog-content>
</template>

<script>
import { ref } from 'vue'
import BlogContent from '@/components/BlogContent'

export default {
  name: 'CSS',
  components: {
    BlogContent
  },
  setup () {
    const category = ref('CSS')
    return {
      category
    }
  }
}
</script>

<style scoped>

</style>
