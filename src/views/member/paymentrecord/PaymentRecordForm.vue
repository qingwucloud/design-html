<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="formData.userId" placeholder="请输入用户ID" />
      </el-form-item>
      <el-form-item label="设计师ID" prop="designerId">
        <el-input v-model="formData.designerId" placeholder="请输入设计师ID" />
      </el-form-item>
      <el-form-item label="关联用户预约设计师ID" prop="appointmentId">
        <el-input v-model="formData.appointmentId" placeholder="请输入关联用户预约设计师ID" />
      </el-form-item>
      <el-form-item label="合同ID" prop="contractId">
        <el-input v-model="formData.contractId" placeholder="请输入合同ID" />
      </el-form-item>
      <el-form-item label="合同节点ID" prop="nodeId">
        <el-input v-model="formData.nodeId" placeholder="请输入合同节点ID" />
      </el-form-item>
      <el-form-item label="类型：1 量房定金申请， 2 合同付款申请 3 设计费结算申请" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="定金金额(元)" prop="amount">
        <el-input v-model="formData.amount" placeholder="请输入定金金额(元)" />
      </el-form-item>
      <el-form-item label="支付订单id" prop="orderId">
        <el-input v-model="formData.orderId" placeholder="请输入支付订单id" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PaymentRecordApi, PaymentRecordVO } from '@/api/member/paymentrecord'

/** 设计师发起支付记录 表单 */
defineOptions({ name: 'PaymentRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  userId: undefined,
  designerId: undefined,
  appointmentId: undefined,
  contractId: undefined,
  nodeId: undefined,
  type: undefined,
  amount: undefined,
  orderId: undefined
})
const formRules = reactive({
  userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  designerId: [{ required: true, message: '设计师ID不能为空', trigger: 'blur' }],
  appointmentId: [{ required: true, message: '关联用户预约设计师ID不能为空', trigger: 'blur' }],
  amount: [{ required: true, message: '定金金额(元)不能为空', trigger: 'blur' }],
  orderId: [{ required: true, message: '支付订单id不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PaymentRecordApi.getPaymentRecord(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PaymentRecordVO
    if (formType.value === 'create') {
      await PaymentRecordApi.createPaymentRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await PaymentRecordApi.updatePaymentRecord(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    userId: undefined,
    designerId: undefined,
    appointmentId: undefined,
    contractId: undefined,
    nodeId: undefined,
    type: undefined,
    amount: undefined,
    orderId: undefined
  }
  formRef.value?.resetFields()
}
</script>