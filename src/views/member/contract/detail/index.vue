<template>
  <div v-loading="loading" class="flex gap-20px flex-col">
    <el-card :body-style="{ paddingTop: '0', paddingBottom: 0 }" class="contract-card">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="info">
          <template #title>
            <CardTitle title="合同信息（点击展开收起）" />
          </template>
          <div class="contract-details">
            <el-descriptions :column="3" border>
              <!-- 基本信息 -->
              <el-descriptions-item label="合同编号">
                {{ contractData?.contractNo || '' }}
              </el-descriptions-item>
              <el-descriptions-item label="合同状态">
                <div class="contract-status-container">
                  <DictTag
                    :type="DICT_TYPE.MEMBER_CONTRACT_STATUS"
                    :value="contractData?.memberContractStatus"
                  />
                  <el-tooltip
                    v-if="contractData?.memberContractStatus === 2"
                    :content="contractData.rejectReason"
                    placement="top"
                    effect="dark"
                  >
                    <el-icon class="reject-reason-icon">
                      <InfoFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="审核人">
                {{ contractData?.checker || '' }}
              </el-descriptions-item>
              <el-descriptions-item label="合同周期">
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
              <!-- <el-descriptions-item label="设计师名称">
                {{ contractData?.designerName || '' }}
              </el-descriptions-item> -->

              <!-- 项目信息 -->
              <el-descriptions-item label="工程地址" :span="2">
                {{ contractData?.projectAddress || '' }}
              </el-descriptions-item>
              <el-descriptions-item label="小区名称">
                {{ contractData?.communityName || '' }}
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
    <!-- 非审核模式：显示节点信息 -->
    <el-card v-if="!isCheckMode && !isPendingCheck">
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
                expanded: expandedNodeId === node.id,
                completed: node.isComplete === 1,
                current: isCurrentNode(node, index)
              }
            ]"
          >
            <!-- 节点头部 -->
            <div class="node-header" @click="handleNodeClick(node)">
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

              <!-- 节点内容 -->
              <div class="node-content">
                <div class="node-name">{{ index + 1 }}. {{ node.nodeName }}</div>
                <div v-if="node.isComplete === 1" class="node-status completed">已完成</div>
                <div v-else-if="isCurrentNode(node, index)" class="node-status processing">
                  进行中
                </div>
                <div v-else class="node-status pending">未开始</div>
              </div>

              <!-- 展开箭头 -->
              <div class="expand-arrow" :class="{ expanded: expandedNodeId === node.id }">
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </div>
            </div>

            <!-- 节点展开内容 -->
            <div v-if="expandedNodeId === node.id" class="node-expanded-content">
              <!-- 节点详细信息 -->
              <div class="node-detail">
                <div class="detail-info">
                  <div class="info-item">
                    <span class="info-label">工作成果要求:</span>
                    <span class="info-value">{{ node.deliverableRequirements || '暂无要求' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">用户付款比例:</span>
                    <span class="info-value">{{ node.userPaymentRatio }}%</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">设计师结算比例:</span>
                    <span class="info-value">{{ node.designerSettlementRatio }}%</span>
                  </div>
                </div>
              </div>

              <!-- 工作成果 -->
              <div class="work-results">
                <h5 class="results-title">工作成果</h5>
                <div v-if="currentFileList.length > 0" class="file-list">
                  <div
                    v-for="(item, fileIndex) in currentFileList"
                    :key="fileIndex"
                    class="file-item"
                  >
                    <!-- 图片预览区域 -->
                    <div v-if="getFileImages(item.fileUrl).length > 0" class="file-image-preview">
                      <div class="image-gallery">
                        <el-image
                          v-for="(imageUrl, imgIndex) in getFileImages(item.fileUrl)"
                          :key="imgIndex"
                          :src="imageUrl"
                          :preview-src-list="getFileImages(item.fileUrl)"
                          class="work-image"
                          fit="cover"
                          :preview-teleported="true"
                        />
                      </div>
                    </div>

                    <!-- 文件信息区域 -->
                    <div class="file-info">
                      <div class="file-name">
                        {{ item.fileName || `成果文件${fileIndex + 1}` }}
                        <span v-if="getFileCount(item.fileUrl) > 1" class="file-count">
                          ({{ getFileCount(item.fileUrl) }}个文件)
                        </span>
                      </div>
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
                        <span v-if="item.confirmTime" class="confirm-time">
                          确认时间: {{ formatDate(item.confirmTime, 'YYYY-MM-DD HH:mm:ss') }}
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
                <el-empty v-else description="暂无成果文件" :image-size="60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 审核模式：显示审核表单 -->
    <el-card v-if="isCheckMode">
      <CardTitle title="合同审核" />
      <el-form
        ref="checkFormRef"
        :model="checkFormData"
        :rules="checkFormRules"
        label-width="100px"
        class="check-form"
      >
        <el-form-item label="审核状态" prop="memberContractStatus">
          <el-radio-group v-model="checkFormData.memberContractStatus">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="checkFormData.memberContractStatus === 2"
          label="驳回原因"
          prop="rejectReason"
        >
          <el-input
            v-model="checkFormData.rejectReason"
            type="textarea"
            :rows="3"
            placeholder="请输入驳回原因"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmitCheck" :loading="loading">
            提交审核
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { CardTitle } from '@/components/Card'
import { AppNodeConfigRes, ContractApi } from '@/api/member/contract'
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { Check, Download, ArrowDown, Document, InfoFilled } from '@element-plus/icons-vue'

defineOptions({ name: 'MemberDetail' })
const loading = ref(false) // 加载中
const route = useRoute()
const contractData = ref()
const imageAttachments = ref<string[]>([])
const pdfAttachments = ref<string[]>([])
const contractNodeList = ref<AppNodeConfigRes[]>([])
const currentActiveNodeId = ref<number>() // 当前选中的节点ID
const currentFileList = ref<any[]>([]) // 当前节点的工作成果列表
const expandedNodeId = ref<number>() // 当前展开的节点ID
const nodeFileMap = ref<Map<number, any[]>>(new Map()) // 存储每个节点的文件列表

// 判断是否为审核模式
const isCheckMode = computed(() => route.params.type === 'check')
//是否为待审核 被驳回
const isPendingCheck = computed(() => {
  return (
    contractData.value?.memberContractStatus === 0 || contractData.value?.memberContractStatus === 2
  )
})

// 控制合同信息展开状态
const activeNames = ref('')

// 审核表单数据
const checkFormRef = ref()
const checkFormData = ref({
  id: 0,
  memberContractStatus: 1, // 默认通过
  rejectReason: ''
})

// 审核表单规则
const checkFormRules = {
  memberContractStatus: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
  rejectReason: [
    {
      required: true,
      message: '请输入驳回原因',
      trigger: 'blur',
      validator: (_rule: any, value: string, callback: any) => {
        if (checkFormData.value.memberContractStatus === 2 && (!value || value.trim() === '')) {
          callback(new Error('驳回时必须填写驳回原因'))
        } else {
          callback()
        }
      }
    }
  ]
}

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

// 处理节点点击
const handleNodeClick = async (node: AppNodeConfigRes) => {
  if (expandedNodeId.value === node.id) {
    // 如果点击的是已展开的节点，则收起
    expandedNodeId.value = undefined
    currentActiveNodeId.value = undefined
    currentFileList.value = []
  } else {
    // 展开节点并加载文件
    expandedNodeId.value = node.id
    currentActiveNodeId.value = node.id
    await loadNodeFiles(node.id)
  }
}

// 加载节点的工作成果
const loadNodeFiles = async (nodeId: number) => {
  try {
    // 检查是否已经缓存了该节点的文件
    if (nodeFileMap.value.has(nodeId)) {
      currentFileList.value = nodeFileMap.value.get(nodeId) || []
      return
    }

    const contractId = Number(route.params.id)
    const response = await ContractApi.getWorkFilePage({
      contractId: contractId,
      nodeId
    })
    const files = response.list || []
    // 缓存文件列表
    nodeFileMap.value.set(nodeId, files)
    currentFileList.value = files
  } catch (error) {
    console.error('加载工作成果失败:', error)
    currentFileList.value = []
  }
}

// 判断是否为图片文件
const isImageFile = (url: string) => {
  if (!url) return false
  return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url)
}

// 获取文件中的图片URLs（处理逗号分隔的多张图片）
const getFileImages = (fileUrl: string) => {
  if (!fileUrl) return []

  // 分割文件URLs
  const urls = fileUrl
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url)

  // 过滤出图片文件
  return urls.filter((url) => isImageFile(url))
}

// 获取文件总数
const getFileCount = (fileUrl: string) => {
  if (!fileUrl) return 0
  return fileUrl
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url).length
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

// 下载文件
const downloadFile = (item: any) => {
  if (!item.fileUrl) return

  // 分割文件URLs
  const urls = item.fileUrl
    .split(',')
    .map((url: string) => url.trim())
    .filter((url: string) => url)

  if (urls.length === 1) {
    // 单个文件直接下载
    const link = document.createElement('a')
    link.href = urls[0]
    link.download = item.fileName || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else if (urls.length > 1) {
    // 多个文件逐一下载
    urls.forEach((url, index) => {
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = url
        link.download = `${item.fileName || 'file'}_${index + 1}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, index * 500) // 间隔500ms下载，避免浏览器阻止
    })
  }
}

onMounted(async () => {
  try {
    loading.value = true
    const contractId = Number(route.params.id)
    contractData.value = await ContractApi.getContract(contractId)
    parseAttachments(contractData.value.attachmentUrl)

    // 审核模式下设置合同ID和默认展开合同信息
    if (isCheckMode.value || isPendingCheck.value) {
      checkFormData.value.id = contractId
      activeNames.value = 'info' // 审核模式下默认展开合同信息
    } else {
      // 非审核模式才加载节点信息
      contractNodeList.value = await ContractApi.getContractNodeList(contractId)

      // 自动选中第一个节点或当前进行中的节点
      if (contractNodeList.value.length > 0) {
        // 找到当前进行中的节点
        const currentNodeIndex = contractNodeList.value.findIndex((node, index) =>
          isCurrentNode(node, index)
        )
        const targetNode =
          currentNodeIndex >= 0
            ? contractNodeList.value[currentNodeIndex]
            : contractNodeList.value[0]
        await handleNodeClick(targetNode)
      }
    }
  } catch (error) {
    console.error('加载合同详情失败:', error)
  } finally {
    loading.value = false
  }
})

// 处理审核提交
const handleSubmitCheck = async () => {
  try {
    await checkFormRef.value?.validate()
    loading.value = true

    await ContractApi.checkContract(checkFormData.value)
    ElMessage.success('审核提交成功')

    // 返回上一页或关闭页面
    window.history.back()
  } catch (error) {
    console.error('审核提交失败:', error)
    ElMessage.error('审核提交失败')
  } finally {
    loading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  window.history.back()
}

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

  .contract-status-container {
    display: flex;
    align-items: center;
    gap: 8px;

    .reject-reason-icon {
      font-size: 16px;
      color: #f56c6c;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: #f54747;
      }
    }
  }

  :deep(.el-collapse-item__header) {
    font-weight: 500;
    color: #409eff;
    border-bottom: 0 !important;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.node-item {
  overflow: hidden;
  background: #fafbfc;
  border: 1px solid transparent;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #f5f6f7;
    border-color: #e4e6ea;
  }

  &.expanded {
    background: #f0f9ff;
    border-color: #93c5fd;
  }

  &.completed {
    background: #f0fdf4;
    border-color: #86efac;
  }

  &.current {
    background: #fffbeb;
    border-color: #fbbf24;
  }
}

.node-header {
  display: flex;
  padding: 12px;
  cursor: pointer;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgb(0 0 0 / 1%);
  }
}

.node-icon {
  display: flex;
  width: 28px;
  height: 28px;
  margin-right: 10px;
  font-weight: 500;
  color: #6b7280;
  background: #e5e7eb;
  border-radius: 50%;
  align-items: center;
  justify-content: center;

  &.completed {
    color: #fff;
    background: #10b981;
  }

  &.current {
    color: #fff;
    background: #f59e0b;
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
    color: #15803d;
    background: #dcfce7;
    border: 1px solid #bbf7d0;
  }

  &.processing {
    color: #d97706;
    background: #fef3c7;
    border: 1px solid #fde68a;
  }

  &.pending {
    color: #6b7280;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
  }
}

.expand-arrow {
  margin-left: 8px;
  color: #9ca3af;
  transition: transform 0.3s ease;

  &.expanded {
    color: #6b7280;
    transform: rotate(180deg);
  }
}

.node-expanded-content {
  padding: 0 12px 12px;
  background: rgb(255 255 255 / 50%);
  border-top: 1px solid #f1f3f4;
}

.node-detail {
  padding: 16px 0;
  background: transparent;
  border-radius: 0;
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
  margin-top: 16px;

  .results-title {
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 600;
    color: #262626;
  }
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
  width: 120px;
  border-radius: 6px;

  .image-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .work-image {
    width: 56px;
    height: 56px;
    border-radius: 4px;

    &:only-child {
      width: 120px;
      height: 80px;
    }

    &:nth-child(1):nth-last-child(2),
    &:nth-child(2):nth-last-child(1) {
      width: 56px;
      height: 56px;
    }
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

  .file-count {
    margin-left: 8px;
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
  }
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
    color: #92400e;
    background: #fef3c7;
  }

  &.status-approved {
    color: #065f46;
    background: #d1fae5;
  }

  &.status-rejected {
    color: #991b1b;
    background: #fee2e2;
  }
}

.confirm-time {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}

.file-actions {
  display: flex;
  gap: 8px;
}

/* 审核表单样式 */
.check-form {
  max-width: 600px;
  padding: 20px 0;

  .el-form-item {
    margin-bottom: 24px;

    .el-radio-group {
      .el-radio {
        margin-right: 24px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .el-textarea {
    .el-textarea__inner {
      resize: vertical;
    }
  }

  .el-button {
    &:not(:last-child) {
      margin-right: 12px;
    }
  }
}
</style>
