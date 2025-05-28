<template>
  <div v-loading="loading">
    <el-card>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="info">
          <template #title>
            <CardTitle title="合同信息" />
          </template>
          <div class="contract-details">
            <div class="detail-item">
              <div class="detail-label">合同编号:</div>
              <div class="detail-value">{{ contractData?.contractNo || '' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">合同状态:</div>
              <div class="detail-value">
                <DictTag
                  :type="DICT_TYPE.MEMBER_CONTRACT_STATUS"
                  :value="contractData?.memberContractStatus"
                />
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-label">客户姓名:</div>
              <div class="detail-value">{{ contractData?.customerName || '' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">客户手机号:</div>
              <div class="detail-value">{{ contractData?.customerMobile || '' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">设计师名称:</div>
              <div class="detail-value">{{ contractData?.designerName || '' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">工程地址:</div>
              <div class="detail-value">{{ contractData?.projectAddress || '' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">建筑面积:</div>
              <div class="detail-value">{{ contractData?.builtArea || '' }}㎡</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">实测外框面积:</div>
              <div class="detail-value">{{ contractData?.measuredArea || '' }}㎡</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">审核人:</div>
              <div class="detail-value">{{ contractData?.checker || '' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">合同周期:</div>
              <div class="detail-value">
                {{ formatDate(contractData?.startTime, 'YYYY-MM-DD') }} -
                {{ formatDate(contractData?.endTime, 'YYYY-MM-DD') }}
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-label">合同总金额:</div>
              <div class="detail-value">¥{{ contractData?.totalAmount || 0 }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">已支付金额:</div>
              <div class="detail-value">¥{{ contractData?.paidAmount || 0 }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">补充说明:</div>
              <div class="detail-value">{{ contractData?.footnote || '' }}</div>
            </div>

            <!-- 附件展示 -->
            <div class="detail-item attachment-item" v-if="contractData?.attachmentUrl">
              <div class="detail-label">合同附件:</div>
              <div class="attachment-container">
                <div class="flex gap-10px">
                  <el-image
                    :key="item"
                    disabled
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
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>
<script  setup>
import { CardTitle } from '@/components/Card'
import { ContractApi } from '@/api/member/contract'
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
onMounted(async () => {
  contractData.value = await ContractApi.getContract(route.params.id)
  parseAttachments(contractData.value.attachmentUrl)
  console.log(contractData.value)
})

// 解析附件URL
const parseAttachments = (url)=>{
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
<style lang="css" scoped></style>
