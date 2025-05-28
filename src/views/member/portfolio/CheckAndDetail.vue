<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1080px" top="2vh">
    <el-form ref="formRef" :model="formData" label-width="130px" v-loading="formLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设计师" prop="userId">
           <div class="flex gap-20px">
             <el-select
               class="w-280px!"
               disabled
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
             <el-button
               @click="openDetail(formData.userId)"
               link
               type="primary"
               v-hasPermi="['member:certification:detail']"
             >
               设计师详情
             </el-button>
           </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作品标题" prop="title">
            <el-input
              disabled
              v-model="formData.title"
              placeholder="请输入作品标题"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="小区名称" prop="communityName">
            <el-input
              disabled
              v-model="formData.communityName"
              placeholder="请输入小区名称"
              maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="面积" prop="area">
            <el-input-number
              disabled
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
            <el-select disabled v-model="formData.portfolioHouseType" placeholder="请选择户型">
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
              disabled
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
              disabled
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
              disabled
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
      <el-row v-if="formType === 'detail'">
        <el-col :span="12">
          <el-form-item label="浏览次数" prop="viewCount">
            <el-input disabled v-model="formData.viewCount" placeholder="" maxlength="20">
              <template #append>次</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="点赞次数" prop="likeCount">
            <el-input disabled v-model="formData.likeCount" placeholder="" maxlength="20">
              <template #append>次</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="审核状态" prop="status">
            <el-tag v-if="formData.status === 0" type="warning" size="small">待审核</el-tag>
            <el-tag v-else-if="formData.status === 1" type="primary" size="small">已审核</el-tag>
            <el-tag v-else type="danger" size="small">已驳回</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="驳回原因" prop="rejectReason">
            <el-input
              disabled
              v-model="formData.rejectReason"
              placeholder=""
              type="textarea"
              autosize
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="主图" prop="coverUrl">
            <el-image
              :src="formData.coverUrl"
              fit="cover"
              show-progress
              class="w-100px h-100px"
              :preview-src-list="[formData.coverUrl]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" />
      </el-row>

      <el-form-item label="内容" prop="content">
        <Editor readonly v-model="formData.content" height="250px" />
      </el-form-item>
    </el-form>
    <el-form
      v-if="formType === 'check'"
      ref="formRef"
      :model="checkData"
      label-width="130px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="审核意见" prop="status">
            <el-radio-group v-model="checkData.status">
              <el-radio :value="1">通过</el-radio>
              <el-radio :value="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="checkData.status == 2">
          <el-form-item
            :rules="[{ required: true, message: '请输入驳回意见' }]"
            label="驳回原因"
            prop="rejectReason"
            v-if="checkData.status"
          >
            <el-input
              v-model="checkData.rejectReason"
              :rows="2"
              type="textarea"
              placeholder="请输入驳回原因"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button
        @click="submitForm"
        type="primary"
        v-if="formType === 'check'"
        :disabled="formLoading"
        >审 核
      </el-button>
      <el-button v-else @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PortfolioApi } from '@/api/member/portfolio'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CertificationApi } from '@/api/member/certification'

defineOptions({ name: 'PortfolioForm' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：detail - 详情；check - 审核
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
  rejectReason: undefined,
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

const checkData = ref({
  status: 1, // 审核状态：1-通过；2-驳回
  rejectReason: '' // 驳回原因
})
const formRef = ref() // 表单 Ref
const designerList = ref<any[]>([]) // 设计师列表
const { push } = useRouter()
const openDetail = (id: number) => {
  push({ name: 'MemberDesignerDetail', params: { id } })
}
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'detail' ? '详情' : '审核'
  formType.value = type
  checkData.value = {
    status: 1,
    rejectReason: ''
  }
  designerList.value = await CertificationApi.getAllDesignerUserPage()
  let data = await PortfolioApi.getPortfolio(id as number)
  formData.value = {
    ...data,
    portfolioTagType: data.portfolioTagType
      ? data.portfolioTagType.split(',').map((item) => Number(item))
      : [],
    designerStyleType: data.designerStyleType
      ? data.designerStyleType.split(',').map((item) => Number(item))
      : []
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
      id: formData.value.id,
      ...checkData.value
    }
    await PortfolioApi.checkPortfolio(data)
    message.success('审核成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>
