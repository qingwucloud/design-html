import request from '@/config/axios'


// 提现列表
export const getUserWithdrawalList = async (params) => {
  return await request.get({ url: `/member/memberView/withdrawalList`, params })
}

// 合同付款列表
export const getUserPaymentRecordList = async (params) => {
  return await request.get({ url: `/member/memberView/payment-record`, params })
}

// 团队列表
export const getUserInviteList = async (params) => {
  return await request.get({ url: `/member/memberView/inviteList`, params })
}

// 收入列表
export const getUserIncomeList = async (params) => {
  return await request.get({ url: `/member/memberView/incomeList`, params })
}

// 合同列表
export const getUserContractList = async (params) => {
  return await request.get({ url: `/member/memberView/contractList`, params })
}

// 预约列表
export const getUserAppointmentList = async (params) => {
  return await request.get({ url: `/member/memberView/appointmentList`, params })
}
