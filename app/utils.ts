/**
 * 将 MIME 类型转换为文件后缀名（不带点）
 * @param mimeType 输入的 MIME 类型字符串，例如 'image/jpeg'
 * @returns 文件后缀名，例如 'jpg'；未知类型默认返回空字符串
 */
export function mimeTypeToExtension(mimeType: string) {
  // 常见 MIME 类型映射表（可根据需求扩展）
  const mimeToExtensionMap: { [mimeType: string]: string } = {
    // 图片
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    // 文档
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'text/plain': 'txt',
    'text/csv': 'csv',
    'text/html': 'html',
    // 音频
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    // 视频
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/ogg': 'ogv',
    // 压缩文件
    'application/zip': 'zip',
    'application/x-rar-compressed': 'rar',
    'application/x-tar': 'tar',
    'application/gzip': 'gz',
    // 其他
    'application/json': 'json',
    'application/octet-stream': 'bin' // 默认二进制流
  }

  // 处理带参数的 MIME 类型（如 'text/plain;charset=UTF-8'）
  const normalizedMimeType = mimeType.toLowerCase().split(';')[0].trim()

  // 查找映射表或返回空字符串
  return mimeToExtensionMap[normalizedMimeType] || ''
}