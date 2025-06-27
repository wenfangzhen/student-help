import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import universitiesRoutes from './routes/universities.js'
import majorsRoutes from './routes/majors.js'
import postsRoutes from './routes/posts.js'
import usersRoutes from './routes/users.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 连接MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ 数据库连接成功')
})
.catch((error) => {
  console.error('❌ 数据库连接失败:', error)
})

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/universities', universitiesRoutes)
app.use('/api/majors', majorsRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/users', usersRoutes)

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '高校信息平台API服务正常运行',
    timestamp: new Date().toISOString() 
  })
})

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error)
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
})

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`)
  console.log(`📝 API文档: http://localhost:${PORT}/health`)
})