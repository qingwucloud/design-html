<template>
  <Dialog v-model="dialogVisible" title="添加虚拟评论">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="设计师" prop="designerId" v-if="!route.params.id">
        <el-select v-model="formData.designerId" filterable placeholder="请选择设计师">
          <el-option
            v-for="item in designerList"
            :key="item.userId"
            :label="item.name + '-' + item.mobile"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户头像" prop="userAvatar">
        <UploadImg v-model="formData.userAvatar" height="60px" width="60px" />
      </el-form-item>
      <el-form-item label="用户账号" prop="userNickname">
        <el-input v-model="formData.userNickname" placeholder="请输入用户账号" />
      </el-form-item>
      <el-form-item label="评论内容" prop="content">
        <el-input v-model="formData.content" type="textarea" />
      </el-form-item>
      <!-- <el-form-item label="描述星级" prop="descriptionScores">
        <el-rate v-model="formData.descriptionScores" />
      </el-form-item> -->
      <el-form-item label="服务星级" prop="benefitScores">
        <el-rate v-model="formData.benefitScores" />
      </el-form-item>
      <el-form-item label="评论图片" prop="picUrls">
        <UploadImgs v-model="formData.picUrls" :limit="9" height="80px" width="80px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup>
import * as CommentApi from '@/api/member/comment'
import * as ProductSpuApi from '@/api/mall/product/spu'
import { CertificationApi } from '@/api/member/certification'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const route = useRoute() // 路由
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  userId: undefined,
  designerId: undefined,
  contractName: undefined,
  contractId: undefined,
  userNickname: undefined,
  userAvatar: 'https://80du-design.oss-cn-shenzhen.aliyuncs.com/static/avatar.png',
  descriptionScores: 5,
  benefitScores: 5,
  content: undefined,
  picUrls: []
})
const formRules = reactive({
  // spuId: [{ required: true, message: '商品不能为空', trigger: 'blur' }],
  // skuId: [{ required: true, message: '规格不能为空', trigger: 'blur' }],
  designerId: [{ required: true, message: '设计师不能为空', trigger: 'blur' }],
  userAvatar: [{ required: true, message: '用户头像不能为空', trigger: 'blur' }],
  userNickname: [{ required: true, message: '用户账号不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '评论内容不能为空', trigger: 'blur' }],
  descriptionScores: [{ required: true, message: '描述星级不能为空', trigger: 'blur' }],
  benefitScores: [{ required: true, message: '服务星级不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const designerList = ref([]) // 设计师列表
/** 打开弹窗 */
const open = async (type, id) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  let data = await CertificationApi.getAllDesignerUserPage()
  designerList.value = data
  if (route.params.id) {
    formData.value.designerId = route.params.id
  }
  // 修改时，设置数据
  // if (id) {
  //   formLoading.value = true
  //   try {
  //     formData.value = await CommentApi.getComment(id)
  //   } finally {
  //     formLoading.value = false
  //   }
  // }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    if (formType.value === 'create') {
      await CommentApi.createComment({
        ...formData.value
      })
      message.success(t('common.createSuccess'))
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
    designerId: undefined,
    contractName: undefined,
    contractId: undefined,
    userNickname: undefined,
    userAvatar: 'https://80du-design.oss-cn-shenzhen.aliyuncs.com/static/avatar.png',
    descriptionScores: 5,
    benefitScores: 5,
    content: undefined,
    picUrls: []
  }
  formRef.value?.resetFields()
}
</script>
<style>
.select-box {
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px dashed var(--el-border-color-darker);
  border-radius: 8px;
  align-items: center;
  justify-content: center;
}
</style>
