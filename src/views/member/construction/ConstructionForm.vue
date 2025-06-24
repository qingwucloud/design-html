<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="800px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
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
                :key="item.userId"
                :label="item.name + '-' + item.mobile"
                :value="item.userId"
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
            <el-input v-model="formData.projectAddress" placeholder="请输入工程地址" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="建筑面积(㎡)" prop="builtArea">
            <el-input-number
              v-model="formData.builtArea"
              :min="0"
              :precision="2"
              placeholder="请输入建筑面积"
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实测面积(㎡)" prop="measuredArea">
            <el-input-number
              v-model="formData.measuredArea"
              :min="0"
              :precision="2"
              placeholder="请输入实测面积"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="合同总金额(元)" prop="totalAmount">
            <el-input-number
              v-model="formData.totalAmount"
              :min="0"
              :precision="2"
              placeholder="请输入合同总金额"
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同时间" prop="contractTime">
            <el-date-picker
              v-model="contractTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="补充说明" prop="footnote">
        <el-input
          v-model="formData.footnote"
          type="textarea"
          :rows="3"
          placeholder="请输入补充说明"
        />
      </el-form-item>

      <el-form-item label="合同附件" prop="attachmentUrl">
        <UploadFile
          v-model="formData.attachmentUrl"
          :file-type="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf']"
          :limit="1"
          :file-size="20"
          class="w-full"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CertificationApi } from '@/api/member/certification'
import { ContractApi } from '@/api/member/contract'

/** 施工合同表单 */
defineOptions({ name: 'ConstructionForm' })

const message = useMessage() // 消息弹窗

// 施工合同保存请求类型
interface ContractConstructionSaveReqVO {
  id?: number
  attachmentUrl: string
  builtArea: number
  communityName: string
  contractName: string
  customerMobile: string
  customerName: string
  endTime: string
  footnote?: string
  measuredArea: number
  projectAddress: string
  startTime: string
  totalAmount: number
  userId: number
}

// 返佣客户列表
const userList = ref<any[]>([])
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；detail - 详情

// 合同时间范围
const contractTime = ref<[string, string]>(['', ''])

// 表单数据
const formData = ref({
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
  startTime: '',
  endTime: '',
  footnote: '',
  attachmentUrl: ''
})

// 表单验证规则
const formRules = reactive({
  contractName: [{ required: true, message: '合同名称不能为空', trigger: 'blur' }],
  userId: [{ required: true, message: '请选择返佣客户', trigger: 'change' }],
  customerName: [{ required: true, message: '客户姓名不能为空', trigger: 'blur' }],
  customerMobile: [
    { required: true, message: '客户手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  communityName: [{ required: true, message: '小区名称不能为空', trigger: 'blur' }],
  projectAddress: [{ required: true, message: '工程地址不能为空', trigger: 'blur' }],
  builtArea: [{ required: true, message: '建筑面积不能为空', trigger: 'blur' }],
  measuredArea: [{ required: true, message: '实测面积不能为空', trigger: 'blur' }],
  totalAmount: [{ required: true, message: '合同总金额不能为空', trigger: 'blur' }],
  contractTime: [{ required: true, message: '请选择合同时间', trigger: 'change' }],
  attachmentUrl: [{ required: true, message: '请上传合同附件', trigger: 'change' }]
})

const formRef = ref() // 表单 Ref

// 监听合同时间变化
watch(contractTime, (newVal) => {
  if (newVal && newVal.length === 2) {
    formData.value.startTime = newVal[0]
    formData.value.endTime = newVal[1]
  }
})

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增施工合同' : '施工合同详情'
  formType.value = type
  resetForm()

  // 获取返佣客户列表
  try {
    const data = await CertificationApi.getAllDesignerUserPage()
    userList.value = data
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }

  // 详情时，设置数据
  if (type === 'detail' && row?.id) {
    formLoading.value = true
    try {
      const data = await ContractApi.getConstruction(row.id)
      formData.value = { ...data }

      // 设置合同时间
      if (data.startTime && data.endTime) {
        contractTime.value = [
          formatDate(data.startTime, 'YYYY-MM-DD'),
          formatDate(data.endTime, 'YYYY-MM-DD')
        ]
      }
    } catch (error) {
      console.error('获取合同详情失败:', error)
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

  // 检查合同时间
  if (!contractTime.value || contractTime.value.length !== 2) {
    message.error('请选择合同时间')
    return
  }

  // 提交请求
  formLoading.value = true
  try {
    const submitData: ContractConstructionSaveReqVO = {
      contractName: formData.value.contractName,
      userId: formData.value.userId!,
      customerName: formData.value.customerName,
      customerMobile: formData.value.customerMobile,
      communityName: formData.value.communityName,
      projectAddress: formData.value.projectAddress,
      builtArea: formData.value.builtArea!,
      measuredArea: formData.value.measuredArea!,
      totalAmount: formData.value.totalAmount!,
      startTime: contractTime.value[0],
      endTime: contractTime.value[1],
      footnote: formData.value.footnote,
      attachmentUrl: formData.value.attachmentUrl
    }

    if (formType.value === 'create') {
      // 由于接口类型定义有问题，我们直接使用 any 类型
      await ContractApi.createConstruction(submitData as any)
      message.success('创建成功')
    }

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } catch (error) {
    console.error('提交失败:', error)
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
    startTime: '',
    endTime: '',
    footnote: '',
    attachmentUrl: ''
  }
  contractTime.value = ['', '']
  formRef.value?.resetFields()
}

/** 格式化日期 */
const formatDate = (date: any, format: string) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`
  }
  return date
}
</script>
