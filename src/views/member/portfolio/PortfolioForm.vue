<template>
  <Dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="1080px"
    scroll
    max-height="700px"
    top="2vh"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="130px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="设计师" prop="userId">
            <el-select
              :disabled="formType === 'update'"
              v-model="formData.userId"
              filterable
              placeholder="请选择设计师"
            >
              <el-option
                v-for="item in designerList"
                :key="item.userId"
                :label="item.name + '-' + item.mobile"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作品标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入作品标题" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="小区名称" prop="communityName">
            <el-input
              v-model="formData.communityName"
              placeholder="请输入小区名称"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="面积" prop="area">
            <el-input-number
              class="w-full!"
              :max="500"
              :min="10"
              :precision="1"
              v-model="formData.area"
              placeholder="请输入面积(㎡)"
            >
              <template #suffix>
                <span>㎡</span>
              </template>
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="户型" prop="portfolioHouseType">
            <el-select v-model="formData.portfolioHouseType" placeholder="请选择户型">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PORTFOLIO_HOUSE_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总造价金额" prop="totalMoney">
            <el-input
              v-model="formData.totalMoney"
              type="number"
              maxlength="10"
              placeholder="请输入总造价金额"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="作品风格类型" prop="designerStyleType">
            <el-select
              multiple
              :multiple-limit="2"
              v-model="formData.designerStyleType"
              placeholder="请选择作品风格类型"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.DESIGNER_STYLE_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作品标签类型" prop="portfolioTagType">
            <el-select
              multiple
              :multiple-limit="2"
              v-model="formData.portfolioTagType"
              placeholder="请选择作品标签类型"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PORTFOLIO_TAG_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="主图" prop="coverUrl">
        <upload-img v-model="formData.coverUrl" />
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <Editor v-model="formData.content" height="350px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PortfolioApi } from '@/api/member/portfolio'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CertificationApi } from '@/api/member/certification'
import { validateCountWords } from '@/utils/formRules'

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
  portfolioTagType: [],
  designerStyleType: [],
  content: undefined,
  viewCount: undefined,
  likeCount: undefined,
  sortNum: undefined,
  checker: undefined
})
const formRules = reactive({
  userId: [{ required: true, message: '设计师不能为空', trigger: 'blur' }],
  communityName: [{ required: true, message: '小区名称不能为空', trigger: 'blur' }],
  totalMoney: [{ required: true, message: '总造价金额不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '作品标题不能为空', trigger: 'blur' }],
  coverUrl: [{ required: true, message: '主图不能为空', trigger: 'blur' }],
  portfolioHouseType: [{ required: true, message: '户型不能为空', trigger: 'blur' }],
  area: [{ required: true, message: '面积不能为空', trigger: 'blur' }],
  portfolioTagType: [{ required: true, message: '作品标签类型不能为空', trigger: 'change' }],
  designerStyleType: [{ required: true, message: '作品风格类型不能为空', trigger: 'change' }],
  content: [
    {
      validator: (rule: any, value: string, callback: any) =>
        validateCountWords(rule, value, callback, 500),
      trigger: 'blur'
    }
  ]
})
const formRef = ref() // 表单 Ref
const designerList = ref<any[]>([]) // 设计师列表
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  designerList.value = await CertificationApi.getAllDesignerUserPage()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      let data = await PortfolioApi.getPortfolio(id)
      formData.value = {
        ...data,
        portfolioTagType: data.portfolioTagType
          ? data.portfolioTagType.split(',').map((item) => Number(item))
          : [],
        designerStyleType: data.designerStyleType
          ? data.designerStyleType.split(',').map((item) => Number(item))
          : []
      }
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
    const data = {
      userId: formData.value.userId,
      id: formData.value.id,
      communityName: formData.value.communityName,
      totalMoney: formData.value.totalMoney,
      title: formData.value.title,
      area: formData.value.area,
      portfolioHouseType: formData.value.portfolioHouseType,
      coverUrl: formData.value.coverUrl,
      portfolioTagType: formData.value.portfolioTagType.join(','),
      designerStyleType: formData.value.designerStyleType.join(','),
      content: formData.value.content
    }

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
    portfolioTagType: [],
    designerStyleType: [],
    content: undefined,
    viewCount: undefined,
    likeCount: undefined,
    sortNum: undefined,
    checker: undefined
  }
  formRef.value?.resetFields()
}
</script>
