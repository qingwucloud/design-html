<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex flex-row items-center justify-between">
        <CardTitle title="业务数据" />
        <div class="flex flex-row items-center gap-2">
          <el-radio-group v-model="timeRangeType" @change="handleTimeRangeTypeChange" size="small">
            <el-radio-button v-for="(item, index) in timeRange" :key="index" :value="item.value">
              {{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </template>
    <div class="flex flex-row flex-wrap items-center gap-8 py-4">
      <div
        v-for="item in menuList"
        :key="item.name"
        @click="handleMenuClick(item.routerName)"
        class="h-20 w-22% flex flex-col cursor-pointer items-center justify-center gap-2"
      >
        <div class="text-4xl" >{{item.value}}</div>
        <span class="text-center">{{ item.name }}(元)</span>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
/** 快捷入口卡片 */
import { CardTitle } from '@/components/Card'
import { getBusinessCount } from '@/api/mall/statistics/trade'
const router = useRouter() // 路由
defineOptions({ name: 'BusinessCard' })
const timeRangeType = ref('week') // 日期快捷选择按钮, 默认30天
const timeRange = [
  {
    name: '周',
    value: 'week'
  },
  {
    name: '月',
    value: 'month'
  },
  {
    name: '年',
    value: 'year'
  }
]
const loading = ref(true) // 加载中
/** 菜单列表 */
const menuList = reactive([
  { name: '签约合同金额', value: 0, routerName: 'ContractList' },
  { name: '客户合同付款金额', value: 0, routerName: 'ContractList' },
  { name: '量房定金付款金额', value: 0, routerName: 'TradeOrder' },
  { name: '用户提现金额', value: 0, routerName: 'CommissionSettle' }
])

onMounted(() => {
  handleTimeRangeTypeChange()
})
/**
 * 跳转到菜单对应页面
 *
 * @param routerName 路由页面组件的名称
 */
const handleMenuClick = (routerName: string) => {
  router.push({ name: routerName })
}
const handleTimeRangeTypeChange = async () => {
  loading.value = true
  const type = timeRangeType.value
  let data: any = await getBusinessCount(type)
  menuList[0].value = data.contractTotalMoney
  menuList[1].value = data.contractPaidMoney
  menuList[2].value = data.appointmentPaidMoney
  menuList[3].value = data.withdrawalMoney
  loading.value = false
}
</script>
