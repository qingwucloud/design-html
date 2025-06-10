<template>
  <el-card shadow="never" class="h-full">
    <template #header>
      <slot name="header"></slot>
    </template>
    <el-row v-if="mode === 'member'">
      <el-col :span="4">
        <div class="w-full px-4">
          <img
            class="w-full h-full rounded-full object-cover"
            :src="
              user.avatar || 'https://80du-design.oss-cn-shenzhen.aliyuncs.com/static/avatar.png'
            "
          />
        </div>
      </el-col>
      <el-col :span="20">
        <el-descriptions :column="2">
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label label="昵称" />
            </template>
            {{ user.nickname }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label label="用户名" />
            </template>
            {{ user.name || '空' }}
          </el-descriptions-item>
          <el-descriptions-item label="手机号">
            <template #label>
              <descriptions-item-label label="手机号" />
            </template>
            {{ user.mobile }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label label="性别" />
            </template>
            <dict-tag :type="DICT_TYPE.SYSTEM_USER_SEX" :value="user.sex" />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label label="所在地" />
            </template>
            {{ user.areaName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label label="注册 IP" />
            </template>
            {{ user.registerIp }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label label="生日" />
            </template>
            {{ user.birthday ? formatDate(user.birthday as any) : '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label label="注册时间" />
            </template>
            {{ user.createTime ? formatDate(user.createTime as any) : '空' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label label="最后登录时间" />
            </template>
            {{ user.loginDate ? formatDate(user.loginDate as any) : '空' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
  </el-card>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import * as UserApi from '@/api/member/user'
import { DescriptionsItemLabel } from '@/components/Descriptions/index'

withDefaults(defineProps<{ user: UserApi.UserVO; mode?: string }>(), {
  mode: 'member'
})
</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

::v-deep(.kefu-descriptions) {
  .el-descriptions__cell {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-descriptions__label {
      display: block;
      width: 120px;
      text-align: left;
    }

    .el-descriptions__content {
      flex: 1;
      text-align: end;
    }
  }
}
</style>
