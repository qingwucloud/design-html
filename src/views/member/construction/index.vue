<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="合同名称" prop="contractName">
        <el-input
          v-model="queryParams.contractName"
          placeholder="请输入合同名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="客户姓名" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="客户手机号" prop="customerMobile">
        <el-input
          v-model="queryParams.customerMobile"
          placeholder="请输入客户手机号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="返佣客户姓名" prop="agentName">
        <el-input
          v-model="queryParams.agentName"
          placeholder="请输入返佣客户姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="返佣客户手机号" prop="agentMobile">
        <el-input
          v-model="queryParams.agentMobile"
          placeholder="请输入返佣客户手机号"
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
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
        <el-button
          @click="handleDetail('create')"
          type="primary"
          plain
          v-hasPermi="['member:contract-construction:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" width="80" />
      <el-table-column label="合同名称" align="center" prop="contractName" min-width="100" />
      <el-table-column label="客户姓名" align="center" prop="customerName" width="120" />
      <el-table-column label="客户手机号" align="center" prop="customerMobile" width="130" />
      <el-table-column label="返佣客户" align="center" width="120">
        <template #default="{ row }">
          <span>{{ row.agentName || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返佣手机号" align="center" prop="agentMobile" />
      <el-table-column label="小区名称" align="center" prop="communityName" />
      <el-table-column label="建筑面积(㎡)" align="center" prop="builtArea">
        <template #default="{ row }">
          <span>{{ row.builtArea || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="合同金额(元)" align="center" prop="totalAmount" width="120">
        <template #default="{ row }">
          <span class="text-red-500 font-medium">{{ row.totalAmount || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返佣金额(元)" align="center" width="120">
        <template #default="{ row }">
          <span class="text-green-600 font-medium">
            {{ row.commissionAmount || '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        :formatter="dateFormatter"
        align="center"
        prop="createTime"
        width="180"
      />
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handleDetail('detail', scope.row)"
            v-hasPermi="['member:contract-construction:detail']"
          >
            详情
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

  <ConstructionForm ref="dialogRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { ContractApi, ContractVO } from '@/api/member/contract'
import ConstructionForm from './ConstructionForm.vue'

/** 用户合同 列表 */
defineOptions({ name: 'ConstructionContract' })

const loading = ref(true) // 列表的加载中
const list = ref<ContractVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  contractName: undefined,
  agentName: undefined,
  agentMobile: undefined,
  customerName: undefined,
  customerMobile: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const dialogRef = ref() // 排序弹窗引用

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ContractApi.getConstructionPage(queryParams)
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

/** 添加/修改操作 */
const handleDetail = (type: string, row?) => {
  dialogRef.value?.open(type, row)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
