import request from '@/config/axios'

// 用户合同 VO
export interface ContractVO {
  id: number // 合同ID
  userId: number // 用户ID
  designerId: number // 设计师ID
  appointmentId: number // 关联预约记录ID
  contractNo: string // 合同编号
  contractName: string // 合同名称
  contractType: number // 合同类型 见dict_type
  memberContractStatus: boolean // 设计合同审核状态 见dict_type
  projectAddress: string // 工程地址
  communityName: string // 小区名称
  builtArea: number // 建筑面积(㎡)
  measuredArea: number // 实测外框面积(㎡)
  totalAmount: number // 合同总金额(元)
  price: number // 单价
  paidAmount: number // 已支付金额(元)
  footnote: string // 补充说明
  designPeriod: number // 设计周期(天数)
  confirmTime: Date // 确认时间
  attachmentUrl: string // 合同附件URL
  checker: string // 审核人
  startTime: Date // 合同开始时间
  endTime: Date // 合同结束时间
  caseShowAmount:number,
  covers:string
  memberContractConfirmStatus: number // 设计合同用户确认状态 见dict_type
}

// 合同审核 VO
export interface ContractCheckVO {
  id: number // 合同ID
  memberContractStatus: number // 合同审核状态见dict
  rejectReason?: string // 驳回原因
}
/**
 * AppNodeConfigRespVO，用户 APP - 合同节点配置 Response VO
 */
export type AppNodeConfigRes = {
  /**
   * 工作成果要求
   */
  deliverableRequirements?: string
  /**
   * 设计师可结算比例
   */
  designerSettlementRatio: number
  /**
   * 节点所有文件Ids
   */
  fileIds: string
  /**
   * 节点ID
   */
  id: number
  /**
   * 节点状态是否完成 0否1是
   */
  isComplete: number
  /**
   * 上传工作成果照片 0否1是
   */
  needRequirements: number
  /**
   * 节点说明
   */
  nodeDescription?: string
  /**
   * 节点图标标识
   */
  nodeIcon?: string
  /**
   * 节点名称
   */
  nodeName: string
  /**
   * 是否可付款(0否 1是)
   */
  payable: number
  /**
   * 节点排序
   */
  sortOrder: number
  /**
   * 用户可付款比例
   */
  userPaymentRatio: number
  [property: string]: any
}

// 用户合同 API
export const ContractApi = {
  // 查询用户合同分页
  getContractPage: async (params: any) => {
    return await request.get({ url: `/member/contract/page`, params })
  },

  // 获得合同节点列表
  getContractNodeList: async (id: number) => {
    return await request.get<AppNodeConfigRes[]>({ url: `/member/contract/nodeList?id=` + id })
  },

  // 查询用户合同详情
  getContract: async (id: number) => {
    return await request.get({ url: `/member/contract/get?id=` + id })
  },

  // 获得合同工作成果列表
  getWorkFilePage: async (params: any) => {
    return await request.get({ url: `/member/work-file/list`, params })
  },

  // 审核合同
  checkContract: async (data: ContractCheckVO) => {
    return await request.post({ url: `/member/contract/check`, data })
  },

  //设置推荐案例
  recommendContract: async (data: any) => {
    return await request.put({ url: `/member/contract/recommend`, data })
  },
  // 查询施工合同分页
  getConstructionPage: async (params: any) => {
    return await request.get({ url: `/member/contract-construction/page`, params })
  },

  // 创建施工合同
  createConstruction: async (data: ContractCheckVO) => {
    return await request.post({ url: `/member/contract-construction/create`, data })
  },

  // 获得施工合同详情
  getConstruction: async (id: number) => {
    return await request.get({ url: `/member/contract-construction/get?id=` + id })
  },
}
