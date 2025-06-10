<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000px" is-center>
    <!-- 统一的表单（详情和结算） -->
    <el-form ref="formRef" :model="formData" label-width="120px" v-loading="formLoading">
      <!-- 提现申请详情 -->
      <el-divider content-position="left">提现申请</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名">
            <el-input v-model="formData.userName" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户手机号">
            <el-input v-model="formData.userMobile" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="提现金额">
            <el-input v-model="formData.amount" :disabled="true">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请时间">
            <el-input v-model="formData.createTime" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="提现说明">
            <el-input v-model="formData.remark" type="textarea" :rows="2" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row> -->

      <!-- 银行信息 -->
      <el-divider content-position="left">银行信息</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="账户名称">
            <el-input v-model="formData.userName" :disabled="true" />
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

      <!-- 审核状态 -->
      <el-divider content-position="left">审核状态</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="审核状态">
            <el-tag v-if="formData.checkStatus === 0" type="warning">待审核</el-tag>
            <el-tag v-else-if="formData.checkStatus === 1" type="success">审核通过</el-tag>
            <el-tag v-else-if="formData.checkStatus === 2" type="danger">审核拒绝</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.orderNo">
          <el-form-item label="订单编号">
            <el-input v-model="formData.orderNo" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="formData.checkStatus === 1 || formData.checkStatus === 2">
        <el-col :span="12" v-if="formData.checkTime">
          <el-form-item label="审核时间">
            <el-input v-model="formData.checkTime" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.checker">
          <el-form-item label="审核人">
            <el-input v-model="formData.checker" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="formData.checkStatus === 1 && formData.payTime">
        <el-col :span="12">
          <el-form-item label="付款时间">
            <el-input v-model="formData.payTime" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="formData.checkStatus === 1 && paymentVoucherList.length > 0">
        <el-col :span="24">
          <el-form-item label="支付凭证">
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

      <el-row :gutter="20" v-if="formData.checkStatus === 2 && formData.checkRemark">
        <el-col :span="24">
          <el-form-item label="驳回原因">
            <el-input v-model="formData.checkRemark" type="textarea" :rows="3" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 审核操作 -->
      <template v-if="formType === 'settlement'">
        <el-divider content-position="left">审核操作</el-divider>

        <el-form
          ref="settlementFormRef"
          :model="settlementFormData"
          :rules="settlementFormRules"
          label-width="120px"
        >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="审核状态" prop="checkStatus">
                <el-radio-group v-model="settlementFormData.checkStatus">
                  <el-radio :label="1">审核通过</el-radio>
                  <el-radio :label="2">驳回</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" v-if="settlementFormData.checkStatus === 1">
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

          <el-row :gutter="20" v-if="settlementFormData.checkStatus === 2">
            <el-col :span="24">
              <el-form-item label="驳回原因" prop="checkRemark" required>
                <el-input
                  v-model="settlementFormData.checkRemark"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入驳回原因"
                />
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
        {{ settlementFormData.checkStatus === 1 ? '确认审核通过' : '确认驳回' }}
      </el-button>
      <el-button @click="dialogVisible = false">
        {{ formType === 'detail' ? '关闭' : '取消' }}
      </el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WalletRecordApi } from '@/api/member/wallet'
import { createImageViewer } from '@/components/ImageViewer'
import { formatDate } from '@/utils/formatTime'
import { UploadImg } from '@/components/UploadFile'
import { copyBankInfo } from '@/utils/clipboard'
import { nextTick, watch } from 'vue'
/** 提现审核 表单 */
defineOptions({ name: 'WithdrawalAuditForm' })

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
  id: 0, // 提现ID
  paymentVoucher: '', // 付款凭证
  checkStatus: 1, // 审核状态：1支付审核通过，2驳回
  checkRemark: '' // 审核备注/驳回原因
})

// 动态验证规则
const settlementFormRules = computed(() => {
  const baseRules = {}
  if (settlementFormData.value.checkStatus === 1) {
    // 审核通过需要上传付款凭证
    baseRules['paymentVoucher'] = [{ required: true, message: '请上传付款凭证', trigger: 'change' }]
  } else if (settlementFormData.value.checkStatus === 2) {
    // 驳回需要填写驳回原因
    baseRules['checkRemark'] = [{ required: true, message: '请填写驳回原因', trigger: 'blur' }]
  }
  return baseRules
})

// 支付凭证图片列表
const paymentVoucherList = computed(() => {
  if (!formData.value.paymentVoucher) {
    return []
  }
  // 支付凭证是多张图片拼接的字符串，使用逗号分隔
  return formData.value.paymentVoucher.split(',').filter((url) => url.trim())
})

// 监听审核状态变化，重置关联字段
watch(
  () => settlementFormData.value.checkStatus,
  (newVal) => {
    if (newVal === 1) {
      // 切换到审核通过，清空驳回原因
      settlementFormData.value.checkRemark = ''
    } else if (newVal === 2) {
      // 切换到驳回，清空付款凭证
      settlementFormData.value.paymentVoucher = ''
    }
    // 重置表单验证
    nextTick(() => {
      settlementFormRef.value?.clearValidate()
    })
  }
)

/** 打开弹窗 */
const open = async (type: string, data: any) => {
  dialogVisible.value = true
  formType.value = type

  if (type === 'detail') {
    dialogTitle.value = '提现记录详情'
  } else if (type === 'settlement') {
    dialogTitle.value = '提现记录审核'
    // 重置结算表单数据
    settlementFormData.value = {
      id: data.id, // 设置当前记录ID
      paymentVoucher: '',
      checkStatus: 1, // 默认审核通过
      checkRemark: '' // 默认无备注
    }
  }

  // 设置表单数据，格式化时间字段
  formData.value = {
    ...data,
    createTime: data.createTime ? formatDate(data.createTime, 'YYYY-MM-DD HH:mm:ss') : '',
    checkTime: data.checkTime ? formatDate(data.checkTime, 'YYYY-MM-DD HH:mm:ss') : '',
    settlementTime: data.settlementTime
      ? formatDate(data.settlementTime, 'YYYY-MM-DD HH:mm:ss')
      : '',
    payTime: data.payTime ? formatDate(data.payTime, 'YYYY-MM-DD HH:mm:ss') : ''
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
    const confirmMsg =
      settlementFormData.value.checkStatus === 1
        ? '确定审核通过该提现申请吗？'
        : '确定驳回该提现申请吗？'
    await message.confirm(confirmMsg)
    formLoading.value = true

    // 调用审核接口
    await WalletRecordApi.checkWithdrawal({
      id: settlementFormData.value.id,
      checkStatus: settlementFormData.value.checkStatus,
      paymentVoucher: settlementFormData.value.paymentVoucher,
      checkRemark: settlementFormData.value.checkRemark
    })
    message.success('审核成功')

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch (error) {
    // 用户取消或者接口错误
    console.error('审核失败:', error)
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
