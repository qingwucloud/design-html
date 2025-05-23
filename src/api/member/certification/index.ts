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

  // 查询设计师认证详情
  getCertification: async (id: number) => {
    return await request.get({ url: `/member/certification/get?id=` + id })
  },

  // 新增设计师认证
  createCertification: async (data: CertificationVO) => {
    return await request.post({ url: `/member/certification/create`, data })
  },

  // 修改设计师认证
  updateCertification: async (data: CertificationVO) => {
    return await request.put({ url: `/member/certification/update`, data })
  },

  // 删除设计师认证
  deleteCertification: async (id: number) => {
    return await request.delete({ url: `/member/certification/delete?id=` + id })
  },

  // 导出设计师认证 Excel
  exportCertification: async (params) => {
    return await request.download({ url: `/member/certification/export-excel`, params })
  }
}