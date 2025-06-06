<template>


  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="用户昵称" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          class="!w-240px"
          clearable
          placeholder="请输入用户昵称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          class="!w-240px"
          clearable
          placeholder="请输入手机号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="注册时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="登录时间" prop="loginDate">
        <el-date-picker
          v-model="queryParams.loginDate"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
<!--      <el-form-item label="用户标签" prop="tagIds">-->
<!--        <MemberTagSelect v-model="queryParams.tagIds" class="w-240!"/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="用户等级" prop="levelId">-->
<!--        <MemberLevelSelect v-model="queryParams.levelId" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="用户分组" prop="groupId">-->
<!--        <MemberGroupSelect v-model="queryParams.groupId" class="w-240!" />-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
<!--        <el-button v-hasPermi="['promotion:coupon:send']" @click="openCoupon">发送优惠券</el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      :stripe="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="编号" prop="id" />
      <el-table-column align="center" label="头像" prop="avatar" >
        <template #default="scope">
          <img :src="scope.row.avatar" style="width: 40px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" prop="mobile"  />
      <el-table-column align="center" label="昵称" prop="nickname" />
<!--      <el-table-column align="center" label="等级" prop="levelName" width="100px" />-->
<!--      <el-table-column align="center" label="分组" prop="groupName" width="100px" />-->
<!--      <el-table-column-->
<!--        :show-overflow-tooltip="false"-->
<!--        align="center"-->
<!--        label="用户标签"-->
<!--        prop="tagNames"-->
<!--      >-->
<!--        <template #default="scope">-->
<!--          <el-tag v-for="(tagName, index) in scope.row.tagNames" :key="index" class="mr-5px">-->
<!--            {{ tagName }}-->
<!--          </el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column align="center" label="积分" prop="point"  />-->
      <el-table-column align="center" label="状态" prop="status" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="登录时间"
        prop="loginDate"
        width="180px"
      />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="注册时间"
        prop="createTime"
        width="180px"
      />
      <el-table-column
        :show-overflow-tooltip="false"
        align="center"
        fixed="right"
        label="操作"
        width="100px"
      >
        <template #default="scope">
          <div class="flex items-center justify-center">
            <el-button link type="primary" @click="openDetail(scope.row.id)">详情</el-button>
            <el-button link type="warning" v-hasPermi="['member:user:update']" @click="handleCommand('handleUpdate',scope.row)">编辑</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <UserForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as UserApi from '@/api/member/user'
import { DICT_TYPE } from '@/utils/dict'
import UserForm from './UserForm.vue'

defineOptions({ name: 'MemberUser' })

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  nickname: null,
  mobile: null,
  loginDate: [],
  createTime: [],
  tagIds: [],
  levelId: null,
  groupId: null
})
const queryFormRef = ref() // 搜索的表单
const selectedIds = ref<number[]>([]) // 表格的选中 ID 数组

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await UserApi.getUserPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 打开会员详情 */
const { push } = useRouter()
const openDetail = (id: number) => {
  push({ name: 'MemberUserDetail', params: { id } })
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 表格选中事件 */
const handleSelectionChange = (rows: UserApi.UserVO[]) => {
  selectedIds.value = rows.map((row) => row.id)
}


/** 操作分发 */
const handleCommand = (command: string, row: UserApi.UserVO) => {
  switch (command) {
    case 'handleUpdate':
      openForm('update', row.id)
      break
    default:
      break
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
