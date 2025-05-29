import request from '@/config/axios'

export interface CommentVO {
  id: number
  userId: number
  userNickname: string
  userAvatar: string
  anonymous: boolean
  orderId: number
  orderItemId: number
  spuId: number
  spuName: string
  skuId: number
  visible: boolean
  scores: number
  descriptionScores: number
  benefitScores: number
  content: string
  picUrls: string
  replyStatus: boolean
  replyUserId: number
  replyContent: string
  replyTime: Date
}

// 查询商品评论列表
export const getCommentPage = async (params) => {
  return await request.get({ url: `/customer/comment/page`, params })
}

// 添加自评
export const createComment = async (data: CommentVO) => {
  return await request.post({ url: `/customer/comment/create`, data })
}

// 显示 / 隐藏评论
export const updateCommentVisible = async (data: any) => {
  return await request.put({ url: `/customer/comment/update-visible`, data })
}

// // 商家回复
// export const replyComment = async (data: any) => {
//   return await request.put({ url: `/product/comment/reply`, data })
// }
