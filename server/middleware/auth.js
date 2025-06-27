import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问被拒绝，请提供有效的token'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'university_platform_secret')
    
    // 检查用户是否存在且处于激活状态
    const user = await User.findById(decoded.userId).select('-password')
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用'
      })
    }

    req.userId = decoded.userId
    req.user = user
    next()

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'token已过期，请重新登录'
      })
    }

    console.error('认证中间件错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
}

export default auth