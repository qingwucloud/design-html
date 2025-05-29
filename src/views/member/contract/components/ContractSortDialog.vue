<template>
  <Dialog v-model="dialogVisible" title="合同精选排序" width="500px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-form-item label="排序值" prop="startSort">
        <el-input-number
          v-model="formData.startSort"
          :min="0"
          :precision="0"
          placeholder="请输入排序值"
          style="width: 100%"
        />
        <div class="form-tips">排序值最大的8个会显示在小程序首页</div>
      </el-form-item>

      <el-form-item label="封面图片" prop="coverUrl">
        <UploadImg
          v-model="formData.coverUrl"
          :limit="1"
          :file-size="10"
          :file-type="['png', 'jpg', 'jpeg', 'webp']"
          height="120px"
          width="200px"
        />
        <div class="form-tips"
          >建议上传 16:9 比例的图片，支持png、jpg、jpeg、webp格式，文件大小不超过5MB</div
        >
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
  coverUrl: ''
})

// 表单验证规则
const formRules = {
  startSort: [
    { required: true, message: '请输入排序值', trigger: 'blur' },
    { type: 'number', min: 0, message: '排序值不能小于0', trigger: 'blur' }
  ]
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
  formData.coverUrl = contractData.coverUrl || ''

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
      coverUrl: formData.coverUrl
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
