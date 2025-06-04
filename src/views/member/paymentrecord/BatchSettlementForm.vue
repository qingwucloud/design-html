<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="结算说明">
            <el-text type="info">
              正在为以下 {{ batchData.length }} 条付款记录进行合同设计费结算，请上传相关的付款凭证。
            </el-text>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 批量记录列表 -->
      <div class="batch-records">
        <el-table :data="batchData" border size="small" max-height="300px">
          <el-table-column label="合同编号" prop="contractNo" width="150" />
          <el-table-column label="合同名称" prop="contractName" />
          <el-table-column label="节点名称" prop="nodeName" />
          <el-table-column label="付款金额" prop="amount" width="100">
            <template #default="{ row }"> ¥{{ Number(row.amount || 0).toFixed(2) }} </template>
          </el-table-column>
          <el-table-column label="客户" prop="customerName" width="100" />
          <el-table-column label="设计师" prop="designerName" width="100" />
        </el-table>
        <div class="batch-summary">
          <el-text type="primary" size="large"> 总计金额：¥{{ totalAmount.toFixed(2) }} </el-text>
        </div>
      </div>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="付款凭证" prop="paymentVoucher" required>
            <UploadImg
              v-model="formData.paymentVoucher"
              :fileSize="10"
              height="120px"
              width="120px"
            />
            <div class="upload-tip ml-10px">
              <el-text type="info" size="small">
                支持 PNG、JPG、JPEG 格式，单个文件不超过 10MB，最多上传 1 张图片
              </el-text>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="handleSubmit" type="primary" :loading="formLoading">
        确认批量结算
      </el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { PaymentRecordApi } from '@/api/member/paymentrecord'
import { UploadImg } from '@/components/UploadFile'

/** 批量结算表单 */
defineOptions({ name: 'BatchSettlementForm' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('批量合同设计费结算') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中
const batchData = ref<any[]>([]) // 批量结算的记录数据

const formData = ref({
  ids: [] as number[], // 付款记录ID数组
  paymentVoucher: '', // 付款凭证
  type: 3 // 类型固定为3
})

const formRules = reactive({
  paymentVoucher: [{ required: true, message: '请上传付款凭证', trigger: 'change' }]
})

const formRef = ref() // 表单 Ref

// 计算总金额
const totalAmount = computed(() => {
  return batchData.value.reduce((total: number, record: any) => {
    const amount = Number(record.amount || 0)
    // 使用乘法和除法来避免浮点数精度问题
    return Math.round(total * 100 + amount * 100) / 100
  }, 0)
})

/** 打开弹窗 */
const open = async (dataList: any[]) => {
  dialogVisible.value = true
  batchData.value = dataList
  dialogTitle.value = `批量合同设计费结算 (${dataList.length}条记录)`

  // 重置表单数据
  formData.value = {
    ids: dataList.map((item) => item.id), // 设置所有记录ID
    paymentVoucher: '',
    type: 3
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交批量结算 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const handleSubmit = async () => {
  try {
    // 表单验证
    await formRef.value?.validate()

    // 确认操作
    await message.confirm(`确定对这 ${batchData.value.length} 条记录进行批量结算吗？`)
    formLoading.value = true

    // 准备提交参数
    const submitData = {
      ids: formData.value.ids,
      paymentVoucher: formData.value.paymentVoucher,
      type: formData.value.type
    }

    // 调用结算接口
    await PaymentRecordApi.settlementPayment(submitData)
    message.success(`成功批量结算 ${batchData.value.length} 条记录`)

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch (error) {
    // 用户取消或者接口错误
    console.error('批量结算失败:', error)
  } finally {
    formLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.batch-records {
  margin: 16px 0;

  .batch-summary {
    padding: 12px;
    margin-top: 12px;
    text-align: right;
    background-color: #f5f7fa;
    border-radius: 4px;
  }
}

.upload-tip {
  margin-top: 8px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
