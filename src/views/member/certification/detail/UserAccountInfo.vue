<template>
  <el-descriptions :column="column">
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label label=" 身份证姓名" />
      </template>
      {{ designerInfo.cardName }}
    </el-descriptions-item>
    <el-descriptions-item span="2">
      <template #label>
        <descriptions-item-label label=" 身份证号码 " />
      </template>
      {{ designerInfo.cardNo }}
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <descriptions-item-label label=" 身份证国徽面 " />
      </template>
      <el-image
        disabled
        class="w-70px h-70px mr-10px"
        :src="designerInfo.cardImgFront"
        :preview-src-list="[designerInfo.cardImgFront]"
        show-progress
        fit="cover"
      />
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label label=" 身份证人像面 " />
      </template>
      <el-image
        disabled
        class="w-70px h-70px mr-10px"
        :src="designerInfo.cardImgBack"
        :preview-src-list="[designerInfo.cardImgBack]"
        show-progress
        fit="cover"
      />
    </el-descriptions-item>
    <el-descriptions-item span="3">
      <template #label>
        <descriptions-item-label label=" 身份证地址 " />
      </template>
      {{ designerInfo.cardAddr }}
    </el-descriptions-item>
    <el-descriptions-item span="3">
      <template #label>
        <descriptions-item-label label=" 身份证签发机关 " />
      </template>
      {{ designerInfo.cardOrgan }}
    </el-descriptions-item>
    <el-descriptions-item span="3">
      <template #label>
        <descriptions-item-label label=" 身份证有效期 " />
      </template>
      {{ designerInfo.cardStartdate }} -
      {{ designerInfo.cardValidate || '至今' }}
    </el-descriptions-item>
  </el-descriptions>
</template>
<script lang="ts" setup>
import { DescriptionsItemLabel } from '@/components/Descriptions'
import * as UserApi from '@/api/member/user'

withDefaults(defineProps<{ user: UserApi.UserVO; designerInfo: any; column?: number }>(), {
  column: 2
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
