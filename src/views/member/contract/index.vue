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
      <el-form-item label="合同编号" prop="contractNo">
        <el-input
          v-model="queryParams.contractNo"
          placeholder="请输入合同编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="合同名称" prop="contractName">
        <el-input
          v-model="queryParams.contractName"
          placeholder="请输入合同名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="设计师姓名" prop="designerName">
        <el-input
          v-model="queryParams.designerName"
          placeholder="请输入设计师姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="设计师手机号" prop="designerName">
        <el-input
          v-model="queryParams.designerMobile"
          placeholder="请输入设计师手机号"
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
      <el-form-item label="合同状态" prop="memberContractStatus">
        <el-select
          v-model="queryParams.memberContractStatus"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MEMBER_CONTRACT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="精选排序" prop="startSort">
        <el-select
          v-model="queryParams.startSort"
          placeholder="请选择精选排序"
          clearable
          class="!w-240px"
        >
          <el-option label="否" :value="0" />
          <el-option label="是" :value="1" />
        </el-select>
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
      <el-form-item label="审核时间" prop="checkTime">
        <el-date-picker
          v-model="queryParams.checkTime"
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
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" fixed />
      <el-table-column label="合同编号" align="center" prop="contractNo" width="170" fixed />
      <el-table-column label="合同名称" align="center" prop="contractName" width="170" fixed />
      <el-table-column label="客户姓名" align="center" prop="customerName" width="100" fixed />
      <el-table-column label="客户电话" align="center" prop="customerMobile" width="120" fixed />
      <el-table-column label="设计师姓名" align="center" prop="designerName" width="100" fixed />
      <el-table-column label="设计师电话" align="center" prop="designerMobile" width="120" fixed />
      <el-table-column
        label="合同状态"
        align="center"
        prop="memberContractStatus"
        width="100"
        fixed
      >
        <template #default="{ row }">
          <DictTag :type="DICT_TYPE.MEMBER_CONTRACT_STATUS" :value="row.memberContractStatus" />
        </template>
      </el-table-column>

      <el-table-column label="小区名称" align="center" prop="communityName" width="150" />
      <el-table-column label="工程地址" align="center" prop="projectAddress" width="150" />
      <el-table-column label="合同总金额" align="center" prop="totalAmount" width="100">
        <template #default="{ row }">
          <span>{{ row.totalAmount }} 元</span>
        </template>
      </el-table-column>
      <el-table-column label="已支付金额" align="center" prop="paidAmount" width="100">
        <template #default="{ row }">
          <span>{{ row.paidAmount }} 元</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="checkTime" />
      <el-table-column label="审核人" align="center" prop="checker" />
      <el-table-column label="驳回原因" align="center" prop="rejectReason" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="精选排序号" align="center" prop="startSort" width="100" />
      <el-table-column label="操作" align="center" min-width="150px" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="danger"
            v-if="scope.row.memberContractStatus === 0"
            @click="handleDetail('check', scope.row.id)"
            v-hasPermi="['member:contract:check']"
          >
            审核
          </el-button>
          <el-button
            link
            type="primary"
            v-if="scope.row.memberContractStatus !== 0"
            @click="handleDetail('detail', scope.row.id)"
            v-hasPermi="['member:contract:detail']"
          >
            详情
          </el-button>
          <el-button
            v-hasPermi="['member:contract:recommend']"
            link
            type="success"
            v-if="[1, 3].includes(scope.row.memberContractStatus)"
            @click="handleSort(scope.row)"
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

  <!-- 合同排序弹窗 -->
  <ContractSortDialog ref="sortDialogRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { ContractApi, ContractVO } from '@/api/member/contract'
import ContractSortDialog from './components/ContractSortDialog.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

/** 用户合同 列表 */
defineOptions({ name: 'Contract' })
const { push } = useRouter()
const loading = ref(true) // 列表的加载中
const list = ref<ContractVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  startSort: undefined,
  designerName: undefined,
  designerMobile: undefined,
  customerName: undefined,
  contractNo: undefined,
  contractName: undefined,
  customerMobile: undefined,
  communityName: undefined,
  createTime: [],
  checkTime: [],
  memberContractStatus: undefined
})
const queryFormRef = ref() // 搜索的表单
const sortDialogRef = ref() // 排序弹窗引用

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ContractApi.getContractPage(queryParams)
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

const handleDetail = (type: string, id?: number) => {
  push({ name: 'MemberContractDetail', params: { type, id } })
}

/** 精选排序操作 */
const handleSort = (row: ContractVO) => {
  sortDialogRef.value?.open(row)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
