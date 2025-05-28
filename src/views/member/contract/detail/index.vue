<template>
  <div v-loading="loading" class="flex gap-20px flex-col">
    <el-card>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="info">
          <template #title>
            <CardTitle title="合同信息（点击展开）" />
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
                      @click="openPdf(pdf)"
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

      <!-- 进度节点显示 -->
      <div class="progress-section">
        <!-- 节点列表 -->
        <div class="node-list">
          <div
            v-for="(node, index) in contractNodeList"
            :key="node.id"
            :class="[
              'node-item',
              {
                active: currentActiveNodeId === node.id,
                completed: node.isComplete === 1,
                current: isCurrentNode(node, index)
              }
            ]"
            @click="selectNode(node)"
          >
            <!-- 节点图标 -->
            <div
              class="node-icon"
              :class="{ completed: node.isComplete === 1, current: isCurrentNode(node, index) }"
            >
              <el-icon v-if="node.isComplete === 1" color="#fff" size="14">
                <Check />
              </el-icon>
              <span v-else class="node-number">{{ index + 1 }}</span>
            </div>

            <!-- 节点名称 -->
            <div class="node-content">
              <div class="node-name">{{ index + 1 }}. {{ node.nodeName }}</div>
              <div v-if="node.isComplete === 1" class="node-status completed">已完成</div>
              <div v-else-if="isCurrentNode(node, index)" class="node-status processing">
                进行中
              </div>
              <div v-else class="node-status pending">未开始</div>
            </div>
          </div>
        </div>

        <!-- 当前选中节点的详细信息 -->
        <div v-if="currentNode" class="node-detail">
          <h4 class="detail-title">{{ currentNode.nodeName }}</h4>
          <div class="detail-info">
            <div class="info-item">
              <span class="info-label">工作成果要求:</span>
              <span class="info-value">{{
                currentNode.deliverableRequirements || '暂无要求'
              }}</span>
            </div>
          </div>
        </div>

        <!-- 节点工作成果 -->
        <div class="work-results">
          <h4 class="results-title">节点成果</h4>
          <div v-if="currentFileList.length > 0" class="file-list">
            <div v-for="(item, index) in currentFileList" :key="index" class="file-item">
              <!-- 图片预览区域 -->
              <div v-if="isImageFile(item.fileUrl)" class="file-image-preview">
                <el-image
                  :src="item.fileUrl"
                  :preview-src-list="getImageUrls()"
                  class="work-image"
                  fit="cover"
                  :preview-teleported="true"
                />
              </div>

              <!-- 文件信息区域 -->
              <div class="file-info">
                <div class="file-name">{{ item.fileName || `成果文件${index + 1}` }}</div>
                <div class="file-meta">
                  <span
                    class="file-status"
                    :class="{
                      'status-pending': item.confirmStatus === 0,
                      'status-approved': item.confirmStatus === 1,
                      'status-rejected': item.confirmStatus === 2
                    }"
                  >
                    {{ getFileStatusText(item.confirmStatus) }}
                  </span>
                </div>
              </div>

              <!-- 操作按钮区域 -->
              <div class="file-actions">
                <el-button type="primary" link @click="downloadFile(item)">
                  <el-icon><Download /></el-icon>
                  下载
                </el-button>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无成果文件" />
        </div>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { CardTitle } from '@/components/Card'
import { AppNodeConfigRes, ContractApi } from '@/api/member/contract'
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { Check, View, Download } from '@element-plus/icons-vue'

defineOptions({ name: 'MemberDetail' })
const loading = ref(false) // 加载中
const activeNames = ref('')
const route = useRoute()
const contractData = ref()
const imageAttachments = ref<string[]>([])
const pdfAttachments = ref<string[]>([])
const contractNodeList = ref<AppNodeConfigRes[]>([])
const currentActiveNodeId = ref<number>() // 当前选中的节点ID
const currentFileList = ref<any[]>([]) // 当前节点的工作成果列表

// 计算当前选中的节点
const currentNode = computed(() => {
  return contractNodeList.value.find((node) => node.id === currentActiveNodeId.value)
})

// 判断是否为当前进行中的节点（最近的未完成节点）
const isCurrentNode = (node: AppNodeConfigRes, index: number) => {
  // 如果当前节点未完成，且前面的节点都已完成，则为当前节点
  if (node.isComplete === 1) return false

  // 检查前面的节点是否都已完成
  for (let i = 0; i < index; i++) {
    if (contractNodeList.value[i].isComplete === 0) {
      return false
    }
  }
  return true
}

// 选择节点
const selectNode = async (node: AppNodeConfigRes) => {
  currentActiveNodeId.value = node.id
  await loadWorkFiles(node.id)
}

// 加载工作文件
const loadWorkFiles = async (nodeId: number) => {
  try {
    const contractId = Number(route.params.id)
    const response = await ContractApi.getWorkFilePage({
      contractId: contractId,
      nodeId
    })
    currentFileList.value = response.list || []
  } catch (error) {
    console.error('加载工作文件失败:', error)
    currentFileList.value = []
  }
}

// 判断是否为图片文件
const isImageFile = (url: string) => {
  if (!url) return false
  return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url)
}

// 获取当前文件列表中所有图片的URLs
const getImageUrls = () => {
  return currentFileList.value
    .filter((item) => isImageFile(item.fileUrl))
    .map((item) => item.fileUrl)
}

// 获取文件状态文字
const getFileStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '未确认'
    case 1:
      return '已确认'
    case 2:
      return '已驳回'
    default:
      return '未知状态'
  }
}

// 预览文件
const previewFile = (item: any) => {
  if (item.fileUrl) {
    window.open(item.fileUrl, '_blank')
  }
}

// 下载文件
const downloadFile = (item: any) => {
  if (item.fileUrl) {
    const link = document.createElement('a')
    link.href = item.fileUrl
    link.download = item.fileName || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

onMounted(async () => {
  const contractId = Number(route.params.id)
  contractData.value = await ContractApi.getContract(contractId)
  parseAttachments(contractData.value.attachmentUrl)
  contractNodeList.value = await ContractApi.getContractNodeList(contractId)

  // 自动选中第一个节点或当前进行中的节点
  if (contractNodeList.value.length > 0) {
    // 找到当前进行中的节点
    const currentNodeIndex = contractNodeList.value.findIndex((node, index) =>
      isCurrentNode(node, index)
    )
    const targetNode =
      currentNodeIndex >= 0 ? contractNodeList.value[currentNodeIndex] : contractNodeList.value[0]
    await selectNode(targetNode)
  }
})

// 打开PDF文件
const openPdf = (url: string) => {
  window.open(url, '_blank')
}

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

/* 进度部分样式 */
.progress-section {
  padding: 20px 0;
}

.node-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.node-item {
  display: flex;
  padding: 12px;
  cursor: pointer;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 8px;
  transition: all 0.3s ease;
  align-items: center;

  &:hover {
    background: #e9ecef;
  }

  &.active {
    background: #e6f7ff;
    border-color: #1890ff;
  }

  &.completed {
    background: #f6ffed;
  }

  &.current {
    background: #fff7e6;
    border-color: #faad14;
  }
}

.node-icon {
  display: flex;
  width: 28px;
  height: 28px;
  margin-right: 10px;
  font-weight: 500;
  color: #666;
  background: #d9d9d9;
  border-radius: 50%;
  align-items: center;
  justify-content: center;

  &.completed {
    color: #fff;
    background: #52c41a;
  }

  &.current {
    color: #fff;
    background: #faad14;
  }

  .node-number {
    font-size: 14px;
    font-weight: 600;
  }
}

.node-content {
  flex: 1;
}

.node-name {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #262626;
}

.node-status {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 12px;

  &.completed {
    color: #52c41a;
    background: #f6ffed;
    border: 1px solid #b7eb8f;
  }

  &.processing {
    color: #faad14;
    background: #fff7e6;
    border: 1px solid #ffd591;
  }

  &.pending {
    color: #8c8c8c;
    background: #f5f5f5;
    border: 1px solid #d9d9d9;
  }
}

.node-detail {
  padding: 20px;
  margin-bottom: 24px;
  background: #fafafa;
  border-radius: 8px;
}

.detail-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.detail-info {
  .info-item {
    margin-bottom: 12px;

    .info-label {
      margin-right: 8px;
      font-weight: 500;
      color: #595959;
    }

    .info-value {
      color: #262626;
    }
  }
}

.work-results {
  margin-top: 24px;
}

.results-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  transition: all 0.3s ease;
  gap: 16px;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  }
}

.file-image-preview {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 6px;

  .work-image {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.file-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #8c8c8c;
}

.file-status {
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;

  &.status-pending {
    color: #faad14;
    background: #fff7e6;
  }

  &.status-approved {
    color: #52c41a;
    background: #f6ffed;
  }

  &.status-rejected {
    color: #ff4d4f;
    background: #fff2f0;
  }
}

.file-actions {
  display: flex;
  gap: 8px;
}
</style>
