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
  const text = (value || '').replace(/<[^>]*>?/gm, '');
  const count = text.length;
  if (!text)   callback(new Error(`不能为空`))
  if (count > len) {
    callback(new Error(`字数不得超过了${len}`))
  } else {
    return callback()
  }
}

