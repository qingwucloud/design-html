<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" is-center>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="指定用户" prop="userId">
        <el-select v-model="formData.userId" filterable placeholder="请选择指派设计师">
          <el-option
            v-for="item in designerList"
            :key="item.userId"
            :label="item.name + '-' + item.mobile"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="附件" prop="memberContractConfirmStatus">
        <UploadFile
          v-model="formData.files"
          :file-type="['doc', 'xls', 'ppt', 'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif']"
          :limit="5"
          :file-size="20"
          class="min-w-80px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CertificationApi } from '@/api/member/certification'
import { ContractApi, ContractVO } from '@/api/member/contract'

/** 用户合同 表单 */
defineOptions({ name: 'ConstructionForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

//设计师列表
const designerList = ref<any[]>([]) // 设计师列表
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  userId: undefined,
  files: [],
  designerId: undefined,
  appointmentId: undefined
})
const formRules = reactive({
  userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  designerId: [{ required: true, message: '设计师ID不能为空', trigger: 'blur' }],

  memberContractConfirmStatus: [
    { required: true, message: '设计合同用户确认状态 见dict_type不能为空', trigger: 'blur' }
  ]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增建筑合同' : '合同详情'
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
  let data = await CertificationApi.getAllDesignerUserPage()
  designerList.value = data
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
