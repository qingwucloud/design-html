/**
 * 通用剪贴板复制工具
 * 兼容 HTTPS 和非 HTTPS 环境
 */

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 复制是否成功
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) {
    return false
  }

  // 优先使用现代 Clipboard API (需要 HTTPS 环境)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.warn('Clipboard API 复制失败，降级到传统方式:', error)
      // 降级到传统方式
      return fallbackCopyTextToClipboard(text)
    }
  }

  // 传统复制方式 (兼容非 HTTPS 环境)
  return fallbackCopyTextToClipboard(text)
}

/**
 * 传统复制方式 (兼容非 HTTPS 环境)
 * @param text 要复制的文本
 * @returns boolean 复制是否成功
 */
function fallbackCopyTextToClipboard(text: string): boolean {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // 避免在页面上显示textarea
  textArea.style.position = 'fixed'
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.width = '2em'
  textArea.style.height = '2em'
  textArea.style.padding = '0'
  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'
  textArea.style.background = 'transparent'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  let successful = false
  try {
    successful = document.execCommand('copy')
  } catch (err) {
    console.error('传统复制方式失败:', err)
  }

  document.body.removeChild(textArea)
  return successful
}

/**
 * 复制银行信息到剪贴板
 * @param bankInfo 银行信息对象
 * @param message 消息提示对象
 */
export const copyBankInfo = async (bankInfo: any) => {
  const message = useMessage() // 消息弹窗
  try {
    const info = [
      `账户名称：${bankInfo.bankAccountName || ''}`,
      `银行名称：${bankInfo.bankName || ''}`,
      `银行卡号：${bankInfo.bankNumber || ''}`,
      `银行渠道：${bankInfo.bankChanel || ''}`,
      `银行预留手机：${bankInfo.bankMobile || ''}`
    ].join('\n')

    const success = await copyToClipboard(info)
    if (success) {
      message.success('银行信息已复制到剪贴板')
    } else {
      message.error('复制失败，请手动复制')
    }
  } catch (error) {
    console.error('复制银行信息失败:', error)
    message.error('复制失败，请手动复制')
  }
}

/**
 * 复制文本并显示提示
 * @param text 要复制的文本
 * @param message 消息提示对象
 * @param successMsg 成功提示信息
 * @param errorMsg 失败提示信息
 */
export const copyTextWithMessage = async (
  text: string,
  message: any,
  successMsg: string = '复制成功',
  errorMsg: string = '复制失败'
) => {
  try {
    const success = await copyToClipboard(text)
    if (success) {
      message.success(successMsg)
    } else {
      message.error(errorMsg)
    }
  } catch (error) {
    console.error('复制失败:', error)
    message.error(errorMsg)
  }
}
