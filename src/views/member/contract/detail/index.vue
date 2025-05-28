<template>
  <div v-loading="loading">
    <el-row :gutter="10" />111
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'MemberDetail' })
const loading = ref(true) // 加载中
const { currentRoute } = useRouter() // 路由
const route = useRoute()
const id = route.params.id

onMounted(() => {})
</script>
<style lang="css" scoped></style>
