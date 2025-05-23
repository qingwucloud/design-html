import request from '@/config/axios'

// 设计师作品集 VO
export interface PortfolioVO {
  id: number // 作品集ID
  userId: number // 用户ID
  communityName: string // 小区名称
  totalMoney: number // 总造价金额
  title: string // 作品标题
  status: boolean // 审核状态 0未审核 1已审核
  coverUrl: string // 主图URL
  portfolioHouseType: boolean // 户型字典
  area: number // 面积(㎡)
  privoce: number // 省代码
  city: number // 市代码
  region: number // 区代码
  address: string // 详细地址
  portfolioTagType: string // 作品标签类型(逗号分隔)
  designerStyleType: string // 作品风格类型(逗号分隔)
  content: string // 富文本内容
  viewCount: number // 浏览次数
  likeCount: number // 点赞次数
  sortNum: number // 置顶优先级排序
  checker: string // 审核人
}

// 设计师作品集 API
export const PortfolioApi = {
  // 查询设计师作品集分页
  getPortfolioPage: async (params: any) => {
    return await request.get({ url: `/member/portfolio/page`, params })
  },

  // 查询设计师作品集详情
  getPortfolio: async (id: number) => {
    return await request.get({ url: `/member/portfolio/get?id=` + id })
  },

  // 新增设计师作品集
  createPortfolio: async (data: PortfolioVO) => {
    return await request.post({ url: `/member/portfolio/create`, data })
  },

  // 修改设计师作品集
  updatePortfolio: async (data: PortfolioVO) => {
    return await request.put({ url: `/member/portfolio/update`, data })
  },

  // 删除设计师作品集
  deletePortfolio: async (id: number) => {
    return await request.delete({ url: `/member/portfolio/delete?id=` + id })
  },

  // 导出设计师作品集 Excel
  exportPortfolio: async (params) => {
    return await request.download({ url: `/member/portfolio/export-excel`, params })
  }
}