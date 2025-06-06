<template>


  <div class="flex flex-col">
    <el-row :gutter="16" class="summary">
      <el-col v-loading="loading" :sm="6" :xs="12">
        <SummaryCard
          :value="summary?.userCount || 0"
          icon="fa-solid:users"
          icon-bg-color="text-blue-500"
          icon-color="bg-blue-100"
          title="累计会员数"
        />
      </el-col>
      <el-col v-loading="loading" :sm="6" :xs="12">
        <SummaryCard
          :value="summary?.rechargeUserCount || 0"
          icon="fa-solid:user"
          icon-bg-color="text-purple-500"
          icon-color="bg-purple-100"
          title="累计充值人数"
        />
      </el-col>
      <el-col v-loading="loading" :sm="6" :xs="12">
        <SummaryCard
          :decimals="2"
          :value="fenToYuan(summary?.rechargePrice || 0)"
          icon="fa-solid:money-check-alt"
          icon-bg-color="text-yellow-500"
          icon-color="bg-yellow-100"
          prefix="￥"
          title="累计充值金额"
        />
      </el-col>
      <el-col v-loading="loading" :sm="6" :xs="12">
        <SummaryCard
          :decimals="2"
          :value="fenToYuan(summary?.expensePrice || 0)"
          icon="fa-solid:yen-sign"
          icon-bg-color="text-green-500"
          icon-color="bg-green-100"
          prefix="￥"
          title="累计消费金额"
        />
      </el-col>
    </el-row>
    <el-row :gutter="16" class="mb-4">
      <el-col :md="18" :sm="24">
        <!-- 会员概览 -->
        <MemberFunnelCard />
      </el-col>
      <el-col :md="6" :sm="24">
        <!-- 会员终端 -->
        <MemberTerminalCard />
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :md="18" :sm="24">
        <el-card shadow="never">
          <template #header>
            <CardTitle title="会员地域分布" />
          </template>
          <el-row v-loading="loading">
            <el-col :span="10">
              <Echart :height="300" :options="areaChartOptions" />
            </el-col>
            <el-col :span="14">
              <el-table :data="areaStatisticsList" :height="300">
                <el-table-column
                  :sort-method="(obj1, obj2) => obj1.areaName.localeCompare(obj2.areaName, 'zh-CN')"
                  align="center"
                  label="省份"
                  min-width="80"
                  prop="areaName"
                  show-overflow-tooltip
                  sortable
                />
                <el-table-column
                  align="center"
                  label="会员数量"
                  min-width="105"
                  prop="userCount"
                  sortable
                />
                <el-table-column
                  align="center"
                  label="订单创建数量"
                  min-width="135"
                  prop="orderCreateUserCount"
                  sortable
                />
                <el-table-column
                  align="center"
                  label="订单支付数量"
                  min-width="135"
                  prop="orderPayUserCount"
                  sortable
                />
                <el-table-column
                  :formatter="fenToYuanFormat"
                  align="center"
                  label="订单支付金额"
                  min-width="135"
                  prop="orderPayPrice"
                  sortable
                />
              </el-table>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :md="6" :sm="24">
        <el-card v-loading="loading" shadow="never">
          <template #header>
            <CardTitle title="会员性别比例" />
          </template>
          <Echart :height="300" :options="sexChartOptions" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import * as MemberStatisticsApi from '@/api/mall/statistics/member'
import {
  MemberAreaStatisticsRespVO,
  MemberSexStatisticsRespVO,
  MemberSummaryRespVO,
  MemberTerminalStatisticsRespVO
} from '@/api/mall/statistics/member'
import SummaryCard from '@/components/SummaryCard/index.vue'
import { EChartsOption } from 'echarts'
import china from '@/assets/map/json/china.json'
import { areaReplace, fenToYuan } from '@/utils'
import { DICT_TYPE, DictDataType, getIntDictOptions } from '@/utils/dict'
import echarts from '@/plugins/echarts'
import { fenToYuanFormat } from '@/utils/formatter'
import MemberFunnelCard from './components/MemberFunnelCard.vue'
import MemberTerminalCard from './components/MemberTerminalCard.vue'
import { CardTitle } from '@/components/Card'

/** 会员统计 */
defineOptions({ name: 'MemberStatistics' })

const loading = ref(true) // 加载中
const summary = ref<MemberSummaryRespVO>() // 会员统计数据
const areaStatisticsList = shallowRef<MemberAreaStatisticsRespVO[]>() // 省份会员统计

// 注册地图
echarts?.registerMap('china', china as any)

/** 会员终端统计图配置 */
const terminalChartOptions = reactive<EChartsOption>({
  tooltip: {
    trigger: 'item',
    confine: true,
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'right'
  },
  roseType: 'area',
  series: [
    {
      name: '会员终端',
      type: 'pie',
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
}) as EChartsOption

/** 会员性别统计图配置 */
const sexChartOptions = reactive<EChartsOption>({
  tooltip: {
    trigger: 'item',
    confine: true,
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'right'
  },
  roseType: 'area',
  series: [
    {
      name: '会员性别',
      type: 'pie',
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
}) as EChartsOption

const areaChartOptions = reactive<EChartsOption>({
  tooltip: {
    trigger: 'item',
    formatter: (params: any) => {
      return `${params?.data?.areaName || params?.name}<br/>
会员数量：${params?.data?.userCount || 0}<br/>
订单创建数量：${params?.data?.orderCreateUserCount || 0}<br/>
订单支付数量：${params?.data?.orderPayUserCount || 0}<br/>
订单支付金额：${fenToYuan(params?.data?.orderPayPrice || 0)}`
    }
  },
  visualMap: {
    text: ['高', '低'],
    realtime: false,
    calculable: true,
    top: 'middle',
    inRange: {
      color: ['#fff', '#3b82f6']
    }
  },
  series: [
    {
      name: '会员地域分布',
      type: 'map',
      map: 'china',
      roam: false,
      selectedMode: false,
      data: []
    }
  ]
}) as EChartsOption

/** 查询会员统计 */
const getMemberSummary = async () => {
  summary.value = await MemberStatisticsApi.getMemberSummary()
}

/** 按照省份，查询会员统计列表 */
const getMemberAreaStatisticsList = async () => {
  const list = await MemberStatisticsApi.getMemberAreaStatisticsList()
  areaStatisticsList.value = list.map((item: MemberAreaStatisticsRespVO) => {
    return {
      ...item,
      areaName: areaReplace(item.areaName)
    }
  })
  let min = 0
  let max = 0
  areaChartOptions.series![0].data = areaStatisticsList.value.map((item) => {
    min = Math.min(min, item.orderPayUserCount || 0)
    max = Math.max(max, item.orderPayUserCount || 0)
    return { ...item, name: item.areaName, value: item.orderPayUserCount || 0 }
  })
  areaChartOptions.visualMap!['min'] = min
  areaChartOptions.visualMap!['max'] = max
}

/** 按照性别，查询会员统计列表 */
const getMemberSexStatisticsList = async () => {
  const list = await MemberStatisticsApi.getMemberSexStatisticsList()
  const dictDataList = getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)
  dictDataList.push({ label: '未知', value: null } as any)
  sexChartOptions.series![0].data = dictDataList.map((dictData: DictDataType) => {
    const userCount = list.find(
      (item: MemberSexStatisticsRespVO) => item.sex === dictData.value
    )?.userCount
    return {
      name: dictData.label,
      value: userCount || 0
    }
  })
}

/** 按照终端，查询会员统计列表 */
const getMemberTerminalStatisticsList = async () => {
  const list = await MemberStatisticsApi.getMemberTerminalStatisticsList()
  const dictDataList = getIntDictOptions(DICT_TYPE.TERMINAL)
  dictDataList.push({ label: '未知', value: null } as any)
  terminalChartOptions.series![0].data = dictDataList.map((dictData: DictDataType) => {
    const userCount = list.find(
      (item: MemberTerminalStatisticsRespVO) => item.terminal === dictData.value
    )?.userCount
    return {
      name: dictData.label,
      value: userCount || 0
    }
  })
}

/** 初始化 **/
onMounted(async () => {
  loading.value = true
  await Promise.all([
    getMemberSummary(),
    getMemberTerminalStatisticsList(),
    getMemberAreaStatisticsList(),
    getMemberSexStatisticsList()
  ])
  loading.value = false
})
</script>
<style lang="scss" scoped>
.summary {
  .el-col {
    margin-bottom: 1rem;
  }
}
</style>
