import request from '@/config/axios'

// 用户预约设计师 VO
export interface DesignerAppointmentVO {
  id: number // 唯一主键
  userId: number // 用户ID
  designerId: number // 预约设计师ID
  assignedDesignerId: number // 运营指派设计师ID
  designerAppointmentStatus: boolean // 用户预约设计师状态(见dict_type)
  portfolioId: number // 关联作品集ID
  memberRemark: string // 用户备注
  checker: string // 运营指派者
}

// 用户预约设计师 API
export const DesignerAppointmentApi = {
  // 查询用户预约设计师分页
  getDesignerAppointmentPage: async (params: any) => {
    return await request.get({ url: `/member/designer-appointment/page`, params })
  },

  // 查询用户预约设计师详情
  getDesignerAppointment: async (id: number) => {
    return await request.get({ url: `/member/designer-appointment/get?id=` + id })
  },

  // 新增用户预约设计师
  createDesignerAppointment: async (data: DesignerAppointmentVO) => {
    return await request.post({ url: `/member/designer-appointment/create`, data })
  },

  // 修改用户预约设计师
  updateDesignerAppointment: async (data: DesignerAppointmentVO) => {
    return await request.put({ url: `/member/designer-appointment/update`, data })
  },

  // 删除用户预约设计师
  deleteDesignerAppointment: async (id: number) => {
    return await request.delete({ url: `/member/designer-appointment/delete?id=` + id })
  },

  // 导出用户预约设计师 Excel
  exportDesignerAppointment: async (params) => {
    return await request.download({ url: `/member/designer-appointment/export-excel`, params })
  }
}