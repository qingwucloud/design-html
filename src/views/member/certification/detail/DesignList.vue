<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="作品标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入作品标题"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" fixed />
      <el-table-column label="作品标题" align="center" prop="title" fixed width="150" />
      <el-table-column label="设计师名称" align="center" prop="name" fixed width="100" />
      <el-table-column label="小区名称" align="center" prop="communityName" fixed />
      <el-table-column label="审核状态 " align="center" prop="status" fixed>
        <template #default="{ row }">
          <el-tag v-if="row.status === 0" type="warning" size="small">待审核</el-tag>
          <el-tag v-else-if="row.status === 1" type="primary" size="small">已审核</el-tag>
          <el-tag v-else type="danger" size="small">已驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="主图" align="center" prop="coverUrl" width="120">
        <template #default="scope">
          <el-image
            :src="scope.row.coverUrl"
            style="width: 60px; height: 60px"
            fit="cover"
            :preview-src-list="[scope.row.coverUrl]"
          />
        </template>
      </el-table-column>
      <el-table-column label="户型" align="center" prop="portfolioHouseTypeDesc" />
      <el-table-column label="面积" align="center" prop="area">
        <template #default="scope">
          <span>{{ scope.row.area }} ㎡</span>
        </template>
      </el-table-column>
      <el-table-column label="作品标签" align="center" prop="portfolioTagTypeDesc" />
      <el-table-column label="作品风格" align="center" prop="designerStyleTypeDesc" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="审核人" align="center" prop="checker" />
      <el-table-column
        label="审核时间"
        align="center"
        prop="checkTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="驳回原因" align="center" prop="rejectReason" />
      <el-table-column label="精选排序号" align="center" prop="sortNum" width="100" />
      <el-table-column label="操作" align="center" fixed="right" :show-overflow-tooltip="false">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openCheckForm('detail', scope.row.id)"
            v-hasPermi="['member:portfolio:detail']"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：详情/审核 -->
  <CheckAndDetail ref="checkRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { PortfolioApi, PortfolioVO } from '@/api/member/portfolio'
import CheckAndDetail from '../../portfolio/CheckAndDetail.vue'

/** 设计师作品集 列表 */
defineOptions({ name: 'DesignList' })

const props = defineProps({
  bindUserId: {
    type: Number,
    default: undefined
  }
})
const loading = ref(true) // 列表的加载中
const list = ref<PortfolioVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  sortNum: undefined,
  name: undefined,
  communityName: undefined,
  title: undefined,
  status: undefined,
  portfolioHouseType: undefined,
  portfolioTagType: undefined,
  designerStyleType: undefined,
  checker: undefined,
  createTime: [],
  checkTime: []
})
const queryFormRef = ref() // 搜索的表单
const checkRef = ref() // 详情/审核的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PortfolioApi.getPortfolioPage({
      ...queryParams,
      userId: props.bindUserId || undefined
    })
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

const openCheckForm = (type: string, id?: number) => {
  checkRef.value.open(type, id)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
