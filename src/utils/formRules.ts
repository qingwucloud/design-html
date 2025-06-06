const { t } = useI18n()

// 必填项
export const required = {
  required: true,
  message: t('common.required')
}
/**
 * 验证富文本字数
 * @param rule
 * @param value
 * @param callback
 * @param len 限制字数
 */
export function validateCountWords(_rule: any, value: any, callback: any, len: any) {
  if (!value) {
    return callback(new Error(`不能为空`))
  }

  // 检查富文本是否只包含图片
  const hasImgTag = /<img[^>]*>/i.test(value)
  const textWithoutTags = (value || '').replace(/<[^>]*>?/gm, '').trim()

  // 如果只有图片标签但没有文本内容
  if (hasImgTag && !textWithoutTags) {
    return callback() // 包含图片就通过验证
  }

  // 正常验证文本字数
  const count = textWithoutTags.length
  if (!textWithoutTags) {
    return callback(new Error(`不能为空`))
  }

  if (count > len) {
    return callback(new Error(`字数不得超过${len}`))
  } else {
    return callback()
  }
}

/**
 * 处理HTML内容中的图片标签，添加样式限制最大宽度
 * @param content HTML内容
 * @returns 处理后的HTML内容
 */
export const processImgTags = (content: string): string => {
  return content.replace(/<img\s+([^>]*)src="([^"]+)"([^>]*)>/g, (match, before, src, after) => {
    // 检查是否已有style属性
    if (match.includes('style=')) {
      // 如果已有style属性，确保包含最大宽度限制
      return match.replace(/style="([^"]*)"/g, (styleMatch, styleContent) => {
        if (!styleContent.includes('max-width')) {
          return `style="${styleContent}max-width:100%;display:block;"`
        }
        return styleMatch
      })
    } else {
      // 如果没有style属性，添加新的style属性
      return `<img ${before}src="${src}"${after} style="max-width:100%;display:block;">`
    }
  })
}
