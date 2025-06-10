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
      <el-form-item label="合同编号" prop="contractNo">
        <el-input
          v-model="queryParams.contractNo"
          placeholder="请输入合同编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="合同名称" prop="contractName">
        <el-input
          v-model="queryParams.contractName"
          placeholder="请输入合同名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="设计师姓名" prop="designerName">
        <el-input
          v-model="queryParams.designerName"
          placeholder="请输入设计师姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="设计师手机号" prop="designerName">
        <el-input
          v-model="queryParams.designerMobile"
          placeholder="请输入设计师手机号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="客户姓名" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="客户手机号" prop="customerMobile">
        <el-input
          v-model="queryParams.customerMobile"
          placeholder="请输入客户手机号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="结算状态" prop="settlementStatus">
        <el-select
          v-model="queryParams.settlementStatus"
          placeholder="请选择结算状态"
          clearable
          class="!w-240px"
        >
          <el-option label="待结算" :value="0" />
          <el-option label="已结算" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核时间" prop="checkTime">
        <el-date-picker
          v-model="queryParams.checkTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      ref="tableRef"
      :show-overflow-tooltip="true"
    >
      <el-table-column label="编号" align="center" prop="id" width="70" />
      <el-table-column label="合同编号" align="center" prop="contractNo" width="170" />
      <el-table-column label="合同名称" align="center" prop="contractName" width="170" />
      <!-- <el-table-column label="合同节点" align="center" prop="nodeName" /> -->
      <el-table-column label="客户" align="center" prop="customerName" />
      <el-table-column label="设计师" align="center" prop="designerName" />
      <el-table-column label="结算状态" align="center" prop="settlementStatus">
        <template #default="{ row }">
          <el-tag v-if="row.settlementStatus == 0" type="warning">待结算</el-tag>
          <el-tag v-else-if="row.settlementStatus == 1" type="success">已结算</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="合同总金额" align="center" prop="totalAmount" width="120">
        <template #default="{ row }"> {{ row.totalAmount }}元 </template>
      </el-table-column>
      <el-table-column label="结算金额" align="center" prop="amount">
        <template #default="{ row }"> {{ row.amount }}元 </template>
      </el-table-column>
      <el-table-column label="付款比例" align="center" prop="ratio">
        <template #default="{ row }"> {{ row.ratio }}% </template>
      </el-table-column>

      <el-table-column
        label="审核时间"
        align="center"
        prop="checkTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="审核人" align="center" prop="checker" />
      <el-table-column
        label="申请时间"
        align="center"
        prop="payTime"
        :formatter="dateFormatter"
        width="180px"
      />

      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            @click="openForm('detail', row)"
            v-hasPermi="['member:payment-record:fullSettlementList']"
          >
            详情
          </el-button>
          <el-button
            link
            type="success"
            v-if="row.settlementStatus == 0"
            @click="openForm('settlement', row)"
            v-hasPermi="['member:payment-record:checkFullSettlement']"
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
  <FullSettleForm ref="fullSettleFormRef" @success="getList" />
</template>

<script setup>
import { dateFormatter } from '@/utils/formatTime'
import { PaymentRecordApi } from '@/api/member/paymentrecord'
import FullSettleForm from './FullSettleForm.vue'

const tableRef = ref() // 表格的引用
/** 设计师发起支付记录 列表 */
defineOptions({ name: 'FullSettle' })

const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  offlineOrderId: undefined,
  pageNo: 1,
  pageSize: 10,
  designerName: undefined,
  designerMobile: undefined,
  customerName: undefined,
  contractNo: undefined,
  contractName: undefined,
  customerMobile: undefined,
  createTime: [],
  checkTime: [],
  settlementStatus: undefined,
  contractId: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true

  try {
    const data = await PaymentRecordApi.getFullSettlementListPage(queryParams)
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
const fullSettleFormRef = ref()
const openForm = (type, data) => {
  fullSettleFormRef.value.open(type, data)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped></style>
