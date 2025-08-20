import path from 'path'
import { promises as fs } from 'fs'
import type { Context } from 'hono'
import { v4 as uuidv4 } from 'uuid'
import { HTTPException } from 'hono/http-exception'
import { mimeTypeToExtension } from '../utils.js'
import logger from '../logger.js'

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
  uploadDir: 'public/uploads'
}

export async function handleFileUpload(c: Context, fieldName: string) {
  await ensureUploadsDir()

  const formData = c.get('formData')
  const file = formData?.get(fieldName) as File | null | undefined

  if (!file || !file.size) {
    throw new HTTPException(400, { message: '未收到文件' })
  }

  if (file.size > uploadConfig.maxFileSize) {
    throw new HTTPException(413, {
      message: `文件大小超过限制 (最大 ${uploadConfig.maxFileSize / 1024 / 1024}MB)`
    })
  }

  if (!uploadConfig.allowedMimeTypes.includes(file.type)) {
    throw new HTTPException(415, {
      message: `不支持的文件类型: ${file.type}`
    })
  }

  try {
    const ext = mimeTypeToExtension(file.type) || '.bin'
    const fileName = `${uuidv4()}${ext}`
    const filePath = path.join(uploadConfig.uploadDir, fileName)

    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()))

    return {
      originalName: file.name,
      savedName: fileName,
      size: file.size,
      type: file.type,
      path: filePath
    }
  } catch (err: unknown) {
    logger.error('文件保存失败', err)
    throw new HTTPException(500, {
      message: (err as Error)?.message || (err as string)?.toString()
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