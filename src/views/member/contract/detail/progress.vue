<route lang="json5">
{
  style: {
    navigationBarTitleText: '进度管理',
    enablePullDownRefresh: true,
  },
}
</route>

<template>
  <view class="container">
    <!-- 合同基础信息组件 -->
    <ContractInfo :contractId="contractId" />
    <view
      v-if="
        [ContractStatusEnum.IN_PROGRESS, ContractStatusEnum.COMPLETED].includes(
          contractInfo?.memberContractStatus,
        )
      "
    >
      <!-- 进度节点标签 -->
      <view class="progress-wrapper">
        <view class="section-title" @click="toggleCollapse">
          <view class="title-bar"></view>
          <text class="title-text">进度节点</text>
          <text class="title-desc">点击标签查看详情</text>
          <!-- 折叠图标 -->
          <view class="collapse-icon">
            <text v-if="isCollapsed" class="more-hint-text">查看更多</text>
            <wd-icon
              :name="isCollapsed ? 'arrow-down' : 'arrow-up'"
              size="16px"
              color="#999"
            ></wd-icon>
          </view>
        </view>

        <!-- 水平标签列表 - 可折叠区域 -->
        <view class="progress-tags-container">
          <!-- 标签列表 - 使用CSS控制折叠效果 -->
          <view class="progress-tags" :class="{ collapsed: isCollapsed }">
            <view
              v-for="(node, index) in nodeList"
              :key="node.id"
              :class="[
                'progress-tag',
                {
                  active: currentActiveNodeId === node.id,
                  completed: node.isComplete === 1,
                  current: isCurrentNode(node, index),
                },
              ]"
              @click="selectNode(node)"
            >
              <!-- 标签图标 -->
              <view
                class="tag-icon"
                :class="{ completed: node.isComplete === 1, current: isCurrentNode(node, index) }"
              >
                <wd-icon
                  v-if="node.isComplete === 1"
                  name="check"
                  size="14px"
                  color="#fff"
                ></wd-icon>
                <wd-icon
                  v-else-if="node.nodeIcon"
                  :name="node.nodeIcon"
                  size="14px"
                  :color="isCurrentNode(node, index) ? '#fff' : '#027aff'"
                ></wd-icon>
                <text v-else class="tag-number">{{ index + 1 }}</text>
              </view>

              <!-- 标签文字 -->
              <text class="tag-name">{{ node.nodeName }}</text>

              <!-- 状态指示器 -->
              <view v-if="node.isComplete === 1" class="tag-status completed">
                <wd-icon name="check" size="10px" color="#52c41a"></wd-icon>
              </view>
            </view>
          </view>
        </view>

        <!-- 当前选中节点的详细信息 -->
        <view v-if="currentNode" class="node-detail-card">
          <view class="node-detail-header">
            <text class="node-detail-name">{{ currentNode.nodeName }}</text>
            <view v-if="currentNode.isComplete === 1" class="detail-status completed">已完成</view>
            <view
              v-else-if="
                isCurrentNode(
                  currentNode,
                  nodeList.findIndex((n) => n.id === currentNode.id),
                )
              "
              class="detail-status processing"
            >
              进行中
            </view>
            <view v-else class="detail-status completed">未开始</view>
          </view>

          <view class="node-detail-meta">
            <!-- 工作成果要求 -->
            <view class="detail-meta-item">
              <text class="detail-meta-label">工作成果要求:</text>
              <text class="detail-meta-value">{{ currentNode.deliverableRequirements }}</text>
            </view>
          </view>
        </view>

        <view class="section-title">
          <view class="title-bar"></view>
          <text class="title-text">节点成果</text>
          <view
            v-if="userStore.isUser && currentFileList.length > 0 && isCurrentNodeActive"
            class="select-all-wrapper"
            @click="toggleSelectAll"
          >
            <checkbox :checked="isAllSelected" color="#027aff" style="transform: scale(0.7)" />
            <text class="select-all-text">全选</text>
          </view>
        </view>
        <view>
          <view
            v-for="(item, index) in currentFileList"
            :key="index"
            class="work-result-wrapper"
            :class="{
              selected: userStore.isUser && isCurrentNodeActive && selectedItems.includes(item.id),
            }"
          >
            <view
              v-if="userStore.isUser && isCurrentNodeActive"
              class="checkbox-wrapper"
              @click.stop
            >
              <checkbox
                v-if="item.confirmStatus === 0"
                :checked="selectedItems.includes(item.id)"
                @click.stop="toggleSelectItem(item)"
                color="#027aff"
                style="transform: scale(0.7)"
              />
            </view>
            <work-result
              :item="item"
              class="work-result-item"
              @tap="
                userStore.isUser && isCurrentNodeActive && item.confirmStatus === 0
                  ? toggleSelectItem(item)
                  : null
              "
            >
              <template
                v-if="
                  userStore.isDesigner && (item.confirmStatus === 0 || item.confirmStatus === 2)
                "
              >
                <view class="text-[#027AFF]" @click.stop="handleEditWork(item)">编辑</view>
                <view
                  class="text-[#CC453D]"
                  v-if="item.confirmStatus === 0"
                  @click.stop="handleDeleteWork(item)"
                >
                  删除
                </view>
              </template>
            </work-result>
          </view>
          <wd-status-tip v-if="currentFileList.length === 0" image="content" tip="暂无成果" />
        </view>
      </view>

      <wd-fab
        v-if="userStore.isDesigner"
        position="right-bottom"
        :gap="{ bottom: 120 }"
        :draggable="true"
        :expandable="false"
      >
        <template #trigger>
          <wd-button open-type="share" icon="share" size="24px" color="#FFFFFF"></wd-button>
        </template>
      </wd-fab>
      <!-- 节点操作按钮固定在底部 -->
      <view class="fixed-footer" v-if="currentNode && isContractInProgress">
        <view v-if="userStore.isDesigner && getLatestActiveNodeId() === currentNode.id">
          <wd-button block @click="uploadWorkFile" icon="upload" round>上传成果</wd-button>
        </view>
        <view
          v-if="userStore.isUser && isCurrentNodeActive && hasSelectableItems"
          class="flex justify-between gap-20rpx"
        >
          <wd-button custom-class="custom-btn" @click="handleRejectWorkFile" type="error" round>
            驳回
          </wd-button>
          <wd-button custom-class="custom-btn" @click="handleConfirmWorkFile" round>确认</wd-button>
        </view>
      </view>
    </view>
    <wd-status-tip image="content" tip="合同暂未开始" v-else />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  confirmWorkFile,
  deleteWorkFile,
  getContractNodeList,
  getUserContractDetail,
  getWorkFilePageList,
} from '@/service/contract'
import { useMessage } from 'wot-design-uni'
import ContractInfo from '@/components/contract-info/index.vue'
import WorkResult from '@/components/work-result/index.vue'
import { useUserStore } from '@/store'
import { ContractStatusEnum } from '@/utils/enum'
// 页面参数
const contractId = ref<number>()
const contractInfo = ref<API.AppContractRes>()
// 数据状态
const nodeList = ref<API.AppContractNodeConfigRes[]>([]) // 节点列表
const currentActiveNodeId = ref<number>() // 当前选中的节点ID
const isLoading = ref(false)
const userStore = useUserStore()
const message = useMessage()
const isCollapsed = ref(false) // 标签列表的折叠状态
const currentFileList = ref([]) // 当前节点的工作成果列表
const currentConfirmStatus = ref(0) // 当前节点的确认状态

// 多选相关数据
const selectedItems = ref<number[]>([])

// 获取当前可选的工作项（只选择未确认的项目，不包括已通过和驳回的项目）
const selectableItems = computed(() => {
  return currentFileList.value.filter((item) => item.confirmStatus === 0)
})

// 判断是否全选
const isAllSelected = computed(() => {
  const availableItems = selectableItems.value
  return availableItems.length > 0 && selectedItems.value.length === availableItems.length
})

// 是否有可选项目
const hasSelectableItems = computed(() => {
  return selectableItems.value.length > 0
})

// 判断是否为当前激活节点（用于确定是否应该显示多选功能）
const isCurrentNodeActive = computed(() => {
  if (!currentNode.value) return false
  return isCurrentNode(
    currentNode.value,
    nodeList.value.findIndex((n) => n.id === currentNode.value.id),
  )
})

// 合同进行中
const isContractInProgress = computed(() => {
  return contractInfo.value?.memberContractStatus === ContractStatusEnum.IN_PROGRESS
})

// 切换折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
// 计算选中的节点
const currentNode = computed(() => {
  return nodeList.value.find((node) => node.id === currentActiveNodeId.value)
})

// 判断是否为当前进行中的节点（最近的未完成节点）
const isCurrentNode = (node: API.AppContractNodeConfigRes, index: number) => {
  // 如果当前节点未完成，且前面的节点都已完成，则为当前节点
  if (node.isComplete === 1) return false

  // 检查前面的节点是否都已完成
  for (let i = 0; i < index; i++) {
    if (nodeList.value[i].isComplete === 0) {
      return false
    }
  }
  return true
}
// 编辑成果方法
const handleEditWork = (item) => {
  // 跳转到编辑页面，带上必要的参数
  const url = `/pages-other/contract/upload-fruit?id=${item.id}&contractId=${item.contractId}&nodeId=${item.nodeId}`
  uni.navigateTo({ url })
}
// 删除成果方法
const handleDeleteWork = (item) => {
  console.log('删除工作成果', item)
  uni.showModal({
    title: '确认删除',
    content: '确定要删除该工作成果吗？',
    success: async (res) => {
      await deleteWorkFile(item.id)
      // 找到id并删掉
      const index = currentFileList.value.findIndex((file) => file.id === item.id)
      if (index !== -1) {
        currentFileList.value.splice(index, 1)
      }
      uni.showToast({
        title: '删除成功',
        icon: 'success',
      })
    },
  })
}
// 获取最近的激活节点ID
const getLatestActiveNodeId = () => {
  // 找到最后一个已完成的节点的下一个节点，或第一个未完成的节点
  let latestNodeId = nodeList.value[0]?.id

  for (let i = 0; i < nodeList.value.length; i++) {
    const node = nodeList.value[i]
    if (node.isComplete === 0) {
      // 如果前面的节点都已完成，则这是当前节点
      let allPreviousCompleted = true
      for (let j = 0; j < i; j++) {
        if (nodeList.value[j].isComplete === 0) {
          allPreviousCompleted = false
          break
        }
      }
      if (allPreviousCompleted) {
        latestNodeId = node.id
        break
      }
    } else {
      latestNodeId = node.id
    }
  }

  return latestNodeId
}

// 加载节点列表
const loadNodeList = async () => {
  try {
    isLoading.value = true
    uni.showLoading({ title: '加载中...' })

    const res = await getContractNodeList(contractId.value)
    nodeList.value = res.data

    // 按排序字段排序
    nodeList.value.sort((a, b) => a.sortOrder - b.sortOrder)

    // 设置默认激活的节点（最近的节点）
    currentActiveNodeId.value = getLatestActiveNodeId()
    getWorkFileList()
  } finally {
    isLoading.value = false
    uni.hideLoading()
  }
}

const getWorkFileList = async () => {
  try {
    const res: any = await getWorkFilePageList({
      nodeId: currentNode.value.id,
      contractId: contractId.value,
    })
    currentFileList.value = res.data.list.reverse()
    currentConfirmStatus.value = res.data.confirmStatus

    // 如果是当前进行中的节点，且用户是客户，则默认选中所有可选项目
    if (
      userStore.isUser &&
      isCurrentNode(
        currentNode.value,
        nodeList.value.findIndex((n) => n.id === currentNode.value.id),
      )
    ) {
      // 选中所有未确认的项目（状态为0的项目，排除已通过和驳回的项目）
      const selectableIds = currentFileList.value
        .filter((item) => item.confirmStatus === 0)
        .map((item) => item.id)

      // 创建新数组以确保触发响应式
      selectedItems.value = [...selectableIds]
      console.log('自动选中项目数量：', selectedItems.value.length)
    }

    // 处理返回的数据
    console.log('工作成果列表:', res.data)
  } catch (error) {
    console.error('获取工作成果列表失败', error)
    uni.showToast({
      title: '获取工作成果列表失败',
      icon: 'none',
    })
  }
}
// 选择/取消选择单个项目
const toggleSelectItem = (item: any) => {
  // 已确认的项目和驳回的项目都不能选择
  if (item.confirmStatus === 1 || item.confirmStatus === 2) return

  console.log('点击项目', item.id, '当前状态：', selectedItems.value.includes(item.id))

  // 创建新数组以确保触发响应式更新
  const newSelectedItems = [...selectedItems.value]
  const index = newSelectedItems.indexOf(item.id)

  if (index === -1) {
    newSelectedItems.push(item.id)
  } else {
    newSelectedItems.splice(index, 1)
  }

  // 更新选中状态
  selectedItems.value = newSelectedItems

  console.log('选中的项目数量：', selectedItems.value.length)
}

// 全选/取消全选所有项目
const toggleSelectAll = () => {
  console.log('触发全选/取消全选', isAllSelected.value)

  if (isAllSelected.value) {
    // 清空选择
    selectedItems.value = []
  } else {
    // 只选择未确认或已驳回的项目（状态为0或2的项目）
    const selectableIds = selectableItems.value.map((item) => item.id)
    selectedItems.value = [...selectableIds] // 创建新数组以确保触发响应式
  }

  console.log('选中的项目数量：', selectedItems.value.length)
}

// 选择节点
const selectNode = (node: API.AppContractNodeConfigRes) => {
  currentActiveNodeId.value = node.id
  // 清空已选择的项目
  selectedItems.value = []
  getWorkFileList()
}

// 上传工作成果
const uploadWorkFile = () => {
  if (!currentNode.value) return

  uni.navigateTo({
    url: `/pages-other/contract/upload-fruit?contractId=${contractId.value}&nodeId=${currentNode.value.id}`,
  })
}

const handleConfirmWorkFile = () => {
  // 如果没有选择任何项目，则提醒用户
  if (selectedItems.value.length === 0) {
    return uni.showToast({
      title: '请先选择需要操作的工作成果',
      icon: 'none',
    })
  }

  uni.showModal({
    title: '提示',
    content: `确认签收选定的${selectedItems.value.length}个工作成果吗？`,
    success: async (res) => {
      if (!res.confirm) return

      try {
        uni.showLoading({ title: '确认中...' })
        await confirmWorkFile({
          confirmStatus: 1,
          ids: selectedItems.value,
          remark: '',
          nodeId: currentNode.value.id,
        })
        uni.hideLoading()
        uni.showToast({ title: '确认成功', icon: 'success' })

        // 更新列表
        await loadNodeList()
        // 清空选择
        selectedItems.value = []
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '操作失败', icon: 'error' })
      }
    },
  })
}

const handleRejectWorkFile = () => {
  // 如果没有选择任何项目，则提醒用户
  if (selectedItems.value.length === 0) {
    return uni.showToast({
      title: '请先选择需要操作的工作成果',
      icon: 'none',
    })
  }

  message
    .prompt({
      title: '驳回原因',
      inputValue: '',
      inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
      inputError: '请输入驳回原因',
      inputPlaceholder: '请输入驳回原因',
    })
    .then(async (resp) => {
      try {
        uni.showLoading({ title: '驳回中...' })
        await confirmWorkFile({
          confirmStatus: 2,
          ids: selectedItems.value,
          remark: resp.value,
          nodeId: currentNode.value.id,
        })
        uni.hideLoading()
        uni.showToast({ title: '驳回成功', icon: 'success' })

        // 更新列表
        await loadNodeList()
        // 清空选择
        selectedItems.value = []
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '操作失败', icon: 'error' })
      }
    })
}
// 加载合同详情
const loadContractDetail = async () => {
  const res = await getUserContractDetail(contractId.value)
  contractInfo.value = res.data
}
// 页面加载
onLoad((option) => {
  contractId.value = Number(option.contractId)
})
onShow(async () => {
  await loadNodeList()
  await loadContractDetail()
})

// 下拉刷新处理函数
onPullDownRefresh(async () => {
  if (contractId.value) {
    await loadNodeList()
    await loadContractDetail()
    uni.stopPullDownRefresh()
  }
})

onShareAppMessage(() => {
  return {
    title: contractInfo.value.contractName,
    path: `/pages-other/contract/progress?contractId=${contractId.value}`,
  }
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 150rpx; /* 为固定底部按钮预留空间 */
  background-color: #f5f5f5;
}

// 进度包装器
.progress-wrapper {
  margin: 0 20rpx;
}

// 分节标题
.section-title {
  position: relative;
  display: flex;
  align-items: center;
  margin: 20rpx 0 30rpx;
  cursor: pointer;
}

.title-bar {
  width: 8rpx;
  height: 36rpx;
  margin-right: 16rpx;
  background-color: #027aff;
  border-radius: 4rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.title-desc {
  margin-left: 20rpx;
  font-size: 24rpx;
  color: #999;
}

.collapse-icon {
  margin-left: auto;
  transition: all 0.3s;
}

// 进度标签容器
.progress-tags-container {
  position: relative;
  margin-bottom: 30rpx;
}

.more-hint-text {
  padding: 6rpx 16rpx;
  margin-top: 8rpx;
  margin-right: 4rpx;
  font-size: 22rpx;
  color: #999;
  cursor: pointer;
  background-color: #f5f5f5;
  border-radius: 20rpx;
}

// 进度标签列表
.progress-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
  transition: all 0.3s ease-in-out;

  &.collapsed {
    max-height: 100rpx; /* 控制只显示一行的高度 */
    overflow: hidden;
  }
}

.progress-tag {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80rpx;
  padding: 12rpx;
  cursor: pointer;
  background-color: #fff;
  border: 2rpx solid #e8e8e8;
  border-radius: 8rpx;
  transition: all 0.3s ease;

  &.active {
    border-color: #027aff;
    box-shadow: 0 4rpx 8rpx rgba(2, 122, 255, 0.15);
  }

  &.completed {
    background-color: #f6ffed;
    border-color: #52c41a;
  }

  &.current {
    background-color: #e6f7ff;
    border-color: #027aff;
  }

  &:active {
    transform: translateY(2rpx);
  }
}

.tag-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  margin-bottom: 6rpx;
  background-color: #f5f5f5;
  border: 2rpx solid #e8e8e8;
  border-radius: 50%;

  &.completed {
    background-color: #52c41a;
    border-color: #52c41a;
  }

  &.current {
    background-color: #027aff;
    border-color: #027aff;
  }
}

.tag-number {
  font-size: 20rpx;
  font-weight: 600;
  color: #666;
}

.current .tag-number {
  color: #fff;
}

.tag-name {
  font-size: 22rpx;
  font-weight: 500;
  line-height: 1.2;
  color: #333;
  text-align: center;
}

.tag-status {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;

  &.completed {
    background-color: #52c41a;
  }

  &.processing {
    background-color: #027aff;
  }
}

// 节点详情卡片
.node-detail-card {
  padding: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.node-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.node-detail-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.detail-status {
  display: flex;
  gap: 4rpx;
  align-items: center;
  padding: 4rpx 12rpx;
  font-size: 22rpx;
  border-radius: 16rpx;

  &.completed {
    color: #52c41a;
    background-color: #f6ffed;
    border: 1rpx solid #b7eb8f;
  }

  &.processing {
    color: #027aff;
    background-color: #e6f7ff;
    border: 1rpx solid #91d5ff;
  }
}

.node-detail-meta {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.detail-meta-item {
  display: flex;
  gap: 8rpx;
  align-items: center;
  font-size: 26rpx;
}

.detail-meta-label {
  flex-shrink: 0;
  align-self: flex-start;
  width: 180rpx;
  color: #999;
}

.detail-meta-value {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  color: #666;

  &.upload-required {
    color: #027aff;
  }

  &.payable {
    color: #52c41a;
  }
}

// 节点操作区域
.node-action-section {
  padding-top: 24rpx;
  margin-top: 24rpx;
}

.action-btn {
  display: flex;
  gap: 8rpx;
  align-items: center;
  justify-content: center;
  padding: 16rpx 32rpx;
  font-size: 28rpx;
  font-weight: 500;
  cursor: pointer;
  border-radius: 32rpx;
  transition: all 0.3s ease;

  &.upload-btn {
    color: #027aff;
    background-color: #e6f7ff;
    border: 1rpx solid #91d5ff;

    &:active {
      background-color: #bae7ff;
    }
  }
}

// 固定底部区域
.fixed-footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  padding: 20rpx 40rpx 60rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

:deep(.custom-btn) {
  width: 50%;
}

// 多选相关样式
.select-all-wrapper {
  display: flex;
  align-items: center;
  margin-left: auto;
  font-size: 24rpx;
  color: #666;
}

.select-all-text {
  margin-left: 4rpx;
}

.work-result-wrapper {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
  transition: all 0.2s ease;

  &.selected {
    background-color: rgba(2, 122, 255, 0.05);
    border-radius: 12rpx;
  }
}

.checkbox-wrapper {
  padding: 20rpx 10rpx 0 0;
}

.work-result-item {
  flex: 1;
}

:deep(.wd-icon-share) {
  margin: 0 3px !important;
}
</style>
