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
      <el-form-item label="合同名称" prop="contractName">
        <el-input
          v-model="queryParams.contractName"
          placeholder="请输入合同名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="邀请人姓名" prop="inviterName">
        <el-input
          v-model="queryParams.inviterName"
          placeholder="请输入邀请人姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="邀请人手机号" prop="inviterMobile">
        <el-input
          v-model="queryParams.inviterMobile"
          placeholder="请输入邀请人手机号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="被邀请人姓名" prop="inviteeName">
        <el-input
          v-model="queryParams.inviteeName"
          placeholder="请输入被邀请人姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="被邀请人手机号" prop="inviteeMobile">
        <el-input
          v-model="queryParams.inviteeMobile"
          placeholder="请输入被邀请人手机号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <!-- <el-form-item label="支付状态" prop="paymentStatus">
        <el-select
          v-model="queryParams.paymentStatus"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.OFFLINE_ORDER_PAYMENT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="结算批次号" prop="settlementBatchNo">
        <el-input
          v-model="queryParams.settlementBatchNo"
          placeholder="请输入结算批次号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="结算时间" prop="settlementTime">
        <el-date-picker
          v-model="queryParams.settlementTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <!-- 批量操作按钮 -->
        <el-button
          v-if="selectedRows.length > 0"
          type="primary"
          @click="handleBatchSettlement"
          v-hasPermi="['member:commission-record:payment']"
        >
          批量结算 ({{ selectedRows.length }})
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
    >
      <!-- 多选列 -->
      <el-table-column type="selection" width="55" :selectable="rowSelectable" />
      <el-table-column label="编号" align="center" prop="id" fixed width="70" />
      <el-table-column
        label="结算批次号"
        align="center"
        prop="settlementBatchNo"
        width="180"
        fixed
      />
      <el-table-column label="合同名称" align="center" prop="contractName" />
      <el-table-column label="邀请人" align="center" prop="inviterName" />
      <el-table-column label="被邀请人" align="center" prop="inviteeName" />
      <el-table-column label="佣金金额" align="center" prop="commissionAmount">
        <template #default="{ row }">
          {{row.commissionAmount }}元
        </template>
      </el-table-column>
      <el-table-column label="佣金比例" align="center" prop="commissionRate" width="100">
        <template #default="{ row }">
          {{ (Number(row.commissionRate || 0) * 100).toFixed(2) }}%
        </template>
      </el-table-column>
      <!-- <el-table-column label="合同金额" align="center" prop="sourceAmount" width="120">
        <template #default="{ row }"> ¥{{ Number(row.sourceAmount || 0).toFixed(2) }} </template>
      </el-table-column> -->
      <!-- <el-table-column label="佣金类型" align="center" prop="commissionType" width="100">
        <template #default="{ row }">
          <DictTag :type="DICT_TYPE.COMMISSION_TYPE" :value="row.commissionType" />
        </template>
      </el-table-column> -->
      <el-table-column label="支付状态" align="center" prop="paymentStatus">
        <template #default="{ row }">
          <DictTag :type="DICT_TYPE.OFFLINE_ORDER_PAYMENT_STATUS" :value="row.paymentStatus" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="结算状态" align="center" prop="settlementStatus" width="100" fixed>
        <template #default="{ row }">
          <el-tag v-if="row.settlementStatus === 0" type="warning">待结算</el-tag>
          <el-tag v-else-if="row.settlementStatus === 1" type="success">已结算</el-tag>
          <el-tag v-else-if="row.settlementStatus === 2" type="danger">已取消</el-tag>
        </template>
      </el-table-column> -->

      <el-table-column
        label="结算时间"
        align="center"
        prop="settlementTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="支付时间"
        align="center"
        prop="payTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template #default="{ row }">
          <el-button link type="primary" @click="openForm('detail', row)"> 详情 </el-button>
          <el-button
            link
            type="success"
            v-if="row.paymentStatus == 1"
            @click="openForm('settlement', row)"
            v-hasPermi="['member:commission-record:payment']"
          >
            结算
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
  <PaymentForm ref="formRef" @success="getList" />

  <!-- 批量结算弹窗 -->
  <BatchSettlementForm ref="batchSettlementRef" @success="handleBatchSettlementSuccess" />
</template>

<script setup>
import { dateFormatter } from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { PaymentRecordApi } from '@/api/member/paymentrecord'
import PaymentForm from './PaymentForm.vue'
import BatchSettlementForm from './BatchSettlementForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

/** 佣金记录 列表 */
defineOptions({ name: 'CommissionRecord' })

const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  contractName: undefined,
  inviterName: undefined,
  inviterMobile: undefined,
  inviteeName: undefined,
  inviteeMobile: undefined,
  settlementStatus: undefined,
  paymentStatus: undefined,
  settlementBatchNo: undefined,
  settlementTime: [],
  payTime: []
})
const queryFormRef = ref() // 搜索的表单
// 多选相关
const selectedRows = ref([]) // 选中的行数据

/** 查询列表 */
const getList = async () => {
  loading.value = true

  try {
    const data = await PaymentRecordApi.getCommissionRecordPage({
      ...queryParams
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

/** 添加/修改操作 */
const formRef = ref()
const batchSettlementRef = ref()
const openForm = (type, data) => {
  formRef.value.open(type, data)
}

/** 批量结算操作 */
const handleBatchSettlement = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要结算的记录')
    return
  }

  // 打开批量结算弹窗
  batchSettlementRef.value.open(selectedRows.value)
}

/** 批量结算成功回调 */
const handleBatchSettlementSuccess = () => {
  selectedRows.value = [] // 清空选中的行
  getList() // 刷新列表
}

/** 行可选中性处理 */
const rowSelectable = (row) => {
  // 只有待结算状态的记录可以选中
  return row.paymentStatus == 1
}

// 处理多选变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
