<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="110px"
    >
      <!-- <el-form-item label="客户手机号" prop="userMobile">
        <el-input
          v-model="queryParams.userMobile"
          placeholder="请输入客户手机号"
          clearable
          type="number"
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="设计师名称" prop="designerName">
        <el-input
          v-model="queryParams.designerName"
          placeholder="请输入设计师名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="指派设计师名称" prop="assignedDesignerName">
        <el-input
          v-model="queryParams.assignedDesignerName"
          placeholder="请输入指派设计师名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="预约状态" prop="designerAppointmentStatus">
        <el-select
          v-model="queryParams.designerAppointmentStatus"
          placeholder="请选择预约状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.DESIGNER_APPOINTMENT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="指派时间" prop="checkTime">
        <el-date-picker
          v-model="queryParams.checkTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
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
      <el-table-column label="编号" align="center" prop="id" />
      <!-- <el-table-column label="客户名" align="center" prop="userName" width="120" />
      <el-table-column label="客户手机号" align="center" prop="userMobile" width="120" /> -->
      <el-table-column label="预约设计师" align="center" prop="designerName" width="120" />
      <el-table-column label="预约设计师电话" align="center" prop="designerMobile" width="150" />
      <el-table-column label="指派设计师" align="center" prop="assignedDesignerName" width="120" />
      <el-table-column
        label="指派设计师电话"
        align="center"
        prop="assignedDesignerMobile"
        width="150"
      />
      <el-table-column label="预约状态" align="center" prop="designerAppointmentStatus" width="120">
        <template #default="{ row }">
          <DictTag
            :type="DICT_TYPE.DESIGNER_APPOINTMENT_STATUS"
            :value="row.designerAppointmentStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="memberRemark" />
      <el-table-column label="审核人" align="center" prop="checker" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="指派时间"
        align="center"
        prop="checkTime"
        :formatter="dateFormatter"
        width="180px"
      />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { getUserAppointmentList } from "@/api/member/view/user";

/** 客户预约设计师 列表 */
defineOptions({ name: 'UserInfoAppointment' })
const loading = ref(true) // 列表的加载中
const list = ref<DesignerAppointmentVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  userMobile: undefined,
  designerName: undefined,
  pageSize: 10,
  designerId: undefined,
  assignedDesignerName: undefined,
  designerAppointmentStatus: undefined,
  portfolioId: undefined,
  memberRemark: undefined,
  checker: undefined,
  createTime: [],
  checkTime: []
})
const queryFormRef = ref() // 搜索的表单
const route = useRoute()
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getUserAppointmentList({
      ...queryParams,
      customerId:route.params.id
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (data) => {
  formRef.value.open(data)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
