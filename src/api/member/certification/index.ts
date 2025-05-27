import request from '@/config/axios'

// 设计师认证 VO
export interface CertificationVO {
  id: number // 唯一主键
  userId: number // 用户ID
  workExperience: number // 工作经验(年)
  designerGradeType: number // 设计师等级 见dict_type
  score: number // 评分
  designerStyleType: string // 擅长风格(多选逗号分隔)
  applyTime: Date // 申请认证时间
  certStatus: number // 认证状态(0待审核 1已通过 2已拒绝)
  orderStatus: number // 接单状态(0关闭 1开启 )
  profile: string // 个人简介
  certificates: string // 证书url(多选逗号分隔)
  checker: string // 审核人
}

// 设计师认证 API
export const CertificationApi = {
  // 查询设计师认证分页
  getCertificationPage: async (params: any) => {
    return await request.get({ url: `/member/certification/page`, params })
  },

  // 用户查看设计师主页简介
  getCertificationView: async (id: number) => {
    return await request.get({ url: `/member/certification/views?userId=` + id })
  },

  // 审核设计师信息
  checkCertification: async (data: any) => {
    return await request.post({ url: `/member/certification/check`, data })
  },

  //设置明星设计师排序
  recommendCertification: async (data: any) => {
    return await request.post({ url: `/member/certification/recommend`, data })
  },

  // 获得设计师认证信息
  getCertification: async (id: number) => {
    return await request.get({ url: `/member/certification/get?userId=` + id })
  },

}
