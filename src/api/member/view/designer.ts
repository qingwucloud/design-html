import request from '@/config/axios'


// 提现列表
export const getDesignerWithdrawalList = async (params) => {
  return await request.get({ url: `/member/designerView/withdrawalList`, params })
}

// 作品集列表
export const getDesignerPortfolioList = async (params) => {
  return await request.get({ url: `/member/designerView/portfolioList`, params })
}

// 团队列表
export const getDesignerInviteList = async (params) => {
  return await request.get({ url: `/member/designerView/inviteList`, params })
}

// 收入列表
export const getDesignerIncomeList = async (params) => {
  return await request.get({ url: `/member/designerView/incomeList`, params })
}

// 合同列表
export const getDesignerContractList = async (params) => {
  return await request.get({ url: `/member/designerView/contractList`, params })
}

// 评论列表
export const getDesignerCommentList = async (params) => {
  return await request.get({ url: `/member/designerView/commentList`, params })
}

// 预约列表
export const getDesignerAppointmentList = async (params) => {
  return await request.get({ url: `/member/designerView/appointmentList`, params })
}
