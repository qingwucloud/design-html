<template>
  <div v-loading="loading">
    <!-- 用户信息卡片组 -->
    <el-row :gutter="20" class="info-row">
      <!-- 第一行卡片 -->
      <el-col :span="12" class="mb-20">
        <!-- 基本信息 -->
        <UserBasicInfo :user="user" class="h-full">
          <template #header>
            <div class="card-header">
              <CardTitle title="基本信息" />
            </div>
          </template>
        </UserBasicInfo>
      </el-col>
      <el-col :span="12" class="mb-20">
        <!-- 设计师信息 -->
        <el-card shadow="never" class="h-full">
          <template #header>
            <CardTitle title="设计师信息" />
          </template>
          <DesignerAccountInfo :user="user" :designer-info="designerInfo" />
        </el-card>
      </el-col>

      <!-- 第二行卡片 -->
      <el-col :span="12">
        <!-- 身份证信息 -->
        <el-card shadow="never" class="h-full">
          <template #header>
            <CardTitle title="身份证信息" />
          </template>
          <UserAccountInfo :user="user" :designerInfo="designerInfo" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <!-- 账户余额 -->
        <el-card shadow="never" class="h-full">
          <template #header>
            <CardTitle title="账户余额" />
          </template>
          <UserWallet />
        </el-card>
      </el-col>
    </el-row>
    <el-card header="数据视图" shadow="never" style="width: 100%; margin-top: 20px">
      <template #header>
        <CardTitle title="数据视图" />
      </template>
      <el-tabs>
        <el-tab-pane label="团队列表" lazy v-if="checkPermi(['member:designerView:inviteList'])">
          <TeamList />
        </el-tab-pane>
        <el-tab-pane label="合同列表" lazy v-if="checkPermi(['member:designerView:contractList'])">
          <ContractList />
        </el-tab-pane>
        <el-tab-pane label="预约" lazy v-if="checkPermi(['member:designerView:appointmentList'])">
          <AppointmentList />
        </el-tab-pane>
        <el-tab-pane label="作品集" lazy v-if="checkPermi(['member:designerView:portfolioList'])">
          <DesignList />
        </el-tab-pane>
        <el-tab-pane label="评论" lazy v-if="checkPermi(['member:designerView:commentList'])">
          <UserCommentList />
        </el-tab-pane>
        <el-tab-pane label="收入明细" lazy v-if="checkPermi(['member:designerView:incomeList'])">
          <SettlementList />
        </el-tab-pane>
        <el-tab-pane
          label="提现记录"
          lazy
          v-if="checkPermi(['member:designerView:withdrawalList'])"
        >
          <PayoutList />
        </el-tab-pane>
      </el-tabs>
    </el-card>
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
import UserCommentList from './Comment.vue'
import DesignList from './DesignList.vue'
import TeamList from './TeamList.vue'
import ContractList from './ContractList.vue'
import AppointmentList from './AppointmentList.vue'
import SettlementList from './SettlementList.vue'
import PayoutList from './PayoutList.vue'
import UserWallet from '@/views/member/certification/detail/UserWallet.vue'
import { checkPermi } from '@/utils/permission'
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
/* 卡片布局相关样式 */
.info-row {
  margin-bottom: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.h-full {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
