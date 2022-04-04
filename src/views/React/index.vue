<template>
  <blog-content :category="category"></blog-content>
</template>

<script>
import { ref } from 'vue'
import BlogContent from '@/components/BlogContent'

export default {
  name: 'React',
  components: {
    BlogContent
  },
  setup () {
    const category = ref('React')
    return {
      category
    }
  }
}
</script>

<style scoped>

</style>
