<template>
  <Dialog title="修改评分" v-model="dialogVisible" width="500px">
    <el-form ref="formRef" :model="formData" label-width="100px">
      <el-form-item label="当前评分" prop="currentScore">
        <el-input v-model="formData.currentScore" disabled />
      </el-form-item>
      <el-form-item
        label="新评分"
        prop="score"
        :rules="[{ required: true, message: '请输入评分' }]"
      >
        <el-rate
          v-model="formData.score"
          :max="5"
          :colors="['#ff9900', '#ff9900', '#ff9900']"
          :show-score="true"
          score-template="{value}分"
        />
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

defineOptions({ name: 'ScoreForm' })

const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中

const formData = ref({
  id: 0,
  currentScore: 0,
  score: 0,
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (row: any) => {
  dialogVisible.value = true
  formLoading.value = true
  try {
    formData.value = {
      id: row.id,
      currentScore: row.score,
      score: row.score,
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
    await CertificationApi.updateCertificationScore({
      id: formData.value.id,
      score: formData.value.score,
    })
    message.success('评分修改成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
