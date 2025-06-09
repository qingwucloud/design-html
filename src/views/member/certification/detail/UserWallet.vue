<template>
  <el-descriptions :column="1">
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label label="可用余额" />
      </template>
      {{ formData.availableBalance }} 元
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <descriptions-item-label label="冻结余额" />
      </template>
      {{ formData.frozenBalance }} 元
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <descriptions-item-label label="已提现金额" />
      </template>
      {{ formData.withdrawnAmount }} 元
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label label="累计收入总额" />
      </template>
      {{ formData.totalCommission }} 元
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label label="最后结算时间" />
      </template>
      {{
        formData.lastSettlementTime
          ? formatTime(formData.lastSettlementTime, 'YYYY-MM-DD HH:mm:ss')
          : '未结算'
      }}
    </el-descriptions-item>
  </el-descriptions>
</template>
<script lang="ts" setup>
import { DescriptionsItemLabel } from '@/components/Descriptions'
import { WalletRecordApi } from '@/api/member/wallet'
import { formatTime } from '@/utils'
const route = useRoute()
const formData = ref({
  totalCommission: 0,
  availableBalance: 0,
  frozenBalance: 0,
  withdrawnAmount: 0,
  lastSettlementTime: null
})
onMounted(async () => {
  const data = await WalletRecordApi.getUserCommissionBalance({ userId: route.params.id })
  formData.value = {
    totalCommission: data.totalCommission,
    availableBalance: data.availableBalance,
    frozenBalance: data.frozenBalance,
    withdrawnAmount: data.withdrawnAmount,
    lastSettlementTime: data.lastSettlementTime
  }
})
</script>
<style lang="scss" scoped>
.cell-item {
  display: inline;
}

.cell-item::after {
  content: ':';
}

:deep(.el-descriptions__label) {
  vertical-align: top;
}
</style>
