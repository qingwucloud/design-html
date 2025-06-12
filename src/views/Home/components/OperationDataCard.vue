<template>
  <el-card shadow="never">
    <template #header>
      <CardTitle title="运营数据" />
    </template>
    <div class="flex flex-row flex-wrap items-center gap-8 p-4">
      <div
        v-for="item in data"
        :key="item.name"
        class="h-20 w-20% flex flex-col cursor-pointer items-center justify-center gap-2"
        @click="handleClick(item.routerName)"
      >
        <CountTo
          :end-val="item.value"
          class="text-3xl"
        />
        <span class="text-center">{{ item.name }}</span>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { CardTitle } from '@/components/Card'
import { getOperationalCount } from "@/api/mall/statistics/trade";

/** 运营数据卡片 */
defineOptions({ name: 'OperationDataCard' })

const router = useRouter() // 路由

/** 数据 */
const data = reactive({
  designerCheckCount: { name: '设计师待审核', value: 0, routerName: 'MemberCertification' },
  portfolioCheckCount: { name: '作品集待审核', value: 0, routerName: 'MemberPortfolio' },
  appointmentCheckCount: { name: '预约待指派', value: 0, routerName: 'DesignerAppointment' },
  contractCheckCount: { name: '合同待审核', value: 0, routerName: 'ContractList' },
  customerPaidCheckCount: { name: '客户付款待审核', value: 9, routerName: 'CustomerPayment' },
  fullSettlementCheckCount: { name: '全案结算待审核', value: 4, routerName: 'FullSettle' },
  withdrawCheckCount: { name: '提现待审核', value: 0, routerName: 'CommissionSettle' },
  pickUpCount: { name: '待核销订单', value: 0, routerName: 'TradeOrder' },

  // orderWaitePickUp: { name: '所有会员', value: 0, routerName: 'TradeOrder' },
  // rechargePrice: {
  //   name: '待审核设计师',
  //   value: 0,
  //   routerName: 'PayWalletRecharge'
  // },
  // orderUndelivered: { name: '订单', value: 9, routerName: 'TradeOrder' },
  // orderAfterSaleApply: { name: '退款中订单', value: 4, routerName: 'TradeAfterSale' },
  // productAlertStock: { name: '库存预警', value: 0, routerName: 'ProductSpu' },
  // productForSale: { name: '上架商品', value: 0, routerName: 'ProductSpu' },
  // productInWarehouse: { name: '仓库商品', value: 0, routerName: 'ProductSpu' },
  // withdrawAuditing: { name: '待结算', value: 0, routerName: 'FullSettle' }
})

/** 查询订单数据 */
const getOrderData = async () => {
  const orderCount:any = await getOperationalCount()
  if (orderCount.designerCheckCount != null) {
    data.designerCheckCount.value = orderCount.designerCheckCount
  }
  if (orderCount.portfolioCheckCount != null) {
    data.portfolioCheckCount.value = orderCount.portfolioCheckCount
  }
  if (orderCount.appointmentCheckCount != null) {
    data.appointmentCheckCount.value = orderCount.appointmentCheckCount
  }
  if (orderCount.contractCheckCount != null) {
    data.contractCheckCount.value = orderCount.contractCheckCount
  }


  if (orderCount.customerPaidCheckCount != null) {
    data.customerPaidCheckCount.value = orderCount.customerPaidCheckCount
  }
  if (orderCount.fullSettlementCheckCount != null) {
    data.fullSettlementCheckCount.value = orderCount.fullSettlementCheckCount
  }
  if (orderCount.withdrawCheckCount != null) {
    data.withdrawCheckCount.value = orderCount.withdrawCheckCount
  }
  if (orderCount.pickUpCount != null) {
    data.pickUpCount.value = orderCount.pickUpCount
  }
}

/** 查询商品数据 */
const getProductData = async () => {
  // const productCount = await ProductSpuApi.getTabsCount()
  // data.productForSale.value = productCount['0']
  // data.productInWarehouse.value = productCount['1']
  // data.productAlertStock.value = productCount['3']
}

/** 查询钱包充值数据 */
// const getWalletRechargeData = async () => {
//   const paySummary = await PayStatisticsApi.getWalletRechargePrice()
//   data.rechargePrice.value = paySummary.rechargePrice
// }

/**
 * 跳转到对应页面
 *
 * @param routerName 路由页面组件的名称
 */
const handleClick = (routerName: string) => {
  router.push({ name: routerName })
}

/** 激活时 */
onActivated(() => {
  getOrderData()
  // getProductData()
  // getWalletRechargeData()
})

/** 初始化 **/
onMounted(() => {
  getOrderData()
  getProductData()
  // getWalletRechargeData()
})
</script>
