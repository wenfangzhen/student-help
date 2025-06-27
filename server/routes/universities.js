import express from 'express'
import University from '../models/University.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// 获取大学列表
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      province,
      city,
      type,
      level,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    // 构建查询条件
    const query = { isActive: true }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { englishName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    if (province) {
      query['location.province'] = province
    }

    if (city) {
      query['location.city'] = city
    }

    if (type) {
      query.type = type
    }

    if (level) {
      query.level = level
    }

    // 构建排序条件
    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // 分页查询
    const skip = (page - 1) * limit
    const universities = await University.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v')

    // 获取总数
    const total = await University.countDocuments(query)

    res.json({
      success: true,
      data: {
        universities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('获取大学列表失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 获取大学详情
router.get('/:id', async (req, res) => {
  try {
    const university = await University.findById(req.params.id)
      .populate('majors', 'name category description')
      .select('-__v')

    if (!university) {
      return res.status(404).json({
        success: false,
        message: '大学不存在'
      })
    }

    res.json({
      success: true,
      data: university
    })

  } catch (error) {
    console.error('获取大学详情失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 创建大学（需要管理员权限）
router.post('/', auth, async (req, res) => {
  try {
    // 检查用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足，只有管理员可以创建大学'
      })
    }

    const university = new University({
      ...req.body,
      createdBy: req.userId
    })

    await university.save()

    res.status(201).json({
      success: true,
      message: '大学创建成功',
      data: university
    })

  } catch (error) {
    console.error('创建大学失败:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: '数据验证失败',
        errors
      })
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: '大学名称已存在'
      })
    }

    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 更新大学信息（需要管理员权限）
router.put('/:id', auth, async (req, res) => {
  try {
    // 检查用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足，只有管理员可以更新大学信息'
      })
    }

    const university = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!university) {
      return res.status(404).json({
        success: false,
        message: '大学不存在'
      })
    }

    res.json({
      success: true,
      message: '大学信息更新成功',
      data: university
    })

  } catch (error) {
    console.error('更新大学信息失败:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: '数据验证失败',
        errors
      })
    }

    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 删除大学（软删除）
router.delete('/:id', auth, async (req, res) => {
  try {
    // 检查用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足，只有管理员可以删除大学'
      })
    }

    const university = await University.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )

    if (!university) {
      return res.status(404).json({
        success: false,
        message: '大学不存在'
      })
    }

    res.json({
      success: true,
      message: '大学删除成功'
    })

  } catch (error) {
    console.error('删除大学失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 获取大学统计信息
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await University.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalUniversities: { $sum: 1 },
          avgRating: { $avg: '$rating.overall' },
          totalStudents: { $sum: '$stats.studentCount' },
          typeDistribution: {
            $push: '$type'
          },
          levelDistribution: {
            $push: '$level'
          }
        }
      }
    ])

    // 统计类型分布
    const typeStats = {}
    const levelStats = {}

    if (stats.length > 0) {
      stats[0].typeDistribution.forEach(type => {
        typeStats[type] = (typeStats[type] || 0) + 1
      })

      stats[0].levelDistribution.forEach(level => {
        levelStats[level] = (levelStats[level] || 0) + 1
      })
    }

    res.json({
      success: true,
      data: {
        totalUniversities: stats[0]?.totalUniversities || 0,
        avgRating: Math.round((stats[0]?.avgRating || 0) * 10) / 10,
        totalStudents: stats[0]?.totalStudents || 0,
        typeDistribution: typeStats,
        levelDistribution: levelStats
      }
    })

  } catch (error) {
    console.error('获取大学统计信息失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

export default router