<template>
  <div class="work-results">
    <h5 class="results-title">工作成果</h5>
    <div v-if="fileList.length > 0" class="file-list">
      <div v-for="(item, fileIndex) in fileList" :key="fileIndex" class="file-item">
        <!-- 文件预览区域 -->
        <div class="file-preview">
          <!-- 图片预览 -->
          <div v-if="getFilesGrouped(item.fileUrl).images.length > 0" class="file-image-preview">
            <div class="image-gallery">
              <el-image
                v-for="(imageUrl, imgIndex) in getFilesGrouped(item.fileUrl).images"
                :key="imgIndex"
                :src="imageUrl"
                :preview-src-list="getFilesGrouped(item.fileUrl).images"
                class="work-image"
                fit="cover"
                :preview-teleported="true"
              />
            </div>
          </div>

          <!-- 视频预览 -->
          <div v-if="getFilesGrouped(item.fileUrl).videos.length > 0" class="file-video-preview">
            <div class="video-gallery">
              <video
                v-for="(videoUrl, vidIndex) in getFilesGrouped(item.fileUrl).videos"
                :key="vidIndex"
                :src="videoUrl"
                class="work-video"
                controls
                preload="metadata"
              ></video>
            </div>
          </div>

          <!-- 其他文件类型图标显示 -->
          <div
            v-if="
              getFilesGrouped(item.fileUrl).documents.length > 0 ||
              getFilesGrouped(item.fileUrl).audios.length > 0 ||
              getFilesGrouped(item.fileUrl).others.length > 0
            "
            class="file-icons-preview"
          >
            <div class="file-icons">
              <!-- 文档文件 -->
              <div
                v-for="(docUrl, docIndex) in getFilesGrouped(item.fileUrl).documents"
                :key="`doc-${docIndex}`"
                class="file-icon-item document"
                @click="openFile(docUrl)"
              >
                <el-icon size="24"><Document /></el-icon>
                <span class="file-type-label">{{ getFileNameFromUrl(docUrl) || '文档' }}</span>
              </div>
              <!-- 音频文件 -->
              <div
                v-for="(audioUrl, audioIndex) in getFilesGrouped(item.fileUrl).audios"
                :key="`audio-${audioIndex}`"
                class="file-icon-item audio"
                @click="openFile(audioUrl)"
              >
                <el-icon size="24"><Microphone /></el-icon>
                <span class="file-type-label">{{ getFileNameFromUrl(audioUrl) || '音频' }}</span>
              </div>
              <!-- 其他文件 -->
              <div
                v-for="(otherUrl, otherIndex) in getFilesGrouped(item.fileUrl).others"
                :key="`other-${otherIndex}`"
                class="file-icon-item other"
                @click="openFile(otherUrl)"
              >
                <el-icon size="24"><Document /></el-icon>
                <span class="file-type-label">{{ getFileNameFromUrl(otherUrl) || '文件' }}</span>
              </div>
            </div>
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
          <!-- 文件类型统计 -->
          <div class="file-types">
            <template v-if="getFilesGrouped(item.fileUrl).images.length > 0">
              <span class="type-tag image">
                <el-icon><Picture /></el-icon>
                图片 {{ getFilesGrouped(item.fileUrl).images.length }}
              </span>
            </template>
            <template v-if="getFilesGrouped(item.fileUrl).videos.length > 0">
              <span class="type-tag video">
                <el-icon><VideoPlay /></el-icon>
                视频 {{ getFilesGrouped(item.fileUrl).videos.length }}
              </span>
            </template>
            <template v-if="getFilesGrouped(item.fileUrl).audios.length > 0">
              <span class="type-tag audio">
                <el-icon><Microphone /></el-icon>
                音频 {{ getFilesGrouped(item.fileUrl).audios.length }}
              </span>
            </template>
            <template v-if="getFilesGrouped(item.fileUrl).documents.length > 0">
              <span class="type-tag document">
                <el-icon><Document /></el-icon>
                文档 {{ getFilesGrouped(item.fileUrl).documents.length }}
              </span>
            </template>
            <template v-if="getFilesGrouped(item.fileUrl).others.length > 0">
              <span class="type-tag other">
                <el-icon><Document /></el-icon>
                其他 {{ getFilesGrouped(item.fileUrl).others.length }}
              </span>
            </template>
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
              确认时间: {{ formatDate(new Date(Number(item.confirmTime)), 'YYYY-MM-DD HH:mm:ss') }}
            </span>
          </div>
        </div>

        <!-- 操作按钮区域 -->
        <div class="file-actions">
          <el-button type="primary" link @click="downloadFile(item)">
            <el-icon><Download /></el-icon>
            下载全部
          </el-button>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无成果文件" :image-size="60" />
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/formatTime'
import { Picture, VideoPlay, Microphone, Document, Download } from '@element-plus/icons-vue'

interface FileItem {
  id?: number
  fileName: string
  fileUrl: string
  confirmStatus: number
  confirmTime?: string
}

interface Props {
  fileList: FileItem[]
}

defineProps<Props>()

// 判断是否为图片文件
const isImageFile = (url: string) => {
  if (!url) return false
  return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url)
}

// 判断是否为视频文件
const isVideoFile = (url: string) => {
  if (!url) return false
  return /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(url)
}

// 判断是否为音频文件
const isAudioFile = (url: string) => {
  if (!url) return false
  return /\.(mp3|wav|flac|aac|ogg|wma)$/i.test(url)
}

// 判断是否为文档文件
const isDocumentFile = (url: string) => {
  if (!url) return false
  return /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar|7z)$/i.test(url)
}

// 从URL中提取文件名
const getFileNameFromUrl = (url: string): string => {
  return url.split('?')[1]?.split('=')[1] || ''
}

// 获取文件类型
const getFileType = (url: string) => {
  if (isImageFile(url)) return 'image'
  if (isVideoFile(url)) return 'video'
  if (isAudioFile(url)) return 'audio'
  if (isDocumentFile(url)) return 'document'
  return 'other'
}

// 获取所有文件URLs并分类
const getFilesGrouped = (fileUrl: string) => {
  if (!fileUrl) return { images: [], videos: [], audios: [], documents: [], others: [] }

  const urls = fileUrl
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url)

  const grouped = {
    images: [] as string[],
    videos: [] as string[],
    audios: [] as string[],
    documents: [] as string[],
    others: [] as string[]
  }

  urls.forEach((url) => {
    const type = getFileType(url)
    switch (type) {
      case 'image':
        grouped.images.push(url)
        break
      case 'video':
        grouped.videos.push(url)
        break
      case 'audio':
        grouped.audios.push(url)
        break
      case 'document':
        grouped.documents.push(url)
        break
      default:
        grouped.others.push(url)
        break
    }
  })

  return grouped
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

// 打开文件
const openFile = (url: string) => {
  window.open(url, '_blank')
}

// 下载文件
const downloadFile = (item: FileItem) => {
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
    // 使用新的文件名提取方法
    const fileName = getFileNameFromUrl(urls[0]) || item.fileName || 'download'
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else if (urls.length > 1) {
    // 多个文件逐一下载
    urls.forEach((url, index) => {
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = url
        // 使用新的文件名提取方法
        const fileName = getFileNameFromUrl(url) || `${item.fileName || 'file'}_${index + 1}`
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, index * 500) // 间隔500ms下载，避免浏览器阻止
    })
  }
}
</script>

<style lang="scss" scoped>
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

.file-preview {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 8px;
  max-width: 300px;
  min-width: 120px;
  border-radius: 6px;
}

.file-image-preview {
  .image-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .work-image {
    width: 64px;
    height: 64px;
    border-radius: 4px;

    &:only-child {
      width: 120px;
      height: 80px;
    }

    &:nth-child(1):nth-last-child(2),
    &:nth-child(2):nth-last-child(1) {
      width: 64px;
      height: 64px;
    }
  }
}

.file-video-preview {
  .video-gallery {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .work-video {
    width: 120px;
    height: 80px;
    border-radius: 4px;
  }
}

.file-icons-preview {
  .file-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-width: 100%;
  }

  .file-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    padding: 4px;
    cursor: pointer;
    background: #f5f5f5;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover {
      background: #e6f7ff;
      border-color: #1890ff;
    }

    .file-type-label {
      max-width: 100%;
      margin-top: 4px;
      overflow: hidden;
      font-size: 10px;
      color: #666;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &.document {
      .el-icon {
        color: #1890ff;
      }
    }

    &.audio {
      .el-icon {
        color: #52c41a;
      }
    }

    &.other {
      .el-icon {
        color: #722ed1;
      }
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

.file-types {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;

  .type-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    font-size: 11px;
    border-radius: 12px;

    .el-icon {
      font-size: 12px;
    }

    &.image {
      color: #1890ff;
      background: #e6f7ff;
      border: 1px solid #91d5ff;
    }

    &.video {
      color: #f759ab;
      background: #fff0f6;
      border: 1px solid #ffd6e7;
    }

    &.audio {
      color: #52c41a;
      background: #f6ffed;
      border: 1px solid #b7eb8f;
    }

    &.document {
      color: #fa8c16;
      background: #fff7e6;
      border: 1px solid #ffd591;
    }

    &.other {
      color: #722ed1;
      background: #f9f0ff;
      border: 1px solid #d3adf7;
    }
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
</style>
