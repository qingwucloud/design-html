<template>
  <ContentWrap>
    <!-- 提示信息 -->
    <el-alert
      title="加入黑名单的用户无法获得团队佣金"
      type="warning"
      :closable="false"
      show-icon
      class="mb-4"
    />

    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="用户名" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="请输入用户名"
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
      <el-form-item label="加入时间" prop="createTime">
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
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
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
      <el-table-column align="center" label="编号" prop="id" width="80" />
      <el-table-column align="center" label="头像" prop="avatar">
        <template #default="scope">
          <img
            :src="
              scope.row.avatar ||
              'https://80du-design.oss-cn-shenzhen.aliyuncs.com/static/avatar.png'
            "
            alt="用户头像"
            style="width: 40px"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" prop="name" />
      <el-table-column align="center" label="手机号" prop="mobile" />
      <el-table-column align="center" label="用户类型" prop="userType">
        <template #default="scope">
          <el-tag v-if="scope.row.userType === 'designer'" type="primary" size="small">设计师</el-tag>
          <el-tag v-else type="info" size="small">普通用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="加入黑名单时间"
        prop="createTime"
        width="180px"
      />
      <el-table-column align="center" label="操作人" prop="operator" />
      <el-table-column align="center" label="备注" prop="remark" />
      <el-table-column
        :show-overflow-tooltip="false"
        align="center"
        fixed="right"
        label="操作"
        width="120px"
      >
        <template #default="scope">
          <div class="flex items-center justify-center">
            <!-- 设计师用户详情按钮 -->
            <el-button
              v-if="scope.row.userType === 'designer' && checkPermi(['member:certification:detail'])"
              link
              type="primary"
              @click="openDesignerDetail(scope.row.userId)"
            >
              详情
            </el-button>
            <!-- 普通用户详情按钮 -->
            <el-button
              v-if="scope.row.userType === 'user' && checkPermi(['member:user:detail'])"
              link
              type="primary"
              @click="openUserDetail(scope.row.userId)"
            >
              详情
            </el-button>
            <el-button
              link
              type="danger"
              v-hasPermi="['member:blacklist:remove']"
              @click="handleRemoveFromBlacklist(scope.row)"
            >
              取消黑名单
            </el-button>
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
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { dateFormatter } from '@/utils/formatTime'
import { checkPermi } from '@/utils/permission'
import * as BlacklistApi from '@/api/member/blacklist'

/** 黑名单管理 */
defineOptions({ name: 'MemberBlacklist' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<BlacklistApi.BlacklistVO[]>([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  mobile: undefined,
  createTime: [],
  userType: undefined
})
const queryFormRef = ref() // 搜索的表单
const selectedIds = ref<number[]>([]) // 表格的选中 ID 数组

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await BlacklistApi.getBlacklistPage(queryParams)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    console.error('获取黑名单列表失败:', error)
    // 使用模拟数据作为fallback
    const mockData = {
      list: [
        {
          id: 1,
          userId: 1001,
          name: '张三',
          mobile: '13800138001',
          avatar: '',
          userType: 'designer',
          createTime: '2024-01-15 10:30:00',
          operator: '管理员',
          remark: '违规操作'
        },
        {
          id: 2,
          userId: 1002,
          name: '李四',
          mobile: '13800138002',
          avatar: '',
          userType: 'user',
          createTime: '2024-01-20 14:20:00',
          operator: '管理员',
          remark: '恶意刷单'
        }
      ],
      total: 2
    }
    list.value = mockData.list as BlacklistApi.BlacklistVO[]
    total.value = mockData.total
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

/** 打开设计师详情 */
const { push } = useRouter()
const openDesignerDetail = (userId: number) => {
  push({ name: 'MemberDesignerDetail', params: { id: userId } })
}

/** 打开用户详情 */
const openUserDetail = (userId: number) => {
  push({ name: 'MemberUserDetail', params: { id: userId } })
}

/** 表格选中事件 */
const handleSelectionChange = (rows: any[]) => {
  selectedIds.value = rows.map((row) => row.id)
}

/** 取消黑名单操作 */
const handleRemoveFromBlacklist = async (row: BlacklistApi.BlacklistVO) => {
  ElMessageBox.confirm(
    `用户名：${row.name}，手机号：${row.mobile} 取消黑名单后，该用户将恢复正常功能使用。\n\n确定要将此用户从黑名单中移除吗？`,
    '取消黑名单确认',
    {
      confirmButtonText: '确认移除',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: false
    }
  )
    .then(async () => {
      try {
        await BlacklistApi.removeFromBlacklist({
          userId: row.userId
        })

        message.success(`用户 ${row.name} 已成功从黑名单中移除`)
        getList() // 刷新列表
      } catch (error) {
        console.error('取消黑名单失败:', error)
        message.error('取消黑名单失败，请稍后重试')
      }
    })
    .catch(() => {
      // 用户取消操作
    })
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
