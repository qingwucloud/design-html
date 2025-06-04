<template>
  <Dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="1000px"
    :top="formType === 'detail' ? undefined : '3vh'"
  >
    <!-- 设计师合同结算表单 -->
    <el-form ref="formRef" :model="formData" label-width="120px" v-loading="formLoading">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="合同编号">
            <el-input v-model="formData.contractNo" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同名称">
            <el-input v-model="formData.contractName" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="合同节点">
            <el-input v-model="formData.nodeName" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同总金额">
            <el-input v-model="formData.totalAmount" :disabled="true">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客户姓名">
            <el-input v-model="formData.customerName" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户电话">
            <el-input v-model="formData.customerMobile" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设计师姓名">
            <el-input v-model="formData.designerName" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设计师电话">
            <el-input v-model="formData.designerMobile" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="付款金额">
            <el-input v-model="formData.amount" :disabled="true">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款比例">
            <el-input v-model="formData.ratio" :disabled="true">
              <template #append>%</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="支付状态">
            <DictTag
              :type="DICT_TYPE.OFFLINE_ORDER_PAYMENT_STATUS"
              :value="formData.paymentStatus"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支付时间">
            <el-input v-model="formData.payTime" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="银行名称">
            <el-input v-model="formData.bankName" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行卡号">
            <el-input v-model="formData.bankNumber" :disabled="true">
              <template #append>
                <el-button @click="copyBankInfo" size="small">复制</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="银行预留手机号">
            <el-input v-model="formData.bankMobile" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 已有支付凭证 -->
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
                  height="80px"
                  width="80px"
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

/** 设计师合同结算表单 */
defineOptions({ name: 'DesignerSettlementForm' })

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
  ids: [] as number[], // 付款记录ID数组
  paymentVoucher: '', // 付款凭证
  type: 3 // 类型固定为3
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
    dialogTitle.value = '详情'
  } else if (type === 'settlement') {
    dialogTitle.value = '合同设计费结算'
    // 重置结算表单数据
    settlementFormData.value = {
      ids: [data.id], // 设置当前记录ID
      paymentVoucher: '',
      type: 3
    }
  }

  // 设置表单数据，格式化时间字段
  formData.value = {
    ...data,
    payTime: data.payTime ? formatDate(data.payTime, 'YYYY-MM-DD HH:mm:ss') : '',
    checkTime: data.checkTime ? formatDate(data.checkTime, 'YYYY-MM-DD HH:mm:ss') : ''
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
    await message.confirm('确定进行合同设计费结算吗？')
    formLoading.value = true

    // 准备提交参数
    const submitData = {
      ids: settlementFormData.value.ids,
      paymentVoucher: settlementFormData.value.paymentVoucher,
      type: settlementFormData.value.type
    }

    // 调用结算接口
    await PaymentRecordApi.settlementPayment(submitData)
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

/** 复制银行信息 */
const copyBankInfo = async () => {
  try {
    const bankInfo = [
      `银行名称：${formData.value.bankName || ''}`,
      `银行卡号：${formData.value.bankNumber || ''}`,
      `银行预留手机号：${formData.value.bankMobile || ''}`,
      `设计师姓名：${formData.value.designerName || ''}`
    ].join('\n')

    await navigator.clipboard.writeText(bankInfo)
    message.success('银行信息已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    message.error('复制失败，请手动复制')
  }
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
