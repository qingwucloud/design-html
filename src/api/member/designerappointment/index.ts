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

  // 指派设计师
  assignedDesignerAppointment: async (params:any) => {
    return await request.post({ url: `/member/designer-appointment/assigned`,params })
  },

}
