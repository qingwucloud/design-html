<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="formData.userId" placeholder="请输入用户ID" />
      </el-form-item>
      <el-form-item label="小区名称" prop="communityName">
        <el-input v-model="formData.communityName" placeholder="请输入小区名称" />
      </el-form-item>
      <el-form-item label="总造价金额" prop="totalMoney">
        <el-input v-model="formData.totalMoney" placeholder="请输入总造价金额" />
      </el-form-item>
      <el-form-item label="作品标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入作品标题" />
      </el-form-item>
      <el-form-item label="审核状态 0未审核 1已审核" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="主图URL" prop="coverUrl">
        <el-input v-model="formData.coverUrl" placeholder="请输入主图URL" />
      </el-form-item>
      <el-form-item label="户型字典" prop="portfolioHouseType">
        <el-radio-group v-model="formData.portfolioHouseType">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="面积(㎡)" prop="area">
        <el-input v-model="formData.area" placeholder="请输入面积(㎡)" />
      </el-form-item>
      <el-form-item label="省代码" prop="privoce">
        <el-input v-model="formData.privoce" placeholder="请输入省代码" />
      </el-form-item>
      <el-form-item label="市代码" prop="city">
        <el-input v-model="formData.city" placeholder="请输入市代码" />
      </el-form-item>
      <el-form-item label="区代码" prop="region">
        <el-input v-model="formData.region" placeholder="请输入区代码" />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="formData.address" placeholder="请输入详细地址" />
      </el-form-item>
      <el-form-item label="作品标签类型(逗号分隔)" prop="portfolioTagType">
        <el-select v-model="formData.portfolioTagType" placeholder="请选择作品标签类型(逗号分隔)">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="作品风格类型(逗号分隔)" prop="designerStyleType">
        <el-select v-model="formData.designerStyleType" placeholder="请选择作品风格类型(逗号分隔)">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="富文本内容" prop="content">
        <Editor v-model="formData.content" height="150px" />
      </el-form-item>
      <el-form-item label="浏览次数" prop="viewCount">
        <el-input v-model="formData.viewCount" placeholder="请输入浏览次数" />
      </el-form-item>
      <el-form-item label="点赞次数" prop="likeCount">
        <el-input v-model="formData.likeCount" placeholder="请输入点赞次数" />
      </el-form-item>
      <el-form-item label="置顶优先级排序" prop="sortNum">
        <el-input v-model="formData.sortNum" placeholder="请输入置顶优先级排序" />
      </el-form-item>
      <el-form-item label="审核人" prop="checker">
        <el-input v-model="formData.checker" placeholder="请输入审核人" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PortfolioApi, PortfolioVO } from '@/api/member/portfolio'

/** 设计师作品集 表单 */
defineOptions({ name: 'PortfolioForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  userId: undefined,
  communityName: undefined,
  totalMoney: undefined,
  title: undefined,
  status: undefined,
  coverUrl: undefined,
  portfolioHouseType: undefined,
  area: undefined,
  privoce: undefined,
  city: undefined,
  region: undefined,
  address: undefined,
  portfolioTagType: undefined,
  designerStyleType: undefined,
  content: undefined,
  viewCount: undefined,
  likeCount: undefined,
  sortNum: undefined,
  checker: undefined
})
const formRules = reactive({
  userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  communityName: [{ required: true, message: '小区名称不能为空', trigger: 'blur' }],
  totalMoney: [{ required: true, message: '总造价金额不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '作品标题不能为空', trigger: 'blur' }],
  coverUrl: [{ required: true, message: '主图URL不能为空', trigger: 'blur' }],
  portfolioHouseType: [{ required: true, message: '户型字典不能为空', trigger: 'blur' }],
  area: [{ required: true, message: '面积(㎡)不能为空', trigger: 'blur' }],
  portfolioTagType: [{ required: true, message: '作品标签类型(逗号分隔)不能为空', trigger: 'change' }],
  designerStyleType: [{ required: true, message: '作品风格类型(逗号分隔)不能为空', trigger: 'change' }],
  content: [{ required: true, message: '富文本内容不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PortfolioApi.getPortfolio(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PortfolioVO
    if (formType.value === 'create') {
      await PortfolioApi.createPortfolio(data)
      message.success(t('common.createSuccess'))
    } else {
      await PortfolioApi.updatePortfolio(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    userId: undefined,
    communityName: undefined,
    totalMoney: undefined,
    title: undefined,
    status: undefined,
    coverUrl: undefined,
    portfolioHouseType: undefined,
    area: undefined,
    privoce: undefined,
    city: undefined,
    region: undefined,
    address: undefined,
    portfolioTagType: undefined,
    designerStyleType: undefined,
    content: undefined,
    viewCount: undefined,
    likeCount: undefined,
    sortNum: undefined,
    checker: undefined
  }
  formRef.value?.resetFields()
}
</script>