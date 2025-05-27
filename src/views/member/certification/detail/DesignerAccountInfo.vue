<template>
  <el-descriptions :column="column">
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label icon="svg-icon:member_level" label=" 工作经验" />
      </template>
      {{ designerInfo.workExperience }} 年
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label icon="svg-icon:member_level" label=" 设计师等级 " />
      </template>
      <DictTag :type="DICT_TYPE.DESIGNER_GRADE_TYPE" :value="designerInfo.designerGradeType" />
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label icon="svg-icon:member_level" label=" 擅长风格" />
      </template>
      <DictTag :type="DICT_TYPE.DESIGNER_STYLE_TYPE" :value="designerInfo.designerStyleType" />
    </el-descriptions-item>
    <el-descriptions-item span="3">
      <template #label>
        <descriptions-item-label icon="svg-icon:member_level" label=" 联系地址 " />
      </template>
      {{ designerInfo.address }}
    </el-descriptions-item>

    <el-descriptions-item span="3">
      <template #label>
        <descriptions-item-label icon="svg-icon:member_level" label=" 个人简介" />
      </template>
      {{ designerInfo.profile }}
    </el-descriptions-item>
    <el-descriptions-item span="2">
      <template #label>
        <descriptions-item-label icon="svg-icon:member_level" label=" 证书 " />
      </template>
      <div class="inline-block">
        <el-image
          :key="item"
          disabled
          v-for="item in designerInfo.certificates"
          class="w-60px h-70px mr-10px"
          :src="item"
          :preview-src-list="designerInfo.certificates"
          show-progress
          fit="cover"
        />
      </div>
    </el-descriptions-item>
    <el-descriptions-item span="3">
      <template #label>
        <descriptions-item-label icon="svg-icon:member_level" label=" 工作履历" />
      </template>
      <el-button type="primary" text @click="dialogResumesVisible = true">查看履历</el-button>
    </el-descriptions-item>
  </el-descriptions>
  <Dialog title="履历" v-model="dialogResumesVisible" width="1080px">
    <el-form disabled ref="formRef" :model="designerInfo.resumes" label-width="120px">
      <div v-for="resume in designerInfo.resumes" :key="resume.id" class="mb-20px">
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
<script lang="ts" setup>
import { DescriptionsItemLabel } from '@/components/Descriptions'
import { DICT_TYPE } from '@/utils/dict'
import dayjs from 'dayjs'
import { ref } from 'vue'

const dialogResumesVisible = ref(false)

withDefaults(defineProps<{ designerInfo: any; column?: number }>(), {
  column: 1
})
</script>
<style lang="scss" scoped>
.cell-item {
  display: inline;
}

.cell-item::after {
  content: ':';
}

:deep(.el-descriptions__label) {
  vertical-align: top;
}
</style>
