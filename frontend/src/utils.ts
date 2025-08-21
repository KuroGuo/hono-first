export function floor(num: number | bigint | string, decimal: number) {
  // 将输入转为字符串
  const strNum = num.toString()

  // 计算乘数，用于将小数移动到整数位
  const multiplier = Math.pow(10, decimal)

  // 处理可能的科学计数法表示
  if (strNum.includes('e')) {
    // 对于科学计数法，先转换为 number 再处理
    const floored = Math.floor(Number(strNum) * multiplier) / multiplier
    return parseFloat(floored.toFixed(decimal))
  }

  if (strNum.includes('.')) {
    const [intPart, decPart] = strNum.split('.')
    // 如果小数位数不足要求的位数，直接返回
    if (decPart.length <= decimal) return Number(strNum)
    // 截取到指定小数位
    return Number(intPart + '.' + decPart.substring(0, decimal))
  }

  // 整数情况
  return Number(strNum)
}

export function ceil(num: number | bigint | string, decimal: number) {
  // 将输入转为字符串
  const strNum = num.toString()

  // 计算乘数，用于将小数移动到整数位
  const multiplier = Math.pow(10, decimal)

  // 处理可能的科学计数法表示
  if (strNum.includes('e')) {
    // 对于科学计数法，先转换为 number 再处理
    const ceiled = Math.ceil(Number(strNum) * multiplier) / multiplier
    return parseFloat(ceiled.toFixed(decimal))
  }

  if (strNum.includes('.')) {
    const [intPart, decPart] = strNum.split('.')
    // 如果小数位数不足要求的位数，直接返回
    if (decPart.length <= decimal) return Number(strNum)
    // 检查是否需要进位
    const shouldRoundUp = decPart.length > decimal && decPart.charAt(decimal) !== '0'
    // 截取到指定小数位
    let result = intPart + '.' + decPart.substring(0, decimal)
    // 如果需要进位
    if (shouldRoundUp) {
      // 将截取后的数值加上一个最小单位
      result = (Number(result) + Math.pow(10, -decimal)).toFixed(decimal)
    }
    return Number(result)
  }

  // 整数情况
  return Number(strNum)
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的字符串
 * @returns Promise 包含操作结果的对象
 */
export async function copyToClipboard(text: string): Promise<{ success: boolean; error?: Error }> {
  try {
    // 现代浏览器 Clipboard API
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return { success: true }
    }

    // 兼容旧浏览器的备用方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed' // 防止滚动
    textArea.style.opacity = '0' // 透明但可操作

    document.body.appendChild(textArea)
    textArea.select()

    // 执行复制命令
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)

    if (!success) {
      throw new Error('复制操作被拒绝')
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('未知错误')
    }
  }
}

export function retry<T>(
  promiseFn: () => Promise<T>,
  retries: number = 10000,
  test?: (err: Error, triedCount: number) => boolean
): Promise<T> {
  let retriedCount = 0
  const retryFunc = async function (): Promise<T> {
    try {
      return await new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('超时')), 8000)
        promiseFn().then(resolve).catch(reject).finally(() => clearTimeout(timeout))
      })
    } catch (err) {
      if (retries <= 1 || test?.(err as Error, retriedCount) === false) throw err
      console.log('重试', retries, err)
      await new Promise(resolve => setTimeout(resolve, 1000))
      retriedCount++
      retries--
      return retryFunc()
    }
  }
  return retryFunc()
}

export function newUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}
export function isIOS() {
  return /iPad|iPhone|iPod|iOS/.test(navigator.userAgent);
}