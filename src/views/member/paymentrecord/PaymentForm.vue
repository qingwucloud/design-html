<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000px">
    <!-- 详情和审核表单 -->
    <el-form
      v-if="formType === 'detail' || formType === 'audit'"
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      disabled
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="合同编号">
            <el-input v-model="formData.contractNo" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同名称">
            <el-input v-model="formData.contractName" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="合同节点">
            <el-input v-model="formData.nodeName" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同总金额">
            <el-input v-model="formData.totalAmount" readonly>
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客户姓名">
            <el-input v-model="formData.customerName" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户电话">
            <el-input v-model="formData.customerMobile" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设计师姓名">
            <el-input v-model="formData.designerName" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设计师电话">
            <el-input v-model="formData.designerMobile" readonly />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="付款金额">
            <el-input v-model="formData.amount" readonly>
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款比例">
            <el-input v-model="formData.ratio" readonly>
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
            <el-input v-model="formData.payTime" readonly />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 支付凭证 -->
      <el-form-item label="支付凭证">
        <div v-if="paymentVoucherList.length > 0" class="voucher-images">
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
        <div v-else class="no-voucher">
          <el-text type="info">暂无支付凭证</el-text>
        </div>
      </el-form-item>

      <!-- 审核信息 -->
      <el-divider content-position="left" v-if="formData.paymentStatus == 2">审核信息</el-divider>
      <el-row :gutter="20" v-if="formData.paymentStatus == 2">
        <el-col :span="12">
          <el-form-item label="审核人">
            <el-input v-model="formData.checker" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核时间">
            <el-input v-model="formData.checkTime" readonly />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 结算表单 -->
    <el-form
      v-else-if="formType === 'settlement'"
      ref="settlementFormRef"
      :model="settlementFormData"
      :rules="settlementFormRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="结算说明">
            <el-text type="info">
              正在为以下付款记录进行合同设计费结算，请上传相关的付款凭证。
            </el-text>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="合同编号">
            <el-input v-model="formData.contractNo" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同名称">
            <el-input v-model="formData.contractName" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设计师姓名">
            <el-input v-model="formData.designerName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结算金额">
            <el-input v-model="formData.amount" disabled>
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

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

    <template #footer>
      <el-button
        v-if="formType === 'settlement'"
        @click="handleSettlement"
        type="primary"
        :loading="formLoading"
      >
        确认结算
      </el-button>
      <el-button
        v-else-if="formType === 'audit' && formData.paymentStatus === 1"
        @click="handleAudit"
        type="primary"
        :disabled="formLoading"
      >
        审核通过
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
/** 合同付款记录 表单 */
defineOptions({ name: 'PaymentRecordForm' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：detail - 详情；audit - 审核；settlement - 结算
const formData = ref<any>({})
const formRules = reactive({})
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
  } else if (type === 'audit') {
    dialogTitle.value = '审核付款记录'
  } else if (type === 'settlement') {
    dialogTitle.value = '合同设计费结算'
    // 重置结算表单数据
    settlementFormData.value = {
      ids: [data.id], // 设置当前记录ID
      paymentVoucher: '',
      type: 3,
    }
  }

  console.log(data.payTime)

  // 设置表单数据，格式化时间字段
  formData.value = {
    ...data,
    payTime: data.payTime ? formatDate(data.payTime, 'YYYY-MM-DD HH:mm:ss') : '',
    checkTime: data.checkTime ? formatDate(data.checkTime, 'YYYY-MM-DD HH:mm:ss') : ''
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 审核操作 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const handleAudit = async () => {
  try {
    // 审核确认
    await message.confirm('确定审核通过该付款记录吗？')
    formLoading.value = true

    // 调用审核接口
    await PaymentRecordApi.checkUserOrder(formData.value.id)
    message.success('审核成功')

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch {
    // 用户取消或者接口错误
  } finally {
    formLoading.value = false
  }
}

/** 结算操作 */
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
