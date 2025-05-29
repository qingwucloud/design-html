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

// 设计师发起支付记录 API
export const PaymentRecordApi = {
  // 查询设计师发起支付记录分页
  getPaymentRecordPage: async (params: any) => {
    return await request.get({ url: `/member/payment-record/page`, params })
  },

  // 查询设计师发起支付记录详情
  getPaymentRecord: async (id: number) => {
    return await request.get({ url: `/member/payment-record/get?id=` + id })
  },

  // 新增设计师发起支付记录
  createPaymentRecord: async (data: PaymentRecordVO) => {
    return await request.post({ url: `/member/payment-record/create`, data })
  },

  // 修改设计师发起支付记录
  updatePaymentRecord: async (data: PaymentRecordVO) => {
    return await request.put({ url: `/member/payment-record/update`, data })
  },

  // 删除设计师发起支付记录
  deletePaymentRecord: async (id: number) => {
    return await request.delete({ url: `/member/payment-record/delete?id=` + id })
  },

  // 导出设计师发起支付记录 Excel
  exportPaymentRecord: async (params) => {
    return await request.download({ url: `/member/payment-record/export-excel`, params })
  }
}