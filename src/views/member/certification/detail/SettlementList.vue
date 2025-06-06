<template>
  <div class="settlement-list-container">
    <el-table v-loading="loading" :data="settlementList" border style="width: 100%">
      <el-table-column label="结算单号" prop="settlementNo" />
      <el-table-column label="关联合同" prop="contractName" />
      <el-table-column label="结算金额" prop="amount">
        <template #default="{ row }"> ¥ {{ row.amount }} </template>
      </el-table-column>
      <el-table-column label="结算时间" prop="settlementTime" />
      <el-table-column label="状态" prop="status">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleDetail(row)">查看详情</el-button>
          <el-button v-if="row.status === 0" type="success" link @click="handleConfirm(row)"
            >确认</el-button
          >
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
defineOptions({ name: 'DesignerInfoSettlementList' })
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

defineProps({
  bindUserId: {
    type: [String, Number],
    required: true
  }
})

const loading = ref(false)
const settlementList = ref([])
const total = ref(0)
const queryParams = ref({
  pageNo: 1,
  pageSize: 10
})

// 模拟获取结算记录列表数据
const getSettlementList = async () => {
  loading.value = true
  try {
    // 这里替换为实际的API调用
    // const res = await SettlementApi.getSettlementList({
    //   ...queryParams.value,
    //   userId: props.bindUserId
    // })

    // 模拟数据
    setTimeout(() => {
      settlementList.value = [
        {
          id: 1,
          settlementNo: 'JS-2023001',
          contractName: '室内设计合同A',
          amount: '2500.00',
          settlementTime: '2023-07-15',
          status: 1
        },
        {
          id: 2,
          settlementNo: 'JS-2023002',
          contractName: '景观设计合同B',
          amount: '4000.00',
          settlementTime: '2023-07-20',
          status: 0
        },
        {
          id: 3,
          settlementNo: 'JS-2023003',
          contractName: '建筑设计合同C',
          amount: '6000.00',
          settlementTime: '2023-08-05',
          status: 2
        }
      ]
      total.value = 3
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取结算记录失败', error)
  } finally {
    loading.value = false
  }
}

const getStatusText = (status) => {
  const statusMap = {
    0: '待确认',
    1: '已确认',
    2: '已支付'
  }
  return statusMap[status] || '未知状态'
}

const getStatusType = (status) => {
  const typeMap = {
    0: 'warning',
    1: 'primary',
    2: 'success'
  }
  return typeMap[status] || 'info'
}

const handleSizeChange = () => {
  queryParams.value.pageNo = 1
  getSettlementList()
}

const handleCurrentChange = () => {
  getSettlementList()
}

const handleDetail = (row) => {
  console.log('查看结算详情', row)
  // 实现查看详情功能
}

const handleConfirm = (row) => {
  ElMessageBox.confirm(`确认结算单"${row.settlementNo}"?`, '确认操作', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // 这里调用确认接口
      ElMessage.success('结算单确认成功')
      // 刷新结算记录列表
      getSettlementList()
    })
    .catch(() => {})
}

onMounted(() => {
  getSettlementList()
})
</script>

<style lang="scss" scoped>
.settlement-list-container {
  padding: 10px 0;
}

.pagination-container {
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
