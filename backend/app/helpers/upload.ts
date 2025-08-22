import path from 'path'
import { promises as fs } from 'fs'
import { v7 as uuidv7 } from 'uuid'
import { mimeTypeToExtension } from '../utils.js'
import logger from '../logger.js'
import { isDev } from '../config.js'
import type { CommonTranslationKeys } from '../translate.js'
import { HTTPError, text } from '../translate.js'

const dirName = 'uploads'

const uploadConfig = {
  maxFileSize: 5 * 1024 * 1024,
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'text/plain'
  ],
  uploadDir: `${isDev ? 'dist/' : ''}public/${dirName}`
}

export async function saveFile(file: File | null | undefined) {
  await ensureUploadsDir()

  if (!file || !file.size) {
    throw new HTTPError(400, { text: '未收到文件' })
  }

  if (file.size > uploadConfig.maxFileSize) {
    throw new HTTPError(413, {
      text: text('文件大小超过限制 (最大 %0MB)', uploadConfig.maxFileSize / 1024 / 1024)
    })
  }

  if (!uploadConfig.allowedMimeTypes.includes(file.type)) {
    throw new HTTPError(415, {
      text: text(`不支持的文件类型: %0`, file.type)
    })
  }

  try {
    const ext = `.${mimeTypeToExtension(file.type) || 'bin'}`
    const fileName = `${uuidv7()}${ext}`
    const filePath = path.join(uploadConfig.uploadDir, fileName)

    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()))

    return {
      originalName: file.name,
      savedName: fileName,
      size: file.size,
      type: file.type,
      path: `/${dirName}/${fileName}`
    }
  } catch (err: unknown) {
    logger.error('文件保存失败', err)
    throw new HTTPError(500, {
      text: ((err as Error)?.message || (err as string)?.toString()) as CommonTranslationKeys
    })
  }
}

async function ensureUploadsDir() {
  try {
    await fs.access(uploadConfig.uploadDir)
  } catch {
    await fs.mkdir(uploadConfig.uploadDir, { recursive: true })
  }
}

// 文件上传路由
/*
app.post('/upload', async (c) => {
  const result = await handleFileUpload(c, 'file')

  if (result.error) {
    return c.text(result.error, result.status || 400)
  }

  return c.json({
    message: '文件上传成功',
    fileInfo: {
      originalName: result.originalName,
      savedName: result.savedName,
      size: result.size,
      type: result.type,
      path: result.path
    }
  })
})
*/