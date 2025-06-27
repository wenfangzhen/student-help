import express from 'express'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// 注册验证规则
const registerSchema = Joi.object({
  username: Joi.string().min(2).max(20).required().messages({
    'string.min': '用户名至少2个字符',
    'string.max': '用户名最多20个字符',
    'any.required': '用户名必填'
  }),
  email: Joi.string().email().required().messages({
    'string.email': '请输入有效的邮箱地址',
    'any.required': '邮箱必填'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': '密码至少6个字符',
    'any.required': '密码必填'
  })
})

// 登录验证规则
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '请输入有效的邮箱地址',
    'any.required': '邮箱必填'
  }),
  password: Joi.string().required().messages({
    'any.required': '密码必填'
  })
})

// 生成JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'university_platform_secret',
    { expiresIn: '30d' }
  )
}

// 用户注册
router.post('/register', async (req, res) => {
  try {
    // 数据验证
    const { error, value } = registerSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }

    const { username, email, password } = value

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? '邮箱已被注册' : '用户名已被使用'
      })
    }

    // 创建新用户
    const user = new User({
      username,
      email,
      password
    })

    await user.save()

    // 生成token
    const token = generateToken(user._id)

    // 返回用户信息（不包含密码）
    const userResponse = user.toObject()
    delete userResponse.password

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: userResponse,
        token
      }
    })

  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 用户登录
router.post('/login', async (req, res) => {
  try {
    // 数据验证
    const { error, value } = loginSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      })
    }

    const { email, password } = value

    // 查找用户
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      })
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      })
    }

    // 检查用户是否被禁用
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: '账户已被禁用，请联系管理员'
      })
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date()
    await user.save()

    // 生成token
    const token = generateToken(user._id)

    // 返回用户信息（不包含密码）
    const userResponse = user.toObject()
    delete userResponse.password

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: userResponse,
        token
      }
    })

  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 获取当前用户信息
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    res.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error('获取用户信息失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 更新用户信息
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = ['username', 'avatar', 'profile', 'preferences']
    const updates = {}

    // 只允许更新指定字段
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key]
      }
    })

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    res.json({
      success: true,
      message: '个人信息更新成功',
      data: user
    })

  } catch (error) {
    console.error('更新用户信息失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 修改密码
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '当前密码和新密码都必填'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '新密码至少6个字符'
      })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    // 验证当前密码
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '当前密码错误'
      })
    }

    // 更新密码
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: '密码修改成功'
    })

  } catch (error) {
    console.error('修改密码失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 验证token
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    res.json({
      success: true,
      message: 'Token有效',
      data: user
    })

  } catch (error) {
    console.error('验证token失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

export default router