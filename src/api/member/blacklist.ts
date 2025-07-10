import request from '@/config/axios'

export interface BlacklistVO {
  id: number
  userId: number
  name: string
  mobile: string
  avatar?: string
  userType: string
  createTime: string
  operator: string
  remark?: string
}

export interface BlacklistPageReqVO extends PageParam {
  name?: string
  mobile?: string
  createTime?: string[]
  userType?: string
}

// 查询黑名单分页
export const getBlacklistPage = (params: BlacklistPageReqVO) => {
  return request.get({ url: '/member/blacklist/page', params })
}

// 查询黑名单详情
export const getBlacklist = (id: number) => {
  return request.get({ url: '/member/blacklist/get?id=' + id })
}

// 新增黑名单
export const createBlacklist = (data: BlacklistVO) => {
  return request.post({ url: '/member/blacklist/create', data })
}

// 修改黑名单
export const updateBlacklist = (data: BlacklistVO) => {
  return request.put({ url: '/member/blacklist/update', data })
}

// 删除黑名单
export const deleteBlacklist = (id: number) => {
  return request.delete({ url: '/member/blacklist/delete?id=' + id })
}

// 导出黑名单 Excel
export const exportBlacklist = (params) => {
  return request.download({ url: '/member/blacklist/export-excel', params })
}

// 加入黑名单
export const addToBlacklist = (data: { userId: number; remark?: string }) => {
  return request.post({ url: '/member/blacklist/add', data })
}

// 从黑名单中移除
export const removeFromBlacklist = (data: { userId: number }) => {
  return request.post({ url: '/member/blacklist/remove', data })
}
