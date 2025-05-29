<template>
  <ContentWrap>
    <el-tabs v-model="tabActive" @tab-change="getList">
      <el-tab-pane label="客户付款审核" name="2" />
      <el-tab-pane label="设计师合同结算" name="3" />
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
      <el-form-item label="设计师手机号" prop="designerName">
        <el-input
          v-model="queryParams.designerMobile"
          placeholder="请输入设计师手机号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="客户姓名" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="客户手机号" prop="customerMobile">
        <el-input
          v-model="queryParams.customerMobile"
          placeholder="请输入客户手机号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
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
      <el-form-item label="支付时间" prop="payTime">
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
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" fixed width="70" />
      <el-table-column label="合同编号" align="center" prop="contractNo" width="170" fixed />
      <el-table-column label="合同名称" align="center" prop="contractName" width="150" fixed />
      <el-table-column label="合同节点" align="center" prop="nodeName" fixed />
      <el-table-column label="客户" align="center" prop="customerName" width="80" fixed />
      <el-table-column label="设计师" align="center" prop="designerName" width="80" fixed />
      <el-table-column label="付款金额" align="center" prop="amount" fixed />
      <el-table-column label="合同总金额" align="center" prop="totalAmount" width="100" />
      <el-table-column label="付款比例" align="center" prop="ratio" width="100">
        <template #default="{ row }"> {{ row.ratio }}% </template>
      </el-table-column>
      <el-table-column label="线下订单号" align="center" prop="orderNo" width="120" />
      <el-table-column label="支付状态" align="center" prop="paymentStatus" width="100" fixed>
        <template #default="{ row }">
          <DictTag :type="DICT_TYPE.OFFLINE_ORDER_PAYMENT_STATUS" :value="row.paymentStatus" />
        </template>
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
        label="支付时间"
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
</template>

<script setup>
import { dateFormatter } from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { PaymentRecordApi } from '@/api/member/paymentrecord'
import PaymentForm from './PaymentForm.vue'

const tabActive = ref('2') //type: '2', //支付类型：2 客户付款 3 合同设计费结算， 4 设计师邀请佣金结算
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

/** 查询列表 */
const getList = async (val) => {
  loading.value = true

  try {
    const data = await PaymentRecordApi.getPaymentRecordPage({
      ...queryParams,
      type: val || tabActive.value
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
const openForm = (type, data) => {
  formRef.value.open(type, data)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
