<template>
  <div class="flex flex-col" v-if="checkPermi(['home:statistics:query'])">
    <!-- 数据对照 -->
    <el-row :gutter="16" class="row">
      <el-col :md="6" :sm="12" :xs="24" :loading="loading">
        <ComparisonCard
          tag="今日"
          title="新增会员"
          :value="userComparison?.value?.registerUserCount || 0"
          :reference="userComparison?.reference?.registerUserCount || 0"
        />
      </el-col>
      <el-col :md="6" :sm="12" :xs="24" :loading="loading">
        <ComparisonCard
          tag="今日"
          title="用户访问量"
          :value="userComparison?.value?.visitUserCount || 0"
          :reference="userComparison?.reference?.visitUserCount || 0"
        />
      </el-col>
      <el-col :md="6" :sm="12" :xs="24" :loading="loading">
        <ComparisonCard
          tag="今日"
          title="预约量"
          :value="userComparison?.value?.registerUserCount || 0"
          :reference="userComparison?.reference?.registerUserCount || 0"
        />
      </el-col>
      <el-col :md="6" :sm="12" :xs="24" :loading="loading">
        <ComparisonCard
          tag="今日"
          title="新增用户"
          :value="orderComparison?.value?.orderPayCount || 0"
          :reference="orderComparison?.reference?.orderPayCount || 0"
        />
      </el-col>
    </el-row>
    <el-row :gutter="16" class="row">
      <el-col :md="12">
        <!-- 快捷入口 -->
        <ShortcutCard />
      </el-col>
      <el-col :md="12">
        <!-- 运营数据 -->
        <OperationDataCard />
      </el-col>
    </el-row>
    <!-- <el-row :gutter="16" class="mb-4"> -->
    <!-- <el-col :md="18" :sm="24"> -->
    <!-- 会员概览 -->
    <!-- <MemberFunnelCard /> -->
    <!-- </el-col> -->
    <!-- <el-col :md="6" :sm="24"> -->
    <!-- 会员终端 -->
    <!-- <MemberTerminalCard /> -->
    <!-- </el-col> -->
    <!-- </el-row> -->
    <!-- 交易量趋势 -->
    <TradeTrendCard class="mb-4" />
    <!-- 会员统计 -->
    <MemberStatisticsCard />
  </div>
  <div class="page" v-else>
    <div class="inner">
      <div class="inner-padding">
        <img
          class="bg"
          src="https://80du-design.oss-cn-shenzhen.aliyuncs.com/static/admin-home-bg.png"
          alt=""
        />
        <div class="sub">
          <h1 class=""
            >{{ greeting }},&nbsp;<span>{{ userName }}</span></h1
          >
          <p class="">拥有一个好心情来面对工作 ~</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as TradeStatisticsApi from '@/api/mall/statistics/trade'
import * as MemberStatisticsApi from '@/api/mall/statistics/member'
import { DataComparisonRespVO } from '@/api/mall/statistics/common'
import { TradeOrderSummaryRespVO } from '@/api/mall/statistics/trade'
import { MemberCountRespVO } from '@/api/mall/statistics/member'
import ComparisonCard from './components/ComparisonCard.vue'
import MemberStatisticsCard from './components/MemberStatisticsCard.vue'
import OperationDataCard from './components/OperationDataCard.vue'
import ShortcutCard from './components/ShortcutCard.vue'
import TradeTrendCard from './components/TradeTrendCard.vue'
import { useUserStore } from '@/store/modules/user'
import { checkPermi } from '@/utils/permission'
// import MemberTerminalCard from '@/views/mall/statistics/member/components/MemberTerminalCard.vue'
// import MemberFunnelCard from '@/views/mall/statistics/member/components/MemberFunnelCard.vue'

/** 商城首页 */
defineOptions({ name: 'MallHome' })

const userStore = useUserStore()

const hours = ref(new Date().getHours())
const greeting = computed(() => (hours.value < 12 ? '上午好' : '下午好'))
const userName = computed(() => userStore.user?.nickname)

const loading = ref(true) // 加载中
const orderComparison = ref<DataComparisonRespVO<TradeOrderSummaryRespVO>>() // 交易对照数据
const userComparison = ref<DataComparisonRespVO<MemberCountRespVO>>() // 会员对照数据

/** 查询交易对照卡片数据 */
const getOrderComparison = async () => {
  orderComparison.value = await TradeStatisticsApi.getOrderComparison()
}

/** 查询会员会员数量对照卡片数据 */
const getUserCountComparison = async () => {
  userComparison.value = await MemberStatisticsApi.getUserCountComparison()
}

/** 初始化 **/
onMounted(async () => {
  if (checkPermi(['home:statistics:query'])) {
    loading.value = true
    await Promise.all([getOrderComparison(), getUserCountComparison()])
    loading.value = false
  }
})
</script>
<style lang="scss" scoped>
.row {
  .el-col {
    margin-bottom: 1rem;
  }
}

.page {
  height: calc(100vh - 160px);

  .inner {
    height: 100%;
    background-color: #fff;
    border-radius: 8px;

    .inner-padding {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
      align-items: center;
    }

    .sub {
      padding-left: 64px;
      margin-top: -10%;

      h1 {
        font-size: 32px;
        font-weight: 700;
        color: #000;
      }

      p {
        font-size: 24px;
        font-weight: 400;
        color: #000;
      }
    }
  }

  .logo {
    position: absolute;
    top: 48px;
    left: 48px;
    width: 110px;
    height: 45px;
  }

  .bg {
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 100%;
    height: auto;
  }
}
</style>
