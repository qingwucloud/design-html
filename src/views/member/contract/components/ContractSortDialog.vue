<template>
  <Dialog v-model="dialogVisible" title="合同精选排序" width="680px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
      <el-form-item label="排序值" prop="startSort">
        <el-input-number
          v-model="formData.startSort"
          :min="0"
          :precision="0"
          placeholder="请输入排序值"
        />
        <div class="form-tips ml-10px">排序值最大的8个会显示在小程序首页，数字越大排的越靠前</div>
      </el-form-item>

      <el-form-item label="合同展示金额" prop="caseShowAmount">
        <el-input-number
          v-model="formData.caseShowAmount"
          :min="0"
          :precision="1"
          placeholder="请输入合同展示金额"
        >
          <template #append>元</template>
        </el-input-number>
      </el-form-item>

      <el-form-item label="封面图片" prop="covers">
        <UploadImg
          v-model="formData.covers"
          :limit="1"
          :file-size="10"
          height="120px"
          width="200px"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ContractApi } from '@/api/member/contract'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'ContractSortDialog' })

// 弹窗状态
const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref()

// 表单数据
const formData = reactive({
  id: 0,
  startSort: 0,
  covers: '',
  caseShowAmount: 0
})

// 表单验证规则
const formRules = {
  startSort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
  caseShowAmount: [{ required: true, message: '请输入合同展示金额', trigger: 'blur' }],
  covers: [{ required: true, message: '请上传封面图片', trigger: 'change' }]
}

// 发射事件
const emit = defineEmits<{
  success: []
}>()

// 打开弹窗
const open = (contractData: any) => {
  dialogVisible.value = true
  formData.id = contractData.id
  formData.startSort = contractData.startSort || 0
  formData.covers = contractData.covers || ''
  formData.caseShowAmount = contractData.caseShowAmount || 0

  // 重置表单验证状态
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    await ContractApi.recommendContract({
      id: formData.id,
      startSort: formData.startSort,
      covers: formData.covers,
      caseShowAmount: formData.caseShowAmount
    })

    ElMessage.success('设置排序成功')
    dialogVisible.value = false
    emit('success')
  } catch (error) {
    console.error('设置排序失败:', error)
  } finally {
    loading.value = false
  }
}

// 暴露方法
defineExpose({
  open
})
</script>

<style scoped>
.form-tips {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.4;
  color: #909399;
}
</style>
