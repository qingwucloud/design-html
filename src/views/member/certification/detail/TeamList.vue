<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="teamList" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="用户名" prop="inviteeName" />
      <el-table-column label="成员类型" prop="memberTypeDesc" />
      <el-table-column label="累计佣金" prop="commissionSum" />
      <el-table-column label="加入时间" prop="acceptTime" />
      <el-table-column label="本月佣金" prop="commissionMonthSum" />
      <el-table-column label="佣金笔数" prop="commissionBatchSum" />
      <el-table-column label="总佣金" prop="commissionAmount" />
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup>
import { ref, onMounted } from 'vue'
defineOptions({ name: 'DesignerInfoTeamList' })
defineProps({
  bindUserId: {
    type: [String, Number],
    required: true
  }
})

const loading = ref(false)
const teamList = ref([])
const total = ref(0)
const queryParams = ref({
  pageNo: 1,
  pageSize: 10
})

// 模拟获取团队列表数据
const getTeamList = async () => {
  loading.value = true
  try {
    // const res = await TeamApi.getTeamList({
    //   ...queryParams.value,
    //   userId: props.bindUserId
    // })
  } catch (error) {
    console.error('获取团队列表失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getTeamList()
})
</script>

<style lang="scss" scoped>
.team-list-container {
  padding: 10px 0;
}

.pagination-container {
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
