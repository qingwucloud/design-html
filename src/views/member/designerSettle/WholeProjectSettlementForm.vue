<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000px" is-center="">
    <!-- 全案申请结算表单 -->
    <el-form ref="formRef" :model="formData" label-width="120px" v-loading="formLoading">
      <!-- 记录详情 -->
      <el-divider content-position="left">全案申请详情</el-divider>

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
          <el-form-item label="合同总金额">
            <el-input v-model="formData.totalAmount" :disabled="true">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结算金额">
            <el-input v-model="formData.amount" :disabled="true">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="付款比例">
            <el-input v-model="formData.ratio" :disabled="true">
              <template #append>%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请时间">
            <el-input v-model="formData.createTime" :disabled="true" />
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
          <el-form-item label="结算状态">
            <el-tag v-if="formData.settlementStatus == 0" type="warning">待结算</el-tag>
            <el-tag v-else-if="formData.settlementStatus == 1" type="success">已结算</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.checkTime">
          <el-form-item label="审核时间">
            <el-input v-model="formData.checkTime" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="formData.checker">
        <el-col :span="12">
          <el-form-item label="审核人">
            <el-input v-model="formData.checker" :disabled="true" />
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
      <el-button @click="dialogVisible = false">
        {{ formType === 'detail' ? '关闭' : '取消' }}
      </el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { PaymentRecordApi } from '@/api/member/paymentrecord'
import { formatDate } from '@/utils/formatTime'
import { copyBankInfo } from '@/utils/clipboard'

/** 全案申请结算表单 */
defineOptions({ name: 'WholeProjectSettlementForm' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：detail - 详情；settlement - 结算
const formData = ref<any>({})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, data: any) => {
  dialogVisible.value = true
  formType.value = type
  dialogTitle.value = type === 'detail' ? '详情' : '全案申请结算'
  // 设置表单数据，格式化时间字段
  formData.value = {
    ...data,
    createTime: data.createTime ? formatDate(data.createTime, 'YYYY-MM-DD HH:mm:ss') : '',
    checkTime: data.checkTime ? formatDate(data.checkTime, 'YYYY-MM-DD HH:mm:ss') : ''
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 结算操作 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const handleSettlement = async () => {
  try {
    await message.confirm('确定进行全案申请结算吗？确认后钱款将打入设计师钱包账户！！！')
    formLoading.value = true

    // 准备提交参数
    const submitData = {
      id: formData.value.id
    }

    // 调用结算接口
    await PaymentRecordApi.checkFullSettlement(submitData)
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
