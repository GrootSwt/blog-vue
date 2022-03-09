<template>
  <blog-content :category="category"></blog-content>
</template>

<script>
import { ref } from 'vue'
import BlogContent from '@/components/BlogContent'

export default {
  name: 'Spring',
  components: {
    BlogContent
  },
  setup () {
    const category = ref('Spring')
    return {
      category
    }
  }
}
</script>

<style scoped>

</style>
