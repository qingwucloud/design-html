<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000px"   custom-class="pay-d">
    <!-- 统一的表单（详情和结算） -->
    <el-form ref="formRef" :model="formData" label-width="120px" v-loading="formLoading">
      <!-- 佣金记录详情 -->
      <el-divider content-position="left">佣金记录详情</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="合同名称">
            <el-input v-model="formData.contractName" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同金额">
            <el-input v-model="formData.sourceAmount" :disabled="true">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邀请人">
            <el-input v-model="formData.inviterName" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="被邀请人">
            <el-input v-model="formData.inviteeName" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="佣金金额">
            <el-input v-model="formData.commissionAmount" :disabled="true">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="佣金比例">
            <el-input
              :value="(Number(formData.commissionRate || 0) * 100).toFixed(2)"
              :disabled="true"
            >
              <template #append>%</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 银行信息 -->
      <el-divider content-position="left">银行信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="账户名称">
            <el-input v-model="formData.bankAccountName" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行名称">
            <el-input v-model="formData.bankName" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="银行卡号">
            <el-input v-model="formData.bankNumber" :disabled="true">
              <template #append>
                <el-button @click="copyBankInfo(formData)" size="small">复制</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行渠道">
            <el-input v-model="formData.bankChanel" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="银行预留手机">
            <el-input v-model="formData.bankMobile" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 结算信息 -->
      <el-divider content-position="left">结算信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="支付状态">
            <DictTag
              :type="DICT_TYPE.OFFLINE_ORDER_PAYMENT_STATUS"
              :value="formData.paymentStatus"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.settlementBatchNo">
          <el-form-item label="结算批次号">
            <el-input v-model="formData.settlementBatchNo" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="formData.settlementTime">
        <el-col :span="12">
          <el-form-item label="结算时间">
            <el-input v-model="formData.settlementTime" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付凭证" v-if="paymentVoucherList.length > 0">
            <div class="voucher-images">
              <el-image
                v-for="(url, index) in paymentVoucherList"
                :key="index"
                :src="url"
                :preview-src-list="paymentVoucherList"
                :initial-index="index"
                fit="cover"
                class="voucher-image"
                @click="previewImage(index)"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 结算操作 -->
      <template v-if="formType === 'settlement'">
        <el-divider content-position="left">结算操作</el-divider>

        <el-form
          ref="settlementFormRef"
          :model="settlementFormData"
          :rules="settlementFormRules"
          label-width="120px"
        >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="付款凭证" prop="paymentVoucher" required>
                <UploadImg
                  v-model="settlementFormData.paymentVoucher"
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
      </template>
    </el-form>

    <template #footer>
      <el-button
        v-if="formType === 'settlement'"
        @click="handleSettlement"
        type="primary"
        :loading="formLoading"
      >
        确认结算
      </el-button>
      <el-button @click="dialogVisible = false">
        {{ formType === 'detail' ? '关闭' : '取消' }}
      </el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PaymentRecordApi } from '@/api/member/paymentrecord'
import { DICT_TYPE } from '@/utils/dict'
import { createImageViewer } from '@/components/ImageViewer'
import { formatDate } from '@/utils/formatTime'
import { UploadImg } from '@/components/UploadFile'
import { copyBankInfo } from '@/utils/clipboard'
/** 佣金记录 表单 */
defineOptions({ name: 'CommissionRecordForm' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：detail - 详情；settlement - 结算
const formData = ref<any>({})
const formRef = ref() // 表单 Ref

// 结算表单相关
const settlementFormRef = ref() // 结算表单 Ref
const settlementFormData = ref({
  ids: [] as number[], // 佣金记录ID数组
  paymentVoucher: '', // 付款凭证
  amount: 0 // 结算金额
})

const settlementFormRules = reactive({
  paymentVoucher: [{ required: true, message: '请上传付款凭证', trigger: 'change' }]
})

// 支付凭证图片列表
const paymentVoucherList = computed(() => {
  if (!formData.value.paymentVoucher) {
    return []
  }
  // 支付凭证是多张图片拼接的字符串，使用逗号分隔
  return formData.value.paymentVoucher.split(',').filter((url) => url.trim())
})

/** 打开弹窗 */
const open = async (type: string, data: any) => {
  dialogVisible.value = true
  formType.value = type

  if (type === 'detail') {
    dialogTitle.value = '佣金记录详情'
  } else if (type === 'settlement') {
    dialogTitle.value = '佣金记录结算'
    // 重置结算表单数据
    settlementFormData.value = {
      ids: [data.id], // 设置当前记录ID
      paymentVoucher: '',
      amount: data.commissionAmount || 0
    }
  }

  console.log(data.payTime)

  // 设置表单数据，格式化时间字段
  formData.value = {
    ...data,
    settlementTime: data.settlementTime
      ? formatDate(data.settlementTime, 'YYYY-MM-DD HH:mm:ss')
      : ''
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 结算操作 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const handleSettlement = async () => {
  try {
    // 表单验证
    await settlementFormRef.value?.validate()

    // 确认操作
    await message.confirm('确定进行佣金记录结算吗？')
    formLoading.value = true

    // 调用结算接口
    await PaymentRecordApi.commissionRecordPayment(settlementFormData.value)
    message.success('结算成功')

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch (error) {
    // 用户取消或者接口错误
    console.error('结算失败:', error)
  } finally {
    formLoading.value = false
  }
}

/** 预览图片 */
const previewImage = (index: number) => {
  createImageViewer({
    urlList: paymentVoucherList.value,
    initialIndex: index
  })
}
</script>

<style lang="scss" scoped>
.voucher-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .voucher-image {
    width: 100px;
    height: 100px;
    cursor: pointer;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.no-voucher {
  display: flex;
  height: 100px;
  background-color: var(--el-fill-color-lighter);
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  align-items: center;
  justify-content: center;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-divider__text) {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.upload-tip {
  margin-top: 8px;
}
</style>

<style>
.pay-d{
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  max-width: calc(100% - 30px);
  max-height: calc(100% - 30px);
  margin: 0 !important;
  transform: translate(-50%, -50%);
  flex-direction: column;

  .el-dialog__body {
    overflow: auto;
  }
}

</style>
