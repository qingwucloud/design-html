<template>
  <Dialog title="审核" v-model="dialogVisible" width="1080px" top="2vh">
    <el-form ref="formRef" :model="formData" label-width="120px" v-loading="formLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="cardName">
            <el-input disabled v-model="formData.cardName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="cardNo">
            <el-input disabled v-model="formData.cardNo" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证地址" prop="cardAddr">
            <el-input disabled v-model="formData.cardAddr" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证签发机关" prop="cardOrgan">
            <el-input disabled v-model="formData.cardOrgan" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证人像面" prop="cardImgBack">
            <el-image
              disabled
              class="w-70px h-70px mr-10px"
              :src="formData.cardImgBack"
              :preview-src-list="[formData.cardImgBack]"
              show-progress
              fit="cover"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证国徽面" prop="cardImgFront">
            <el-image
              :key="formData.cardImgFront"
              disabled
              class="w-70px h-70px mr-10px"
              :src="formData.cardImgFront"
              :preview-src-list="[formData.cardImgFront]"
              show-progress
              fit="cover"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证有效期" prop="cardStartdate">
            <el-input disabled :value="formData.cardStartdate + '-' + formData.cardValidate" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="履历" prop="resumes">
            <el-button type="primary" text @click="dialogResumesVisible = true">查看履历</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工作经验" prop="workExperience">
            <el-input disabled v-model="formData.workExperience" placeholder="请输入工作经验">
              <template #append>年</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设计师等级" prop="designerGradeType">
            <el-select disabled v-model="formData.designerGradeType">
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="擅长风格" prop="designerStyleType">
            <el-select
              disabled
              multiple
              v-model="formData.designerStyleType"
              placeholder="请选择擅长风格"
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
          <el-form-item label="居住地址" prop="address">
            <el-input disabled v-model="formData.address" autosize type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="证书" prop="certificates">
            <div class="flex gap-10px">
              <el-image
                :key="item"
                disabled
                v-for="item in formData.certificates"
                class="w-70px h-70px"
                :src="item"
                :preview-src-list="formData.certificates"
                show-progress
                fit="cover"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="个人简介" prop="profile">
            <el-input
              disabled
              v-model="formData.profile"
              :autosize="{ minRows: 3 }"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="审核意见" prop="certStatus">
            <el-radio-group v-model="formData.certStatus">
              <el-radio :value="1">通过</el-radio>
              <el-radio :value="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.certStatus == 2">
          <el-form-item
            :rules="[{ required: true, message: '请输入驳回意见' }]"
            label="驳回原因"
            prop="rejectReason"
            v-if="formData.certStatus"
          >
            <el-input
              v-model="formData.rejectReason"
              :rows="2"
              type="textarea"
              placeholder="请输入驳回原因"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">审核</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <Dialog title="履历" v-model="dialogResumesVisible" width="1080px">
    <el-form disabled ref="formRef" :model="formData.resumes" label-width="120px">
      <div v-for="resume in formData.resumes" :key="resume.id" class="mb-20px">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="resume.companyName" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职位名称" prop="job">
              <el-input v-model="resume.job" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始日期" prop="job">
              <el-input :value="dayjs(Number(resume.startTime)).format('YYYY-MM-DD')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="job">
              <el-input
                :value="
                  resume.endTime ? dayjs(Number(resume.endTime)).format('YYYY-MM-DD') : '至今'
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位职责" prop="remark">
              <el-input v-model="resume.remark" type="textarea" autosize />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="dialogResumesVisible = false" type="primary">关闭</el-button>
    </template>
  </Dialog>
</template>
<script setup>
import { CertificationApi } from '@/api/member/certification'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import dayjs from 'dayjs'

defineOptions({ name: 'CertificationForm' })

const message = useMessage()

const dialogVisible = ref(false)
const dialogResumesVisible = ref(false) // 履历弹窗的是否展示
const formLoading = ref(false)
const formData = ref({
  id: 0,
  workExperience: 0,
  score: 0,
  designerGradeType: 0,
  designerStyleType: 0,
  applyTime: '',
  lng: 0,
  lat: 0,
  address: '',
  profile: '',
  certificates: [],
  cardNo: '',
  cardName: '',
  cardImgFront: '',
  cardImgBack: '',
  cardAddr: '',
  cardOrgan: '',
  cardStartdate: '',
  cardValidate: '',
  resumes: [],
  certStatus: 1,
  rejectReason: ''
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (id) => {
  dialogVisible.value = true
  formLoading.value = true
  let data = await CertificationApi.getCertification(id)
  formData.value = {
    ...data,
    certificates: data.certificates?.split(',') || [],
    designerStyleType: data.designerStyleType?.split(',').map((item) => Number(item)) || [],
    certStatus: 1,
    rejectReason: ''
  }
  formLoading.value = false
}

/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    await CertificationApi.checkCertification({
      id: formData.value.id,
      certStatus: formData.value.certStatus,
      rejectReason: formData.value.rejectReason
    })
    message.success('审核成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
