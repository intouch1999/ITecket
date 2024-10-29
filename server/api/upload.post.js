// server/api/upload.post.js
import formidable from 'formidable'
import { join } from 'path'
import { mkdir, existsSync } from 'fs'
import { promisify } from 'util'

const mkdirAsync = promisify(mkdir)

export default defineEventHandler(async (event) => {
  const uploadDir = join(process.cwd(), 'public', 'uploads')
  
  // Ensure upload directory exists
  if (!existsSync(uploadDir)) {
    await mkdirAsync(uploadDir, { recursive: true })
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
    multiples: true,
    filename: (name, ext, part) => {
      return `${Date.now()}-${part.originalFilename}`
    }
  })

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    // Handle both single file and multiple files cases
    const fileArray = files.file ? (Array.isArray(files.file) ? files.file : [files.file]) : []
    
    const fileInfo = fileArray.map(file => ({
      fileName: file.newFilename,
      originalName: file.originalFilename,
      fileType: file.mimetype,
      fileSize: file.size,
      filePath: `/uploads/${file.newFilename}`
    }))

    return {
      status: 'success',
      data: fileInfo
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      status: 'error',
      message: error.message
    }
  }
})