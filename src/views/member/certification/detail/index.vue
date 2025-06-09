<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <!-- 左上角：基本信息 -->
      <el-col :span="14" class="detail-info-item">
        <el-row :gutter="10">
          <el-col>
            <UserBasicInfo :user="user">
              <template #header>
                <div class="card-header">
                  <CardTitle title="基本信息" />
                </div>
              </template>
            </UserBasicInfo>
          </el-col>
          <el-col class="mt-16px">
            <el-card class="h-full" shadow="never">
              <template #header>
                <CardTitle title="身份证信息" />
              </template>
              <UserAccountInfo :user="user" :designerInfo="designerInfo" />
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <!-- 右上角：账户信息 -->
      <el-col :span="10" class="detail-info-item">
        <el-row :gutter="10">
          <el-col>
            <el-card shadow="never">
              <template #header>
                <CardTitle title="设计师信息" />
              </template>
              <DesignerAccountInfo :user="user" :designer-info="designerInfo" />
            </el-card>
          </el-col>
          <el-col class="mt-20px">
            <el-card shadow="never">
              <template #header>
                <CardTitle title="账户余额" />
              </template>
              <UserWallet />
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-card header="账户明细" shadow="never" style="width: 100%; margin-top: 20px">
        <template #header>
          <CardTitle title="账户明细" />
        </template>
        <el-tabs>
          <el-tab-pane label="团队" lazy>
            <TeamList :bind-user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="合同" lazy>
            <ContractList :bind-user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="预约" lazy>
            <AppointmentList :bind-user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="结算记录" lazy>
            <SettlementList :bind-user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="作品集" lazy>
            <DesignList :bind-user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="评论" lazy>
            <UserCommentList :bind-user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="余额明细" lazy>
            <UserBrokerageList :bind-user-id="id" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-row>
  </div>

  <!-- 表单弹窗：添加/修改 -->
  <UserForm ref="formRef" @success="getUserData(id)" />
</template>
<script setup>
import * as UserApi from '@/api/member/user'
import { useTagsViewStore } from '@/store/modules/tagsView'
import UserForm from '@/views/member/user/UserForm.vue'
import UserAccountInfo from './UserAccountInfo.vue'
import UserBasicInfo from './UserBasicInfo.vue'
import { CardTitle } from '@/components/Card/index'
import { ElMessage } from 'element-plus'
import { CertificationApi } from '@/api/member/certification'
import DesignerAccountInfo from '@/views/member/certification/detail/DesignerAccountInfo.vue'
import UserCommentList from '../comment/index.vue'
import DesignList from './DesignList.vue'
import TeamList from './TeamList.vue'
import ContractList from './ContractList.vue'
import AppointmentList from './AppointmentList.vue'
import SettlementList from './SettlementList.vue'
import UserBrokerageList from '@/views/member/user/detail/UserBrokerageList.vue'
import UserWallet from '@/views/member/certification/detail/UserWallet.vue'
defineOptions({ name: 'MemberDetail' })

const loading = ref(true) // 加载中
const user = ref({})

/** 添加/修改操作 */
const formRef = ref()

const designerInfo = ref({})
/** 获得用户 */
const getUserData = async (id) => {
  loading.value = true
  try {
    user.value = await UserApi.getUser(id)
    let data = await CertificationApi.getCertification(id)
    designerInfo.value = {
      ...data,
      certificates: data?.certificates ? data?.certificates.split(',') : [],
      designerStyleType: data.designerStyleType
        ? data.designerStyleType?.split(',').map((item) => Number(item))
        : []
    }
  } finally {
    loading.value = false
  }
}

/** 初始化 */
const { currentRoute } = useRouter() // 路由
const { delView } = useTagsViewStore() // 视图操作
const route = useRoute()
const id = route.params.id

onMounted(() => {
  if (!id) {
    ElMessage.warning('参数错误，会员编号不能为空！')
    delView(unref(currentRoute))
    return
  }
  getUserData(id)
})
</script>
<style lang="css" scoped>
.detail-info-item:first-child {
  padding-left: 0 !important;
}

/* first-child 不生效有没有大佬给看下q.q */
.detail-info-item:nth-child(2) {
  padding-right: 0 !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
