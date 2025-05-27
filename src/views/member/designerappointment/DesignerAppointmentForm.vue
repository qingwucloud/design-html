<template>
  <Dialog title="指派" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="客户手机号" prop="userId">
        <el-input v-model="formData.userId" placeholder="" />
      </el-form-item>
      <el-form-item label="预约设计师姓名" prop="designerId">
        <el-input v-model="formData.designerId" placeholder="" />
      </el-form-item>
      <el-form-item label="客户备注" prop="memberRemark">
        <el-input v-model="formData.memberRemark" placeholder="请输入客户备注" />
      </el-form-item>
      <el-form-item label="指派设计师" prop="assignedDesignerId">
        <el-select
          v-model="formData.assignedDesignerId"
          filterable
          placeholder="请选择指派设计师"
        >
          <el-option
            v-for="item in designerList"
            :key="item.id"
            :label="item.cardName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DesignerAppointmentApi } from '@/api/member/designerappointment'
import { CertificationApi } from "@/api/member/certification";
import { cloneDeep } from "lodash-es";
defineOptions({ name: 'DesignerAppointmentForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref<any>({})
const formRules = reactive({})
const formRef = ref() // 表单 Ref
//设计师列表
const designerList = ref([]) // 设计师列表

const open = async (item:any) => {
  dialogVisible.value = true
  formLoading.value = true
  formData.value = cloneDeep(item)
  let {data}=await CertificationApi.getCertificationPage({
    pageNo: 1,
    pageSize: 999,
    certStatus: 1
  })
  designerList.value = data.list
  formLoading.value = false
}
defineExpose({ open })


const emit = defineEmits(['success'])
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    await DesignerAppointmentApi.assignedDesignerAppointment({
      id:formData.value.id,
      designerId: formData.value.assignedDesignerId,
    })
    message.success('指派成功')
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

</script>
