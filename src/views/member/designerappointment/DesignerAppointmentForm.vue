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
      <el-form-item label="预约设计师ID" prop="designerId">
        <el-input v-model="formData.designerId" placeholder="请输入预约设计师ID" />
      </el-form-item>
      <el-form-item label="运营指派设计师ID" prop="assignedDesignerId">
        <el-input v-model="formData.assignedDesignerId" placeholder="请输入运营指派设计师ID" />
      </el-form-item>
      <el-form-item label="用户预约设计师状态(见dict_type)" prop="designerAppointmentStatus">
        <el-radio-group v-model="formData.designerAppointmentStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联作品集ID" prop="portfolioId">
        <el-input v-model="formData.portfolioId" placeholder="请输入关联作品集ID" />
      </el-form-item>
      <el-form-item label="用户备注" prop="memberRemark">
        <el-input v-model="formData.memberRemark" placeholder="请输入用户备注" />
      </el-form-item>
      <el-form-item label="运营指派者" prop="checker">
        <el-input v-model="formData.checker" placeholder="请输入运营指派者" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DesignerAppointmentApi, DesignerAppointmentVO } from '@/api/member/designerappointment'

/** 用户预约设计师 表单 */
defineOptions({ name: 'DesignerAppointmentForm' })

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
  assignedDesignerId: undefined,
  designerAppointmentStatus: undefined,
  portfolioId: undefined,
  memberRemark: undefined,
  checker: undefined
})
const formRules = reactive({
  userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  designerId: [{ required: true, message: '预约设计师ID不能为空', trigger: 'blur' }],
  assignedDesignerId: [{ required: true, message: '运营指派设计师ID不能为空', trigger: 'blur' }],
  designerAppointmentStatus: [{ required: true, message: '用户预约设计师状态(见dict_type)不能为空', trigger: 'blur' }],
  memberRemark: [{ required: true, message: '用户备注不能为空', trigger: 'blur' }]
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
      formData.value = await DesignerAppointmentApi.getDesignerAppointment(id)
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
    const data = formData.value as unknown as DesignerAppointmentVO
    if (formType.value === 'create') {
      await DesignerAppointmentApi.createDesignerAppointment(data)
      message.success(t('common.createSuccess'))
    } else {
      await DesignerAppointmentApi.updateDesignerAppointment(data)
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
    assignedDesignerId: undefined,
    designerAppointmentStatus: undefined,
    portfolioId: undefined,
    memberRemark: undefined,
    checker: undefined
  }
  formRef.value?.resetFields()
}
</script>