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
<!--        <el-button type="primary" plain @click="openBalanceDialog">-->
<!--          <Icon icon="ep:edit" class="mr-5px" /> 余额调整-->
<!--        </el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="100" />
      <el-table-column label="结算批次号" align="center" prop="settlementBatchNo" width="180px" />
      <el-table-column label="收入来源" align="center" prop="businessType" />
      <el-table-column label="金额" align="center" prop="commissionAmount">
        <template #default="scope">
          <span>{{ scope.row.commissionAmount }} 元</span>
        </template>
      </el-table-column>
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
<!--      <el-table-column-->
<!--        label="创建时间"-->
<!--        align="center"-->
<!--        prop="createTime"-->
<!--        :formatter="dateFormatter"-->
<!--        width="180px"-->
<!--      />-->
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

  <!-- 余额调整弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    title="余额调整"
    width="500px"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="调整金额" prop="amount">
        <el-input-number
          v-model="form.amount"
          :precision="0"
          :step="1"
          class="w-full!"
          placeholder="请输入调整金额（正数增加，负数减少）"
        />
      </el-form-item>
      <el-form-item label="调整原因" prop="reason">
        <el-input
          v-model="form.reason"
          type="textarea"
          :rows="3"
          placeholder="请输入调整原因"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { WalletRecordApi } from '@/api/member/wallet'
import { DICT_TYPE } from '@/utils/dict'
import { ElMessage } from 'element-plus'
import { useMitt } from '@/hooks/web/useMitt'
import { getDesignerIncomeList } from "@/api/member/view/designer";
import { getUserIncomeList } from "@/api/member/view/user";

// 获取事件总线
const { emitter } = useMitt()

/** 用户结算记录列表 */
defineOptions({ name: 'SettlementList' })

const emit = defineEmits(['update'])
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

// 余额调整相关数据
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()
const form = reactive({
  amount: undefined as number | undefined,
  reason: ''
})
const rules = {
  amount: [{ required: true, message: '请输入调整金额', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入调整原因', trigger: 'blur' }]
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getUserIncomeList({
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

/** 打开余额调整弹窗 */
const openBalanceDialog = () => {
  dialogVisible.value = true
  form.amount = undefined
  form.reason = ''
}

/** 提交表单 */
const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    submitLoading.value = true
    try {
      await WalletRecordApi.adjustBalance({
        userId: Number(route.params.id),
        amount: form.amount,
        reason: form.reason
      })

      ElMessage.success('余额调整成功')
      dialogVisible.value = false
      // 通知父级组件更新
      emit('update')
      // 触发事件通知UserWallet组件更新数据
      emitter.emit('updateAccountWallet')
      // 重新获取列表
      getList()
    } catch (error) {
      console.error('余额调整失败:', error)
      ElMessage.error('余额调整失败，请稍后重试')
    } finally {
      submitLoading.value = false
    }
  })
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
