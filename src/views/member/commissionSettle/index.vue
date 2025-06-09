<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="结算状态" prop="settlementStatus">
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
      </el-form-item>
      <el-form-item label="申请时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="支付时间" prop="payTime">
        <el-date-picker
          v-model="queryParams.payTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 多选列 -->
      <el-table-column label="编号" align="center" prop="id" fixed width="70" />
      <el-table-column label="订单编号" align="center" prop="orderNo" width="180" />
      <el-table-column label="提现金额" align="center" prop="amount" width="120">
        <template #default="{ row }"> {{ row.amount }}元 </template>
      </el-table-column>
      <el-table-column label="收款账户名称" align="center" prop="bankName" />
      <el-table-column label="收款账号" align="center" prop="bankNumber" />
      <el-table-column label="审核状态" align="center" prop="checkStatus" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.checkStatus === 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="row.checkStatus === 1" type="success">审核通过</el-tag>
          <el-tag v-else-if="row.checkStatus === 2" type="danger">审核拒绝</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="支付状态" align="center" prop="paymentStatusDesc" width="100">
        <template #default="{ row }">
          {{ row.paymentStatusDesc }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="审核时间"
        align="center"
        prop="checkTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="审核人" align="center" prop="checker" />
      <!-- <el-table-column label="支付时间" align="center" prop="payTime" :formatter="dateFormatter" width="180px" /> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="openForm('detail', row)"> 详情 </el-button>
          <el-button
            link
            type="success"
            v-if="row.checkStatus === 0"
            @click="openForm('settlement', row)"
            v-hasPermi="['member:commission:checkWithdrawal']"
          >
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
  <!-- 表单弹窗：添加/修改 -->
  <SettlementForm ref="formRef" @success="getList" />
</template>

<script setup>
import { dateFormatter } from '@/utils/formatTime'
import { DICT_TYPE } from '@/utils/dict'
import { WalletRecordApi } from '@/api/member/wallet'
import SettlementForm from './SettlementForm.vue'

defineOptions({ name: 'CommissionSettle' })

const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  settlementStatus: undefined,
  createTime: [],
  payTime: []
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true

  try {
    const data = await WalletRecordApi.getWithdrawalRecordPage({
      ...queryParams
    })
    console.log(data)
    list.value = data?.list || []
    total.value = data?.total || 0
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

/** 添加/修改操作 */
const formRef = ref()

/** 打开表单 */
const openForm = (type, row) => {
  formRef.value.open(type, row)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
