<template>
  <div v-loading="loading">
    <el-card>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="info">
          <template #title>
            <CardTitle title="合同信息" />
          </template>
          <div class="contract-details">
            <el-descriptions :column="3" border>
              <!-- 基本信息 -->
              <el-descriptions-item label="合同编号">
                {{ contractData?.contractNo || '' }}
              </el-descriptions-item>
              <el-descriptions-item label="合同状态">
                <DictTag
                  :type="DICT_TYPE.MEMBER_CONTRACT_STATUS"
                  :value="contractData?.memberContractStatus"
                />
              </el-descriptions-item>
              <el-descriptions-item label="审核人">
                {{ contractData?.checker || '' }}
              </el-descriptions-item>
              <el-descriptions-item label="合同周期" :span="3">
                {{ formatDate(contractData?.startTime, 'YYYY-MM-DD') }} -
                {{ formatDate(contractData?.endTime, 'YYYY-MM-DD') }}
              </el-descriptions-item>

              <!-- 客户信息 -->
              <el-descriptions-item label="客户姓名">
                {{ contractData?.customerName || '' }}
              </el-descriptions-item>
              <el-descriptions-item label="客户手机号">
                {{ contractData?.customerMobile || '' }}
              </el-descriptions-item>
              <el-descriptions-item label="设计师名称">
                {{ contractData?.designerName || '' }}
              </el-descriptions-item>

              <!-- 项目信息 -->
              <el-descriptions-item label="工程地址" :span="3">
                {{ contractData?.projectAddress || '' }}
              </el-descriptions-item>
              <el-descriptions-item label="建筑面积">
                {{ contractData?.builtArea || '' }}㎡
              </el-descriptions-item>
              <el-descriptions-item label="实测外框面积">
                {{ contractData?.measuredArea || '' }}㎡
              </el-descriptions-item>

              <!-- 费用信息 -->
              <el-descriptions-item label="合同总金额">
                <span class="amount-text">¥{{ contractData?.totalAmount || 0 }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="已支付金额">
                <span class="amount-text paid">¥{{ contractData?.paidAmount || 0 }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="剩余金额">
                <span class="amount-text remaining">
                  ¥{{ (contractData?.totalAmount || 0) - (contractData?.paidAmount || 0) }}
                </span>
              </el-descriptions-item>

              <!-- 附加信息 -->
              <el-descriptions-item label="补充说明" :span="3">
                {{ contractData?.footnote || '无' }}
              </el-descriptions-item>
              <el-descriptions-item label="合同附件" v-if="contractData?.attachmentUrl" :span="3">
                <div class="attachment-container">
                  <div class="flex gap-10px mb-3" v-if="imageAttachments.length > 0">
                    <el-image
                      :key="item"
                      v-for="item in imageAttachments"
                      class="w-70px h-70px"
                      :src="item"
                      :preview-src-list="imageAttachments"
                      show-progress
                      fit="cover"
                    />
                  </div>

                  <!-- PDF附件列表 -->
                  <div class="pdf-attachments" v-if="pdfAttachments.length > 0">
                    <div
                      v-for="(pdf, index) in pdfAttachments"
                      :key="index"
                      class="pdf-item"
                      @click="window.open(pdf)"
                    >
                      <el-icon><Document /></el-icon>
                      <div class="pdf-name">PDF文档{{ index + 1 }}</div>
                    </div>
                  </div>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-card>
      <CardTitle title="节点信息" />
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { CardTitle } from '@/components/Card'
import { AppNodeConfigRes, ContractApi } from "@/api/member/contract";
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'MemberDetail' })
const loading = ref(false) // 加载中
const activeNames = ref('info')
const route = useRoute()
const id = route.params.id
const contractData = ref()
const imageAttachments = ref([])
const pdfAttachments = ref([])
const contractNodeList=ref<AppNodeConfigRes[]>([])
onMounted(async () => {
  contractData.value = await ContractApi.getContract(route.params.id)
  parseAttachments(contractData.value.attachmentUrl)
  contractNodeList.value=await ContractApi.getContractNodeList(route.params.id)
})

// 解析附件URL
const parseAttachments = (url) => {
  if (!url) return

  // 清空之前的附件
  imageAttachments.value = []
  pdfAttachments.value = []

  // 分割多个附件URL（假设附件URL以逗号分隔）
  const urls = url.split(',').filter((item) => item.trim() !== '')

  // 按类型分类
  urls.forEach((item) => {
    const trimmedUrl = item.trim()
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(trimmedUrl)) {
      imageAttachments.value.push(trimmedUrl)
    } else if (/\.(pdf)$/i.test(trimmedUrl)) {
      pdfAttachments.value.push(trimmedUrl)
    }
  })
}
</script>
<style lang="css" scoped>
:deep(.el-collapse) {
  border-top: 0 !important;
}

:deep(.el-collapse-item__wrap) {
  border-bottom: 0 !important;
}

.contract-details {
  .attachment-container {
    .pdf-attachments {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;

      .pdf-item {
        display: flex;
        padding: 8px 12px;
        font-size: 14px;
        color: inherit;
        cursor: pointer;
        background: #f5f7fa;
        border-radius: 4px;
        transition: all 0.3s;
        align-items: center;
        gap: 8px;

        &:hover {
          color: #1890ff;
          background: #e6f7ff;
        }

        .pdf-name {
          font-size: 14px;
        }
      }
    }
  }

  .amount-text {
    font-size: 16px;
    font-weight: 600;

    &.paid {
      color: #67c23a;
    }

    &.remaining {
      color: #e6a23c;
    }
  }

  :deep(.el-collapse-item__header) {
    font-weight: 500;
    color: #409eff;
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 0;
  }

  :deep(.el-descriptions__body) {
    background-color: #fff;
  }

  :deep(.el-descriptions__label) {
    font-weight: 500;
    color: #606266;
    background-color: #fafafa;
  }
}
</style>
