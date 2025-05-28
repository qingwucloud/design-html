import request from '@/config/axios'

// 用户合同 VO
export interface ContractVO {
  id: number // 合同ID
  userId: number // 用户ID
  designerId: number // 设计师ID
  appointmentId: number // 关联预约记录ID
  contractNo: string // 合同编号
  contractName: string // 合同名称
  memberContractStatus: boolean // 设计合同审核状态 见dict_type
  projectAddress: string // 工程地址
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
  memberContractConfirmStatus: number // 设计合同用户确认状态 见dict_type
}

// 用户合同 API
export const ContractApi = {
  // 查询用户合同分页
  getContractPage: async (params: any) => {
    return await request.get({ url: `/member/contract/page`, params })
  },

  // 获得合同节点列表
  getContractNodeList: async (id: number) => {
    return await request.get({ url: `/member/contract/nodeList?id=` + id  })
  },

  // 查询用户合同详情
  getContract: async (id: number) => {
    return await request.get({ url: `/member/contract/get?id=` + id })
  },

  // 审核合同
  checkContract: async (data: ContractVO) => {
    return await request.post({ url: `/member/contract/check`, data })
  },

  // 新增用户合同
  // createContract: async (data: ContractVO) => {
  //   return await request.post({ url: `/member/contract/create`, data })
  // },

  // 修改用户合同
  // updateContract: async (data: ContractVO) => {
  //   return await request.put({ url: `/member/contract/update`, data })
  // },

  // // 删除用户合同
  // deleteContract: async (id: number) => {
  //   return await request.delete({ url: `/member/contract/delete?id=` + id })
  // },
  //
  // // 导出用户合同 Excel
  // exportContract: async (params) => {
  //   return await request.download({ url: `/member/contract/export-excel`, params })
  // }
}
