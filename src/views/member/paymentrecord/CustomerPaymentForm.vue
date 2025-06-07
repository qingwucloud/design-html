<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000px"  custom-class="pay-d">
    <!-- 客户付款审核表单 -->
    <el-form ref="formRef" :model="formData" label-width="120px" v-loading="formLoading">
      <!-- 合同信息 -->
      <el-divider content-position="left">合同信息</el-divider>
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

      <!-- 客户信息 -->
      <el-divider content-position="left">客户信息</el-divider>
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

      <!-- 付款信息 -->
      <el-divider content-position="left">付款信息</el-divider>
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

      <!-- 支付凭证 -->
      <el-divider content-position="left" v-if="paymentVoucherList.length > 0">支付凭证</el-divider>
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

      <!-- 审核信息 -->
      <template v-if="formData.paymentStatus == 2">
        <el-divider content-position="left">审核信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审核人">
              <el-input v-model="formData.checker" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核时间">
              <el-input v-model="formData.checkTime" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>

    <template #footer>
      <el-button
        v-if="formType === 'audit' && formData.paymentStatus === 1"
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

/** 客户付款审核表单 */
defineOptions({ name: 'CustomerPaymentForm' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：detail - 详情；audit - 审核
const formData = ref<any>({})
const formRef = ref() // 表单 Ref

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
  }

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
