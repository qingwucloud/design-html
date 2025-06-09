<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <!-- 左上角：基本信息 -->
      <el-col :span="24" class="detail-info-item">
        <el-row :gutter="10">
          <el-col :span="10">
            <UserBasicInfo :user="user">
              <template #header>
                <div class="card-header">
                  <CardTitle title="基本信息" />
                  <el-button size="small" text type="primary" @click="openForm('update')">
                    编辑
                  </el-button>
                </div>
              </template>
            </UserBasicInfo>
          </el-col>
          <el-col :span="9">
            <el-card class="h-full" shadow="never">
              <template #header>
                <CardTitle title="身份证信息" />
              </template>
              <UserAccountInfo :user="user" />
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="h-full" shadow="never">
              <template #header>
                <CardTitle title="账户余额" />
              </template>
              <UserWallet :user="user" />
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <!-- 下边：账户明细 -->
      <el-card header="账户明细" shadow="never" style="width: 100%; margin-top: 20px">
        <template #header>
          <CardTitle title="账户明细" />
        </template>
        <el-tabs>
          <el-tab-pane label="订单管理">
            <UserOrderList :user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="预约设计师" lazy>
            <UserAppointment :user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="合同" lazy>
            <UserContract :user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="合同付款" lazy>
            <PaymentRecord :user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="售后管理" lazy>
            <UserAfterSaleList :user-id="id" />
          </el-tab-pane>
          <el-tab-pane label="团队" lazy>
            <UserBrokerageList :bind-user-id="id" />
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
<script lang="ts" setup>
import * as UserApi from '@/api/member/user'
import { useTagsViewStore } from '@/store/modules/tagsView'
import UserForm from '@/views/member/user/UserForm.vue'
import UserBasicInfo from './UserBasicInfo.vue'
import UserBrokerageList from './UserBrokerageList.vue'
import UserOrderList from './UserOrderList.vue'
import UserAfterSaleList from './UserAftersaleList.vue'
import UserAppointment from './UserAppointment.vue'
import UserContract from './UserContract.vue'
import PaymentRecord from './PaymentRecord.vue'
import { CardTitle } from '@/components/Card/index'
import { ElMessage } from 'element-plus'
import UserAccountInfo from './UserAccountInfo.vue'
import UserWallet from '@/views/member/certification/detail/UserWallet.vue'
defineOptions({ name: 'MemberDetail' })

const loading = ref(true) // 加载中
const user = ref<UserApi.UserVO>({} as UserApi.UserVO)

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string) => {
  formRef.value.open(type, id)
}

/** 获得用户 */
const getUserData = async (id: any) => {
  loading.value = true
  try {
    user.value = await UserApi.getUser(id)
  } finally {
    loading.value = false
  }
}

/** 初始化 */
const { currentRoute } = useRouter() // 路由
const { delView } = useTagsViewStore() // 视图操作
const route = useRoute()
const id = Number(route.params.id)

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
