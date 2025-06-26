<template>
  <Dialog title="设置虚拟合同数量" v-model="dialogVisible" width="620px">

    <el-form ref="formRef" :model="formData" label-width="120px">
      <el-form-item label="当前虚拟合同数" prop="currentVirtualContractCnt">
        <el-input v-model="formData.currentVirtualContractCnt" disabled />
      </el-form-item>
      <el-form-item
        label="新虚拟合同数"
        prop="virtualContractCnt"
        :rules="[{ required: true, message: '请输入虚拟合同数量' }]"
      >
        <el-input-number
          v-model="formData.virtualContractCnt"
          :min="0"
          :max="9999"
          :precision="0"
          :step="1"
          class="!w-full"
        />
        <div>设计师主页中展示的已服务合同数量 = 虚拟合同数量 + 实际合同数量</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :loading="formLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { CertificationApi } from '@/api/member/certification'

defineOptions({ name: 'SetVirtualContractCnt' })

const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中

const formData = ref({
  id: 0,
  currentVirtualContractCnt: 0,
  virtualContractCnt: 0
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (row: any) => {
  dialogVisible.value = true
  formLoading.value = true
  try {
    formData.value = {
      id: row.id,
      currentVirtualContractCnt: row.virtualContractCnt || 0,
      virtualContractCnt: row.virtualContractCnt || 0
    }
  } finally {
    formLoading.value = false
  }
}

/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    await CertificationApi.setVirtualContractCnt({
      id: formData.value.id,
      virtualContractCnt: formData.value.virtualContractCnt
    })
    message.success('虚拟合同数量设置成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
