<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="小区名称" prop="communityName">
        <el-input
          v-model="queryParams.communityName"
          placeholder="请输入小区名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="作品标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入作品标题"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择审核状态"
          clearable
          class="!w-240px"
        >
          <el-option label="未审核" value="0" />
          <el-option label="已审核" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="户型" prop="portfolioHouseType">
        <el-select
          v-model="queryParams.portfolioHouseType"
          placeholder="请选择户型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PORTFOLIO_HOUSE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="作品标签" prop="portfolioTagType">
        <el-select
          v-model="queryParams.portfolioTagType"
          placeholder="请选择作品标签"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PORTFOLIO_TAG_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="作品风格" prop="designerStyleType">
        <el-select
          v-model="queryParams.designerStyleType"
          placeholder="请选择作品风格"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.DESIGNER_STYLE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="checker">
        <el-input
          v-model="queryParams.checker"
          placeholder="请输入审核人"
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['member:portfolio:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" fixed />
      <el-table-column label="作品标题" align="center" prop="title" fixed/>
      <el-table-column label="用户手机号" align="center" prop="userId" />
      <el-table-column label="小区名称" align="center" prop="communityName" fixed/>
      <el-table-column label="总造价金额" align="center" prop="totalMoney" width="120" fixed/>
      <el-table-column label="审核状态 " align="center" prop="status" fixed />
      <el-table-column label="主图" align="center" prop="coverUrl" width="120">
        <template #default="scope">
          <el-image
            :src="scope.row.coverUrl"
            style="width: 80px; height: 60px"
            fit="cover"
            :preview-src-list="[scope.row.coverUrl]"
          />
        </template>
      </el-table-column>
      <el-table-column label="户型字典" align="center" prop="portfolioHouseType" />
      <el-table-column label="面积(㎡)" align="center" prop="area" />
      <el-table-column label="作品标签" align="center" prop="portfolioTagType" />
      <el-table-column label="作品风格" align="center" prop="designerStyleType" />
      <el-table-column label="内容" align="center" prop="content" />
      <el-table-column label="浏览量" align="center" prop="viewCount" />
      <el-table-column label="点赞量" align="center" prop="likeCount" />
      <el-table-column label="审核人" align="center" prop="checker" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['member:portfolio:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['member:portfolio:check']"
          >
            审核
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleSort(scope.row.id)"
            v-hasPermi="['member:portfolio:recommend']"
          >
            精选排序
          </el-button>
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

  <!-- 表单弹窗：添加/修改 -->
  <PortfolioForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { PortfolioApi, PortfolioVO } from '@/api/member/portfolio'
import PortfolioForm from './PortfolioForm.vue'
import { getIntDictOptions,DICT_TYPE } from "@/utils/dict";

/** 设计师作品集 列表 */
defineOptions({ name: 'Portfolio' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<PortfolioVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined,
  communityName: undefined,
  totalMoney: undefined,
  title: undefined,
  status: undefined,
  coverUrl: undefined,
  portfolioHouseType: undefined,
  area: undefined,
  privoce: undefined,
  city: undefined,
  region: undefined,
  address: undefined,
  portfolioTagType: undefined,
  designerStyleType: undefined,
  content: undefined,
  viewCount: undefined,
  likeCount: undefined,
  sortNum: undefined,
  checker: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PortfolioApi.getPortfolioPage(queryParams)
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

const handleSort = () => {

}
/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PortfolioApi.deletePortfolio(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
