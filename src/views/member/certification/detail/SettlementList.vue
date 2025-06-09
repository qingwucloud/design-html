<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <!-- <el-form-item label="结算状态" prop="settlementStatus">
        <el-select
          v-model="queryParams.settlementStatus"
          placeholder="请选择结算状态"
          clearable
          class="!w-240px"
        >
          <el-option label="待结算" :value="0" />
          <el-option label="已结算" :value="1" />
          <el-option label="已取消" :value="2" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="支付时间" prop="payTime">
        <el-date-picker
          v-model="queryParams.payTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item> -->
      <el-form-item label="结算时间" prop="settlementTime">
        <el-date-picker
          v-model="queryParams.settlementTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="结算批次号" align="center" prop="settlementBatchNo" width="180px" />
      <el-table-column label="金额" align="center" prop="commissionAmount">
        <template #default="scope">
          <span>{{ scope.row.commissionAmount }} 元</span>
        </template>
      </el-table-column>
      <el-table-column label="收入来源" align="center" prop="businessType" />
      <el-table-column label="类型" align="center" prop="commissionType">
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.COMMISSION_TYPE" :value="row.commissionType" />
        </template>
      </el-table-column>

      <!-- <el-table-column label="业务ID" align="center" prop="businessId" />
      <el-table-column label="关联邀请ID" align="center" prop="inviteId" /> -->
      <!-- <el-table-column label="结算状态" align="center" prop="settlementStatus">
        <template #default="{ row }">
          <el-tag v-if="row.settlementStatus === 0" type="warning" size="small">待结算</el-tag>
          <el-tag v-else-if="row.settlementStatus === 1" type="success" size="small">已结算</el-tag>
          <el-tag v-else type="danger" size="small">已取消</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="结算时间"
        align="center"
        prop="settlementTime"
        :formatter="dateFormatter"
        width="180px"
      />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { WalletRecordApi } from '@/api/member/wallet'
import { DICT_TYPE } from '@/utils/dict'

/** 用户结算记录列表 */
defineOptions({ name: 'SettlementList' })

const route = useRoute()
const loading = ref(true) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  payTime: undefined,
  settlementTime: undefined,
  settlementStatus: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WalletRecordApi.getIncomeRecordPage({
      ...queryParams,
      userId: Number(route.params.id)
    })
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
