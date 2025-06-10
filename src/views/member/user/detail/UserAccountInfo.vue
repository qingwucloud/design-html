<template>
  <el-descriptions :column="2">
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label label=" 身份证姓名" />
      </template>
      {{ realInfo.cardName || '未认证' }}
    </el-descriptions-item>
    <el-descriptions-item :span="2">
      <template #label>
        <descriptions-item-label label=" 身份证号码 " />
      </template>
      {{ realInfo.cardNo || '-' }}
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <descriptions-item-label label=" 身份证国徽面 " />
      </template>
      <el-image
        v-if="realInfo.cardImgFront"
        disabled
        class="w-70px h-70px mr-10px"
        :src="realInfo.cardImgFront"
        :preview-src-list="[realInfo.cardImgFront]"
        show-progress
        fit="cover"
      />
      <span v-else>-</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <descriptions-item-label label=" 身份证人像面 " />
      </template>
      <el-image
        disabled
        v-if="realInfo.cardImgBack"
        class="w-70px h-70px mr-10px"
        :src="realInfo.cardImgBack"
        :preview-src-list="[realInfo.cardImgBack]"
        show-progress
        fit="cover"
      />
      <span v-else>-</span>
    </el-descriptions-item>
    <el-descriptions-item :span="2">
      <template #label>
        <descriptions-item-label label=" 身份证地址 " />
      </template>
      {{ realInfo.cardAddr || '-' }}
    </el-descriptions-item>
    <el-descriptions-item :span="2">
      <template #label>
        <descriptions-item-label label=" 身份证签发机关 " />
      </template>
      {{ realInfo.cardOrgan || '-' }}
    </el-descriptions-item>
    <el-descriptions-item :span="2">
      <template #label>
        <descriptions-item-label label=" 身份证有效期 " />
      </template>
      {{ realInfo.cardStartdate }} - {{ realInfo.cardValidate }}
    </el-descriptions-item>
  </el-descriptions>
</template>
<script lang="ts" setup>
import { DescriptionsItemLabel } from '@/components/Descriptions'
import * as UserApi from '@/api/member/user'

const route = useRoute()
const realInfo = ref({
  isCertification: 0,
  cardNo: '',
  cardName: '',
  cardImgFront: '',
  cardImgBack: '',
  cardAddr: '',
  cardOrgan: '',
  cardStartdate: '',
  cardValidate: ''
})

onMounted(async () => {
  let { data } = await UserApi.getRealInfo(route.params.id as string)
  realInfo.value = {
    ...realInfo.value,
    ...data
  }
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
