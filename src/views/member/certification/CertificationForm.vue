<template>
  <Dialog title="审核" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item disabled label="工作经验" prop="workExperience">
            <el-input v-model="formData.workExperience" placeholder="请输入工作经验" >
              <template #append>年</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item disabled label="设计师等级" prop="designerGradeType">
            <el-select v-model="formData.designerGradeType" placeholder="请选择设计师等级 见dict_type">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.DESIGNER_GRADE_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>



      <el-form-item disabled label="擅长风格" prop="designerStyleType">
        <el-select multiple v-model="formData.designerStyleType" placeholder="请选择擅长风格">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.DESIGNER_STYLE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item disabled label="申请时间" prop="applyTime">
        <el-date-picker
          v-model="formData.applyTime"
          type="date"
          placeholder="选择申请认证时间"
        />
      </el-form-item>
      <el-form-item disabled label="个人简介" prop="profile">
        <el-input
          v-model="formData.profile"
          style="width: 240px"
          :rows="2"
          type="textarea"
          placeholder="Please input"
        />
      </el-form-item>
      <el-form-item disabled label="证书" prop="certificates">
        <el-image
          :key="item"
          v-for="item in formData.certificates"
          style="width: 100px; height: 100px"
          :src="item"
          :preview-src-list="formData.certificates"
          show-progress
          fit="cover"
        />
      </el-form-item>
      <el-form-item label="审核意见" prop="certStatus">
        <el-radio-group v-model="formData.certStatus">
          <el-radio value="0">驳回</el-radio>
          <el-radio value="1">通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="驳回原因" prop="auditReason" v-if="formData.certStatus">
        <el-input
          v-model="formData.profile"
          style="width: 240px"
          :rows="2"
          type="textarea"
          placeholder="Please input"
        />
      </el-form-item>

    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">通 过</el-button>
      <el-button @click="dialogVisible = false">驳 回</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CertificationApi, CertificationVO } from '@/api/member/certification'
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";

defineOptions({ name: 'CertificationForm' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: 0,
  workExperience: 0,
  score: 0,
  designerGradeType: 0,
  designerStyleType: 0,
  applyTime: "",
  lng: 0,
  lat: 0,
  address: "",
  profile: "",
  certificates: [],
  cardNo: "",
  cardName: "",
  cardImgFront: "",
  cardImgBack: "",
  cardAddr: "",
  cardOrgan: "",
  cardStartdate: "",
  cardValidate: "",
  resumes: [],
  certStatus:'',
  auditReason: ''
})

const formRef = ref() // 表单 Ref
const formRules =computed(()=>{
   if (formData.value.certStatus === '1') {
     return { auditReason:[{ required:true,message:'请输入审核意见',trigger:'blur'}]}
   }
  return []  // 如果审核意见不需要，则返回空数组
})

/** 打开弹窗 */
const open = async (id?: number) => {
  dialogVisible.value = true
  resetForm()
  formLoading.value = true
  try {
    let data = await CertificationApi.getCertification(id)
    formData.value={
      ...data,
      certificates: data.certificates?.slice(',') || [],
      certStatus:1,
      auditReason: ''
    }
  } finally {
    formLoading.value = false
  }
}


/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CertificationVO
    await CertificationApi.checkCertification(data)
    message.success('')
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: 0,
    workExperience: 0,
    score: 0,
    designerGradeType: 0,
    designerStyleType: 0,
    applyTime: "",
    lng: 0,
    lat: 0,
    address: "",
    profile: "",
    certificates: [],
    cardNo: "",
    cardName: "",
    cardImgFront: "",
    cardImgBack: "",
    cardAddr: "",
    cardOrgan: "",
    cardStartdate: "",
    cardValidate: "",
    resumes: [],
    certStatus:'',
    auditReason: ''
  }
  formRef.value?.resetFields()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
