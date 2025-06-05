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
          <el-col class="mt-20px">
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
        <el-card class="h-full mb-10" shadow="never">
          <template #header>
            <CardTitle title="设计师信息" />
          </template>
          <DesignerAccountInfo :designerInfo="designerInfo" class="detail-info-item">
            <template #header>
              <div class="card-header">
                <CardTitle title="设计信息" />
              </div>
            </template>
          </DesignerAccountInfo>
        </el-card>
      </el-col>
      <!-- 下边：账户明细 -->
      <!-- TODO 芋艿：【订单管理】【售后管理】【收藏记录】-->
      <el-card header="账户明细" shadow="never" style="width: 100%; margin-top: 20px">
        <template #header>
          <CardTitle title="账户明细" />
        </template>
        <el-tabs>
          <!--          <el-tab-pane label="订单管理">-->
          <!--            <UserOrderList :user-id="id" />-->
          <!--          </el-tab-pane>-->
          <!--          <el-tab-pane label="余额" lazy>-->
          <!--            <UserBalanceList :wallet-id="wallet.id" />-->
          <!--          </el-tab-pane>-->
          <!--          <el-tab-pane label="售后管理" lazy>-->
          <!--            <UserAfterSaleList :user-id="id" />-->
          <!--          </el-tab-pane>-->
          <!--          <el-tab-pane label="推广用户" lazy>-->
          <!--            <UserBrokerageList :bind-user-id="id" />-->
          <!--          </el-tab-pane>-->
          <el-tab-pane label="团队" lazy />
          <el-tab-pane label="合同" lazy />
          <el-tab-pane label="预约" lazy />
          <el-tab-pane label="结算记录" lazy />
          <el-tab-pane label="作品集" lazy>
            <DesignList :bind-user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="评论" lazy>
            <UserCommentList :bind-user-id="id" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-row>
  </div>

  <!-- 表单弹窗：添加/修改 -->
  <UserForm ref="formRef" @success="getUserData(id)" />
</template>
<script setup>
import * as WalletApi from '@/api/pay/wallet/balance'
import * as UserApi from '@/api/member/user'
import { useTagsViewStore } from '@/store/modules/tagsView'
import UserForm from '@/views/member/user/UserForm.vue'
import UserAccountInfo from './UserAccountInfo.vue'
import UserBasicInfo from './UserBasicInfo.vue'
import UserBrokerageList from './UserBrokerageList.vue'
import UserOrderList from './UserOrderList.vue'
import UserAfterSaleList from './UserAftersaleList.vue'
import UserBalanceList from './UserBalanceList.vue'
import { CardTitle } from '@/components/Card/index'
import { ElMessage } from 'element-plus'
import { CertificationApi } from '@/api/member/certification'
import DesignerAccountInfo from '@/views/member/certification/detail/DesignerAccountInfo.vue'
import UserCommentList from '../comment/index.vue'
import DesignList from './DesignList.vue'
defineOptions({ name: 'MemberDetail' })

const loading = ref(true) // 加载中
const user = ref({})

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type) => {
  formRef.value.open(type, id)
}
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
/* 用户钱包相关信息 */
const WALLET_INIT_DATA = {
  balance: 0,
  totalExpense: 0,
  totalRecharge: 0
} // 钱包初始化数据
const wallet = ref(WALLET_INIT_DATA) // 钱包信息

/** 查询用户钱包信息 */
const getUserWallet = async () => {}

onMounted(() => {
  if (!id) {
    ElMessage.warning('参数错误，会员编号不能为空！')
    delView(unref(currentRoute))
    return
  }
  getUserData(id)
  getUserWallet()
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
