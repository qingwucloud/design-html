import request from '@/config/axios'

// 钱包 API
export const WalletRecordApi = {
  // 收入记录
  getIncomeRecordPage: async (params: any) => {
    return await request.get<any>({
      url: `/member/commission/userIncomeList`,
      params
    })
  },
  // 提现记录
  getWithdrawalRecordPage: async (params: any) => {
    return await request.get<any>({
      url: `/member/commission/withdrawalList`,
      params
    })
  },

  // 审核用户提现
  checkWithdrawal: async (params: any) => {
    return await request.post({ url: `/member/commission/checkWithdrawal`, data: params })
  },

  // 获得用户佣金余额
  getUserCommissionBalance: async (params: any) => {
    return await request.get({ url: `/member/commission/get`, params })
  },

  // 余额调整
  adjustBalance: async (params: any) => {
    return await request.post({ url: `/member/commission/adjust-balance`, data: params })
  }
}
