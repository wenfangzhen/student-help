import express from 'express'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// 获取用户列表（仅管理员）
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足，只有管理员可以查看用户列表'
      })
    }

    const {
      page = 1,
      limit = 10,
      search,
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    // 构建查询条件
    const query = {}

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    if (role) {
      query.role = role
    }

    // 构建排序条件
    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // 分页查询
    const skip = (page - 1) * limit
    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password -__v')

    // 获取总数
    const total = await User.countDocuments(query)

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('获取用户列表失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 获取用户详情
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email -__v')

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
    console.error('获取用户详情失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 更新用户状态（仅管理员）
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足，只有管理员可以更新用户状态'
      })
    }

    const { isActive } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password -__v')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    res.json({
      success: true,
      message: `用户${isActive ? '启用' : '禁用'}成功`,
      data: user
    })

  } catch (error) {
    console.error('更新用户状态失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 更新用户角色（仅管理员）
router.put('/:id/role', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足，只有管理员可以更新用户角色'
      })
    }

    const { role } = req.body

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: '无效的用户角色'
      })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password -__v')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      })
    }

    res.json({
      success: true,
      message: '用户角色更新成功',
      data: user
    })

  } catch (error) {
    console.error('更新用户角色失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 获取用户统计信息
router.get('/stats/overview', auth, async (req, res) => {
  
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足，只有管理员可以查看统计信息'
      })
    }

    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          adminUsers: {
            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
          },
          newUsersThisMonth: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$createdAt',
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ])

    res.json({
      success: true,
      data: stats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        newUsersThisMonth: 0
      }
    })

  } catch (error) {
    console.error('获取用户统计信息失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

export default router