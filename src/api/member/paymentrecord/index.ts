import request from '@/config/axios'

// 设计师发起支付记录 VO
export interface PaymentRecordVO {
  id: number // 唯一主键
  userId: number // 用户ID
  designerId: number // 设计师ID
  appointmentId: number // 关联用户预约设计师ID
  contractId: number // 合同ID
  nodeId: number // 合同节点ID
  type: boolean // 类型：1 量房定金申请， 2 合同付款申请 3 设计费结算申请
  amount: number // 定金金额(元)
  orderId: number // 支付订单id
}
/**
 * CommissionBatchPaymentSaveReqVO，用户 APP - 设计师发起支付记录新增/修改 Request VO
 */
export type CommissionBatchPaymentSaveReq = {
  /**
   * 结算金额(元)
   */
  amount: number
  /**
   * 佣金记录ID
   */
  ids?: number[]
  /**
   * 支付凭证
   */
  paymentVoucher: string
  [property: string]: any
}

export type CommissionRecordReq = {
  /**
   * 合同名称
   */
  contractName?: string
  /**
   * 被邀请人手机号
   */
  inviteeMobile?: string
  /**
   * 被邀请人名称
   */
  inviteeName?: string
  /**
   * 邀请人手机号
   */
  inviterMobile?: string
  /**
   * 邀请人名称
   */
  inviterName?: string
  /**
   * 页码，从 1 开始
   */
  pageNo: number
  /**
   * 每页条数，最大值为 100
   */
  pageSize: number
  /**
   * 支付时间
   */
  payTime?: Date[]
  /**
   * 结算批次号
   */
  settlementBatchNo?: string
  /**
   * 结算状态：0-待结算 1-已结算 2-已取消
   */
  settlementStatus?: number
  /**
   * 结算时间
   */
  settlementTime?: Date[]
  [property: string]: any
}

/**
 * PageResultCommissionRecordRespVO，分页结果
 */
export type PageResultCommissionRecordRespVO = {
  /**
   * 数据
   */
  list: CommissionRecordRes[]
  /**
   * 总量
   */
  total: number
  [property: string]: any
}

/**
 * CommissionRecordRespVO，用户 APP - 佣金记录 Response VO
 */
export type CommissionRecordRes = {
  /**
   * 业务ID
   */
  businessId?: number
  /**
   * 业务类型
   */
  businessType?: string
  /**
   * 审核人
   */
  checker?: string
  /**
   * 审核时间
   */
  checkTime?: Date
  /**
   * 佣金金额
   */
  commissionAmount: number
  /**
   * 佣金比例
   */
  commissionRate: number
  /**
   * 佣金类型：见字典
   */
  commissionType: number
  /**
   * 合同名称
   */
  contractName?: string
  /**
   * 创建时间
   */
  createTime: Date
  /**
   * 主键ID
   */
  id: number
  /**
   * 被邀请人名称
   */
  inviteeName?: string
  /**
   * 邀请人名称
   */
  inviterName?: string
  /**
   * 支付凭证
   */
  paymentVoucher?: string
  /**
   * 支付时间
   */
  payTime: Date
  /**
   * 结算批次号
   */
  settlementBatchNo?: string
  /**
   * 结算状态：0-待结算 1-已结算 2-已取消
   */
  settlementStatus: number
  /**
   * 结算状态：0-待结算 1-已发起结算 2-已取消
   */
  settlementStatusDesc: string
  /**
   * 结算时间
   */
  settlementTime?: Date
  /**
   * 来源金额
   */
  sourceAmount: number
  [property: string]: any
}

// 设计师发起支付记录 API
export const PaymentRecordApi = {
  // 查询设计师发起支付记录分页
  getPaymentRecordPage: async (params: any) => {
    return await request.get({ url: `/member/payment-record/page`, params })
  },

  // 审核用户订单
  checkUserOrder: async (id: number) => {
    return await request.put({ url: `/member/payment-record/checkCustomerOrder`, data: { id } })
  },

  // 支付设计师结算
  settlementPayment: async (params: any) => {
    return await request.post({ url: `/member/payment-record/settlement`, data: params })
  },

  // 查询设计师发起支付记录分页
  getCommissionRecordPage: async (params: CommissionRecordReq) => {
    return await request.get<PageResultCommissionRecordRespVO>({
      url: `/member/commission-record/page`,
      params
    })
  },

  // 支付设计师结算
  commissionRecordPayment: async (params: CommissionBatchPaymentSaveReq) => {
    return await request.post({ url: `/member/commission-record/payment`, data: params })
  }
}
