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
      <el-form-item label="工作经验(年)" prop="workExperience">
        <el-input v-model="formData.workExperience" placeholder="请输入工作经验(年)" />
      </el-form-item>
      <el-form-item label="设计师等级 见dict_type" prop="designerGradeType">
        <el-select v-model="formData.designerGradeType" placeholder="请选择设计师等级 见dict_type">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="评分" prop="score">
        <el-input v-model="formData.score" placeholder="请输入评分" />
      </el-form-item>
      <el-form-item label="擅长风格(多选逗号分隔)" prop="designerStyleType">
        <el-select v-model="formData.designerStyleType" placeholder="请选择擅长风格(多选逗号分隔)">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请认证时间" prop="applyTime">
        <el-date-picker
          v-model="formData.applyTime"
          type="date"
          value-format="x"
          placeholder="选择申请认证时间"
        />
      </el-form-item>
      <el-form-item label="认证状态(0待审核 1已通过 2已拒绝)" prop="certStatus">
        <el-radio-group v-model="formData.certStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="接单状态(0关闭 1开启 )" prop="orderStatus">
        <el-radio-group v-model="formData.orderStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="个人简介" prop="profile">
        <UploadFile v-model="formData.profile" />
      </el-form-item>
      <el-form-item label="证书url(多选逗号分隔)" prop="certificates">
        <el-input v-model="formData.certificates" placeholder="请输入证书url(多选逗号分隔)" />
      </el-form-item>
      <el-form-item label="审核人" prop="checker">
        <el-input v-model="formData.checker" placeholder="请输入审核人" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CertificationApi, CertificationVO } from '@/api/member/certification'

/** 设计师认证 表单 */
defineOptions({ name: 'CertificationForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  userId: undefined,
  workExperience: undefined,
  designerGradeType: undefined,
  score: undefined,
  designerStyleType: undefined,
  applyTime: undefined,
  certStatus: undefined,
  orderStatus: undefined,
  profile: undefined,
  certificates: undefined,
  checker: undefined
})
const formRules = reactive({
  userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  workExperience: [{ required: true, message: '工作经验(年)不能为空', trigger: 'blur' }],
  designerGradeType: [{ required: true, message: '设计师等级 见dict_type不能为空', trigger: 'change' }],
  designerStyleType: [{ required: true, message: '擅长风格(多选逗号分隔)不能为空', trigger: 'change' }],
  certStatus: [{ required: true, message: '认证状态(0待审核 1已通过 2已拒绝)不能为空', trigger: 'blur' }],
  orderStatus: [{ required: true, message: '接单状态(0关闭 1开启 )不能为空', trigger: 'blur' }],
  profile: [{ required: true, message: '个人简介不能为空', trigger: 'blur' }],
  certificates: [{ required: true, message: '证书url(多选逗号分隔)不能为空', trigger: 'blur' }]
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
      formData.value = await CertificationApi.getCertification(id)
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
    const data = formData.value as unknown as CertificationVO
    if (formType.value === 'create') {
      await CertificationApi.createCertification(data)
      message.success(t('common.createSuccess'))
    } else {
      await CertificationApi.updateCertification(data)
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
    workExperience: undefined,
    designerGradeType: undefined,
    score: undefined,
    designerStyleType: undefined,
    applyTime: undefined,
    certStatus: undefined,
    orderStatus: undefined,
    profile: undefined,
    certificates: undefined,
    checker: undefined
  }
  formRef.value?.resetFields()
}
</script>