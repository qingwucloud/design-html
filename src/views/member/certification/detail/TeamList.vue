<template>
  <div class="team-list-container">
    <el-table v-loading="loading" :data="teamList" border style="width: 100%">
      <el-table-column label="团队名称" prop="name" />
      <el-table-column label="成员数量" prop="memberCount" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="状态" prop="status">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '活跃' : '未活跃' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNo"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
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
    // 这里替换为实际的API调用
    // const res = await TeamApi.getTeamList({
    //   ...queryParams.value,
    //   userId: props.bindUserId
    // })

    // 模拟数据
    setTimeout(() => {
      teamList.value = [
        {
          id: 1,
          name: '设计团队A',
          memberCount: 5,
          createTime: '2023-01-15 10:00:00',
          status: 1
        },
        {
          id: 2,
          name: '设计团队B',
          memberCount: 3,
          createTime: '2023-02-20 14:30:00',
          status: 1
        }
      ]
      total.value = 2
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取团队列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleSizeChange = () => {
  queryParams.value.pageNo = 1
  getTeamList()
}

const handleCurrentChange = () => {
  getTeamList()
}

const handleDetail = (row) => {
  console.log('查看团队详情', row)
  // 实现查看详情功能
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
