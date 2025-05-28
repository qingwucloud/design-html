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
      <el-form-item label="关联预约记录ID" prop="appointmentId">
        <el-input v-model="formData.appointmentId" placeholder="请输入关联预约记录ID" />
      </el-form-item>
      <el-form-item label="合同编号" prop="contractNo">
        <el-input v-model="formData.contractNo" placeholder="请输入合同编号" />
      </el-form-item>
      <el-form-item label="合同名称" prop="contractName">
        <el-input v-model="formData.contractName" placeholder="请输入合同名称" />
      </el-form-item>
      <el-form-item label="设计合同审核状态 见dict_type" prop="memberContractStatus">
        <el-radio-group v-model="formData.memberContractStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="工程地址" prop="projectAddress">
        <el-input v-model="formData.projectAddress" placeholder="请输入工程地址" />
      </el-form-item>
      <el-form-item label="建筑面积(㎡)" prop="builtArea">
        <el-input v-model="formData.builtArea" placeholder="请输入建筑面积(㎡)" />
      </el-form-item>
      <el-form-item label="实测外框面积(㎡)" prop="measuredArea">
        <el-input v-model="formData.measuredArea" placeholder="请输入实测外框面积(㎡)" />
      </el-form-item>
      <el-form-item label="合同总金额(元)" prop="totalAmount">
        <el-input v-model="formData.totalAmount" placeholder="请输入合同总金额(元)" />
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model="formData.price" placeholder="请输入单价" />
      </el-form-item>
      <el-form-item label="已支付金额(元)" prop="paidAmount">
        <el-input v-model="formData.paidAmount" placeholder="请输入已支付金额(元)" />
      </el-form-item>
      <el-form-item label="补充说明" prop="footnote">
        <el-input v-model="formData.footnote" placeholder="请输入补充说明" />
      </el-form-item>
      <el-form-item label="设计周期(天数)" prop="designPeriod">
        <el-input v-model="formData.designPeriod" placeholder="请输入设计周期(天数)" />
      </el-form-item>
      <el-form-item label="确认时间" prop="confirmTime">
        <el-date-picker
          v-model="formData.confirmTime"
          type="date"
          value-format="x"
          placeholder="选择确认时间"
        />
      </el-form-item>
      <el-form-item label="合同附件URL" prop="attachmentUrl">
        <el-input v-model="formData.attachmentUrl" placeholder="请输入合同附件URL" />
      </el-form-item>
      <el-form-item label="审核人" prop="checker">
        <el-input v-model="formData.checker" placeholder="请输入审核人" />
      </el-form-item>
      <el-form-item label="合同开始时间" prop="startTime">
        <el-date-picker
          v-model="formData.startTime"
          type="date"
          value-format="x"
          placeholder="选择合同开始时间"
        />
      </el-form-item>
      <el-form-item label="合同结束时间" prop="endTime">
        <el-date-picker
          v-model="formData.endTime"
          type="date"
          value-format="x"
          placeholder="选择合同结束时间"
        />
      </el-form-item>
      <el-form-item label="设计合同用户确认状态 见dict_type" prop="memberContractConfirmStatus">
        <el-radio-group v-model="formData.memberContractConfirmStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ContractApi, ContractVO } from '@/api/member/contract'

/** 用户合同 表单 */
defineOptions({ name: 'ContractForm' })

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
  contractNo: undefined,
  contractName: undefined,
  memberContractStatus: undefined,
  projectAddress: undefined,
  builtArea: undefined,
  measuredArea: undefined,
  totalAmount: undefined,
  price: undefined,
  paidAmount: undefined,
  footnote: undefined,
  designPeriod: undefined,
  confirmTime: undefined,
  attachmentUrl: undefined,
  checker: undefined,
  startTime: undefined,
  endTime: undefined,
  memberContractConfirmStatus: undefined
})
const formRules = reactive({
  userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  designerId: [{ required: true, message: '设计师ID不能为空', trigger: 'blur' }],
  appointmentId: [{ required: true, message: '关联预约记录ID不能为空', trigger: 'blur' }],
  contractNo: [{ required: true, message: '合同编号不能为空', trigger: 'blur' }],
  contractName: [{ required: true, message: '合同名称不能为空', trigger: 'blur' }],
  memberContractStatus: [{ required: true, message: '设计合同审核状态 见dict_type不能为空', trigger: 'blur' }],
  projectAddress: [{ required: true, message: '工程地址不能为空', trigger: 'blur' }],
  builtArea: [{ required: true, message: '建筑面积(㎡)不能为空', trigger: 'blur' }],
  measuredArea: [{ required: true, message: '实测外框面积(㎡)不能为空', trigger: 'blur' }],
  totalAmount: [{ required: true, message: '合同总金额(元)不能为空', trigger: 'blur' }],
  price: [{ required: true, message: '单价不能为空', trigger: 'blur' }],
  paidAmount: [{ required: true, message: '已支付金额(元)不能为空', trigger: 'blur' }],
  designPeriod: [{ required: true, message: '设计周期(天数)不能为空', trigger: 'blur' }],
  attachmentUrl: [{ required: true, message: '合同附件URL不能为空', trigger: 'blur' }],
  startTime: [{ required: true, message: '合同开始时间不能为空', trigger: 'blur' }],
  endTime: [{ required: true, message: '合同结束时间不能为空', trigger: 'blur' }],
  memberContractConfirmStatus: [{ required: true, message: '设计合同用户确认状态 见dict_type不能为空', trigger: 'blur' }]
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
      formData.value = await ContractApi.getContract(id)
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
    const data = formData.value as unknown as ContractVO
    if (formType.value === 'create') {
      await ContractApi.createContract(data)
      message.success(t('common.createSuccess'))
    } else {
      await ContractApi.updateContract(data)
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
    contractNo: undefined,
    contractName: undefined,
    memberContractStatus: undefined,
    projectAddress: undefined,
    builtArea: undefined,
    measuredArea: undefined,
    totalAmount: undefined,
    price: undefined,
    paidAmount: undefined,
    footnote: undefined,
    designPeriod: undefined,
    confirmTime: undefined,
    attachmentUrl: undefined,
    checker: undefined,
    startTime: undefined,
    endTime: undefined,
    memberContractConfirmStatus: undefined
  }
  formRef.value?.resetFields()
}
</script>