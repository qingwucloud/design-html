<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="88px"
    >
      <el-form-item label="用户名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="设计师等级" prop="designerGradeType">
        <el-select
          v-model="queryParams.designerGradeType"
          placeholder="请选择设计师等级"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.DESIGNER_GRADE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="擅长风格" prop="designerStyleType">
        <el-select
          v-model="queryParams.designerStyleType"
          placeholder="请选择擅长风格"
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
      <el-form-item label="申请时间" prop="applyTime">
        <el-date-picker
          v-model="queryParams.applyTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="认证状态" prop="certStatus">
        <el-select
          v-model="queryParams.certStatus"
          placeholder="请选择认证状态"
          clearable
          class="!w-240px"
        >
          <el-option label="已通过" value="1" />
          <el-option label="已拒绝" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="接单状态" prop="orderStatus">
        <el-select
          v-model="queryParams.orderStatus"
          placeholder="请选择接单状态"
          clearable
          class="!w-240px"
        >
          <el-option label="关闭" value="0" />
          <el-option label="开启" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="精选排序号" prop="startSort">
        <el-select
          v-model="queryParams.startSort"
          placeholder="请选择精选排序号"
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
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="用户名" align="center" prop="name" />
      <el-table-column label="工作经验" align="center" prop="workExperience">
        <template #default="scope">
          <span>{{ scope.row.workExperience }} 年</span>
        </template>
      </el-table-column>
      <el-table-column label="设计师等级" align="center" prop="designerGradeTypeDesc" />
      <el-table-column label="评分" align="center" prop="score" />
      <el-table-column label="擅长风格" align="center" prop="designerStyleTypeDesc" />
      <el-table-column
        label="申请时间"
        align="center"
        prop="applyTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="认证状态" align="center" prop="certStatus">
        <template #default="scope">
          <el-tag v-if="scope.row.certStatus === 1" type="primary" size="small">已通过</el-tag>
          <el-tag v-else-if="scope.row.certStatus === 2" type="danger" size="small">已拒绝</el-tag>
          <el-tag v-else type="warning" size="small">待审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="接单状态" align="center" prop="orderStatus">
        <template #default="scope">
          <el-tag v-if="scope.row.orderStatus === 1" type="success" size="small">开启</el-tag>
          <el-tag v-else type="danger" size="small">关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="审核时间"
        align="center"
        prop="checkTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="驳回原因" align="center" prop="rejectReason" />
      <el-table-column label="精选排序号" align="center" prop="startSort" />
      <el-table-column label="审核人" align="center" prop="checker" />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="openForm(scope.row.userId)"
            v-if="scope.row.certStatus !== 1"
            v-hasPermi="['member:certification:check']"
          >
            审核
          </el-button>
          <el-button
            @click="openDetail(scope.row.userId)"
            link
            type="primary"
            v-hasPermi="['member:certification:detail']"
          >
            详情
          </el-button>
          <el-button
            v-hasPermi="['member:certification:recommend']"
            link
            type="success"
            v-if="scope.row.certStatus === 1"
            @click="sortOfActions(scope.row)"
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
  <CertificationForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { dateFormatter } from '@/utils/formatTime'
import { CertificationApi, CertificationVO } from '@/api/member/certification'
import CertificationForm from './CertificationForm.vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

/** 设计师认证 列表 */
defineOptions({ name: 'Certification' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const list = ref<CertificationVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  startSort: undefined,
  name: undefined,
  workExperience: undefined,
  designerGradeType: undefined,
  score: undefined,
  designerStyleType: undefined,
  applyTime: [],
  certStatus: undefined,
  orderStatus: undefined,
  profile: undefined,
  certificates: undefined,
  checker: undefined,
  checkTime: [],
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CertificationApi.getCertificationPage(queryParams)
    list.value = data.list.map((item) => {
      return {
        ...item,
        certificates: item.certificates ? item.certificates.split(',') : []
      }
    })
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
const openForm = (id?: number) => {
  formRef.value.open(id)
}
const { push } = useRouter()
const openDetail = (id: number) => {
  push({ name: 'MemberDesignerDetail', params: { id } })
}
/** 排序按钮操作 */
const sortOfActions = async (row) => {
  ElMessageBox.prompt('排序值最大的8个会显示在小程序首页', '请输入排序值', {
    inputPattern: /^[1-9]\d*$/,
    inputType: 'number',
    inputValue: row.startSort,
    inputErrorMessage: '请输入排序值'
  })
    .then(async ({ value }) => {
      await CertificationApi.recommendCertification({
        startSort: value,
        id: row.id
      })
      message.success('排序成功')
      resetQuery()
    })
    .catch(() => {})
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
