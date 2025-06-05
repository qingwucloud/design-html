<template>
  <ContentWrap>
    <el-tabs v-model="tabActive" @tab-change="changeTab">
      <el-tab-pane label="客户付款审核" name="2" />
      <el-tab-pane label="设计师合同结算" name="3" />
      <el-tab-pane label="全案申请结算" name="4" />
    </el-tabs>
  </ContentWrap>
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
      <el-form-item label="支付状态" prop="paymentStatus">
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
      </el-form-item>
      <!-- <el-form-item label="审核时间" prop="checkTime">
        <el-date-picker
          v-model="queryParams.checkTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item :label="tabActive == 2 ? '支付时间' : '创建时间'" prop="payTime">
        <el-date-picker
          v-model="queryParams.payTime"
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
          v-if="selectedRows.length > 0 && tabActive == 3"
          type="primary"
          @click="handleBatchSettlement"
          v-hasPermi="['member:payment-record:settlement']"
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
      ref="tableRef"
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
      @row-click="handleRowChick"
      @select-all="handleSelectAll"
    >
      <!-- 多选列 -->
      <el-table-column
        type="selection"
        width="55"
        :selectable="rowSelectable"
        v-if="tabActive == 3"
      />
      <el-table-column label="编号" align="center" prop="id" width="70" />
      <el-table-column label="订单号" align="center" prop="orderNo" width="170" />
      <el-table-column label="合同编号" align="center" prop="contractNo" width="170" />
      <el-table-column label="合同名称" align="center" prop="contractName" />
      <el-table-column label="合同节点" align="center" prop="nodeName" />
      <el-table-column label="客户" align="center" prop="customerName" />
      <el-table-column label="设计师" align="center" prop="designerName" />
      <el-table-column label="支付状态" align="center" prop="paymentStatus">
        <template #default="{ row }">
          <DictTag :type="DICT_TYPE.OFFLINE_ORDER_PAYMENT_STATUS" :value="row.paymentStatus" />
        </template>
      </el-table-column>
      <el-table-column label="合同总金额" align="center" prop="totalAmount">
        <template #default="{ row }"> {{ row.totalAmount }}元 </template>
      </el-table-column>
      <el-table-column
        :label="tabActive == 2 ? '付款比例' : '结算比例'"
        v-if="tabActive != 4"
        align="center"
        prop="ratio"
      >
        <template #default="{ row }"> {{ row.ratio }}% </template>
      </el-table-column>
      <el-table-column
        :label="tabActive == 2 ? '付款金额' : '结算金额'"
        align="center"
        prop="amount"
      >
        <template #default="{ row }"> {{ row.amount }}元 </template>
      </el-table-column>

      <!-- <el-table-column
        label="审核时间"
        align="center"
        prop="checkTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <!-- <el-table-column label="审核人" align="center" prop="checker" /> -->
      <el-table-column
        :label="tabActive == 2 ? '支付时间' : '创建时间'"
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
            v-hasPermi="['member:payment-record:query']"
          >
            详情
          </el-button>
          <el-button
            link
            type="success"
            v-if="row.paymentStatus == 1 && tabActive == 2"
            @click="openForm('audit', row)"
            v-hasPermi="['member:payment-record:checkUserOrder']"
          >
            审核
          </el-button>
          <el-button
            link
            type="success"
            v-if="row.paymentStatus == 0 && tabActive == 3"
            @click="openForm('settlement', row)"
            v-hasPermi="['member:payment-record:settlement']"
          >
            结算
          </el-button>
          <el-button
            link
            type="success"
            v-if="row.paymentStatus == 0 && tabActive == 4"
            @click="openForm('settlement', row)"
            v-hasPermi="['member:payment-record:settlement']"
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
  <CustomerPaymentForm ref="customerFormRef" @success="getList" />
  <DesignerSettlementForm ref="designerFormRef" @success="getList" />
  <WholeProjectSettlementForm ref="wholeProjectFormRef" @success="getList" />

  <!-- 批量结算弹窗 -->
  <BatchSettlementForm ref="batchSettlementRef" @success="handleBatchSettlementSuccess" />
</template>

<script setup>
import { dateFormatter } from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { PaymentRecordApi } from '@/api/member/paymentrecord'
import CustomerPaymentForm from './CustomerPaymentForm.vue'
import DesignerSettlementForm from './DesignerSettlementForm.vue'
import WholeProjectSettlementForm from './WholeProjectSettlementForm.vue'
import BatchSettlementForm from './BatchSettlementForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableRef = ref() // 表格的引用
const tabActive = ref('2') //type: '2', //支付类型：2 客户付款 3 合同设计费结算， 4 全案申请结算
/** 设计师发起支付记录 列表 */
defineOptions({ name: 'PaymentRecord' })

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
  paymentStatus: undefined,
  contractId: undefined,
  orderId: undefined,
  payTime: []
})
const queryFormRef = ref() // 搜索的表单
// 多选相关
const selectedRows = ref([]) // 选中的行数据

/** 查询列表 */
const getList = async () => {
  loading.value = true

  try {
    const data = await PaymentRecordApi.getPaymentRecordPage({
      ...queryParams,
      type: tabActive.value
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
const customerFormRef = ref()
const designerFormRef = ref()
const wholeProjectFormRef = ref()
const batchSettlementRef = ref()
const openForm = (type, data) => {
  if (tabActive.value === '2') {
    // 客户付款审核
    customerFormRef.value.open(type, data)
  } else if (tabActive.value === '3') {
    // 设计师合同结算
    designerFormRef.value.open(type, data)
  } else if (tabActive.value === '4') {
    // 全案申请结算
    wholeProjectFormRef.value.open(type, data)
  }
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
  if (!tabActive.value == 3) return false
  // 设计师合同结算：只有支付状态为0（未结算）的记录可以选中
  if (row.paymentStatus !== 0) {
    return false
  }

  // 如果已经选中了行，判断新选中的行是否与已选中行的合同编号一致
  if (selectedRows.value.length > 0 && row.contractNo !== selectedRows.value[0].contractNo) {
    return false
  }

  return true
}

// 处理多选变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleRowChick = (row, e) => {
  if (!tabActive.value == 3) return false
  if (e.label === '操作') return

  // 首先检查该行是否可选中
  if (!rowSelectable(row)) {
    // 如果不可选中，显示提示信息
    ElMessage.warning('只能选择相同合同编号且未结算的记录')
    return
  }

  const selected = selectedRows.value.some((item) => item.id === row.id)
  if (!selected) {
    // 没有被选中
    selectedRows.value.push(row)
    tableRef.value.toggleRowSelection(row)
  } else {
    // 已勾选了,去除掉勾选
    const finArr = selectedRows.value.filter((item) => {
      return item.id !== row.id
    })
    selectedRows.value = finArr
    tableRef.value.toggleRowSelection(row, false)
  }
}

/** 处理全选事件 */
const handleSelectAll = (selection) => {
  // 如果没有选中任何记录，直接返回
  if (selection.length === 0) {
    selectedRows.value = []
    return
  }

  // 寻找第一个符合条件的记录（未结算的记录）
  const firstValidRow = list.value.find((row) => row.paymentStatus === 0)
  if (!firstValidRow) {
    // 如果没有符合条件的记录，清空选择
    selectedRows.value = []
    tableRef.value.clearSelection()
    ElMessage.warning('没有可以选择的记录')
    return
  }

  // 获取第一个符合条件的记录的合同编号
  const targetContractNo = firstValidRow.contractNo

  // 取消所有行的选择状态
  tableRef.value.clearSelection()

  // 选择所有符合条件的行（相同合同编号且未结算）
  const validRows = list.value.filter((row) => {
    return row.paymentStatus === 0 && row.contractNo === targetContractNo
  })

  // 将符合条件的行设置为选中状态
  validRows.forEach((row) => {
    tableRef.value.toggleRowSelection(row, true)
  })

  // 更新选中的行数据
  selectedRows.value = validRows

  // 如果没有符合条件的记录，显示提示信息
  if (validRows.length === 0) {
    ElMessage.warning('没有符合条件的记录可以选择')
  } else {
    ElMessage.success(`已选择合同编号为 ${targetContractNo} 的 ${validRows.length} 条记录`)
  }
}

const changeTab = (val) => {
  tabActive.value = val
  // 切换tab时清空选中的行
  selectedRows.value = []
  getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped></style>
