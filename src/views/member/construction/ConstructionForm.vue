<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="900px" is-center>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
      :disabled="formType === 'detail'"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="formData.contractName" placeholder="请输入合同名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="返佣客户" prop="userId">
            <el-select
              v-model="formData.userId"
              filterable
              placeholder="请选择返佣客户"
              class="w-full"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="(item.name || item.nickname) + '-' + item.mobile"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客户姓名" prop="customerName">
            <el-input v-model="formData.customerName" placeholder="请输入客户姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户手机号" prop="customerMobile">
            <el-input v-model="formData.customerMobile" placeholder="请输入客户手机号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="小区名称" prop="communityName">
            <el-input v-model="formData.communityName" placeholder="请输入小区名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工程地址" prop="projectAddress">
            <el-input
              v-model="formData.projectAddress"
              type="textarea"
              :rows="2"
              :placeholder="formType === 'detail' ? '暂无' : '请输入详细的工程地址'"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="建筑面积(㎡)" prop="builtArea">
            <el-input-number
              v-if="formType !== 'detail'"
              v-model="formData.builtArea"
              :min="0"
              :precision="0"
              placeholder="请输入建筑面积"
              class="w-full!"
            />
            <el-input
              v-else
              :value="formData.builtArea ? formData.builtArea + ' ㎡' : ''"
              disabled
              placeholder="暂无"
              class="w-full!"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实测面积(㎡)" prop="measuredArea">
            <el-input-number
              v-if="formType !== 'detail'"
              v-model="formData.measuredArea"
              :min="0"
              :precision="0"
              placeholder="请输入实测面积"
              class="w-full!"
            />
            <el-input
              v-else
              :value="formData.measuredArea ? formData.measuredArea + ' ㎡' : ''"
              disabled
              placeholder="暂无"
              class="w-full!"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="合同总金额(元)" prop="totalAmount">
            <el-input-number
              v-if="formType !== 'detail'"
              v-model="formData.totalAmount"
              :min="0"
              :precision="0"
              placeholder="请输入合同总金额"
              class="w-full!"
            />
            <el-input
              v-else
              :value="formData.totalAmount ? formData.totalAmount + ' 元' : ''"
              disabled
              placeholder="暂无"
              class="w-full!"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="佣金比例(%)" prop="commissionRate">
            <el-input-number
              v-if="formType !== 'detail'"
              v-model="formData.commissionRate"
              :min="0"
              :max="10"
              :precision="1"
              placeholder="请输入佣金比例"
              class="w-full!"
            />
            <el-input
              v-else
              :value="formData.commissionRate ? formData.commissionRate : ''"
              disabled
              placeholder="暂无"
              class="w-full!"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="返佣金额(元)">
            <el-input :value="calculateCommissionAmount()" disabled class="w-full!" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同时间" prop="contractTime">
            <el-date-picker
              v-if="formType !== 'detail'"
              v-model="formData.contractTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              class="w-full"
            />
            <el-input
              v-else
              :value="
                formData.contractTime && formData.contractTime[0] && formData.contractTime[1]
                  ? formData.contractTime[0] + ' 至 ' + formData.contractTime[1]
                  : ''
              "
              disabled
              placeholder="-"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="合同附件" prop="attachmentUrl">
        <UploadFile
          :disabled="formType === 'detail'"
          v-model="formData.attachmentUrl"
          :file-type="['png', 'jpg', 'jpeg', 'pdf']"
          :limit="3"
          :file-size="20"
          class="w-full"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        v-if="formType === 'create'"
        @click="submitForm"
        type="primary"
        :disabled="formLoading"
      >
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">
        {{ formType === 'detail' ? '关 闭' : '取 消' }}
      </el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CertificationApi } from '@/api/member/certification'
import { ContractApi } from '@/api/member/contract'
import { formatDate } from '@/utils/formatTime'

/** 施工合同表单 */
defineOptions({ name: 'ConstructionForm' })

const message = useMessage() // 消息弹窗

// 返佣客户列表
const userList = ref<any[]>([])
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；detail - 详情

// 表单数据
const formData = ref({
  id: undefined as number | undefined,
  contractName: '',
  userId: undefined as number | undefined,
  customerName: '',
  customerMobile: '',
  communityName: '',
  projectAddress: '',
  builtArea: undefined as number | undefined,
  measuredArea: undefined as number | undefined,
  totalAmount: undefined as number | undefined,
  commissionRate: 2, // 默认佣金比例2%
  commissionAmount: undefined as number | undefined, // 添加佣金金额字段
  footnote: '',
  attachmentUrl: '',
  endTime: '',
  startTime: '',
  contractTime: ['', ''] as [string, string]
})

// 表单验证规则
const formRules = reactive({
  contractName: [{ required: true, message: '合同名称不能为空', trigger: 'blur' }],
  userId: [{ required: true, message: '请选择返佣客户', trigger: 'change' }],
  customerName: [{ required: true, message: '客户姓名不能为空', trigger: 'blur' }],
  customerMobile: [
    { required: true, message: '客户手机号不能为空', trigger: 'blur' },
    { pattern: /^1[2-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  communityName: [{ required: true, message: '小区名称不能为空', trigger: 'blur' }],
  projectAddress: [{ required: true, message: '工程地址不能为空', trigger: 'blur' }],
  builtArea: [{ required: true, message: '建筑面积不能为空', trigger: 'blur' }],
  measuredArea: [{ required: true, message: '实测面积不能为空', trigger: 'blur' }],
  totalAmount: [{ required: true, message: '合同总金额不能为空', trigger: 'blur' }],
  commissionRate: [{ required: true, message: '佣金比例不能为空', trigger: 'blur' }],
  attachmentUrl: [{ required: true, message: '请上传合同附件', trigger: ['change', 'blur'] }]
})

const formRef = ref() // 表单 Ref

/** 计算返佣金额 */
const calculateCommissionAmount = () => {
  // 详情模式时，如果有后端返回的佣金金额，直接显示
  if (formType.value === 'detail' && typeof formData.value.commissionAmount === 'number') {
    return formData.value.commissionAmount.toFixed(2)
  }

  // 新增模式时，根据合同金额和佣金比例自动计算
  if (!formData.value.totalAmount || !formData.value.commissionRate) {
    return '0.00'
  }
  const amount = ((formData.value.totalAmount * formData.value.commissionRate) / 100).toFixed(2)
  return amount
}

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增施工合同' : '施工合同详情'
  formType.value = type
  resetForm()

  // 获取返佣客户列表
  const data = await CertificationApi.getAllUserPage()
  userList.value = data

  // 详情时，设置数据
  if (type === 'detail' && row?.id) {
    formLoading.value = true
    try {
      const data = await ContractApi.getConstruction(row.id)
      formData.value = {
        ...data,
        commissionAmount: row.commissionAmount || 0,
        commissionRate: row.commissionRate || 2 // 如果没有佣金比例，默认设置为2%
      }

      // 设置合同时间
      if (data.startTime && data.endTime) {
        formData.value.contractTime = [
          formatDate(data.startTime, 'YYYY-MM-DD'),
          formatDate(data.endTime, 'YYYY-MM-DD')
        ]
      }
    } catch (error) {
      message.error('获取合同详情失败')
    } finally {
      formLoading.value = false
    }
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const submitForm = async () => {
  // 详情模式不允许提交
  if (formType.value === 'detail') {
    dialogVisible.value = false
    return
  }

  // 校验表单
  await formRef.value.validate()

  // 添加确认对话框
  const confirmMsg = '确认提交该施工合同？提交后，佣金将会打款至用户余额'
  await message.confirm(confirmMsg)

  // 提交请求
  formLoading.value = true
  try {
    const submitData: any = {
      contractName: formData.value.contractName,
      userId: formData.value.userId!,
      customerName: formData.value.customerName,
      customerMobile: formData.value.customerMobile,
      communityName: formData.value.communityName,
      projectAddress: formData.value.projectAddress,
      builtArea: formData.value.builtArea!,
      measuredArea: formData.value.measuredArea!,
      totalAmount: formData.value.totalAmount!,
      commissionRate: formData.value.commissionRate!,
      // 后端需要毫秒 unix 时间戳
      startTime: formData.value.contractTime?.[0]
        ? new Date(formData.value.contractTime[0]).getTime()
        : 0,
      endTime: formData.value.contractTime?.[1]
        ? new Date(formData.value.contractTime[1]).getTime()
        : 0,
      footnote: formData.value.footnote,
      attachmentUrl: formData.value.attachmentUrl
    }

    if (formType.value === 'create') {
      // 由于接口类型定义有问题，我们直接使用 any 类型
      await ContractApi.createConstruction(submitData as any)
      message.success('提交成功')
    }

    dialogVisible.value = false
    // 发送操作成功的事件，通知父组件刷新列表
    emit('success')
  } catch (error) {
    message.error('提交失败')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    contractName: '',
    userId: undefined,
    customerName: '',
    customerMobile: '',
    communityName: '',
    projectAddress: '',
    builtArea: undefined,
    measuredArea: undefined,
    totalAmount: undefined,
    commissionRate: 2, // 重置时也设为默认值2%
    commissionAmount: undefined, // 添加佣金金额字段
    footnote: '',
    attachmentUrl: '',
    contractTime: ['', '']
  }
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
