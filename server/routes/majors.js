import express from 'express'
import Major from '../models/Major.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// 获取专业列表
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      degreeLevel,
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

    if (category) {
      query.category = category
    }

    if (degreeLevel) {
      query.degreeLevel = degreeLevel
    }

    // 构建排序条件
    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // 分页查询
    const skip = (page - 1) * limit
    const majors = await Major.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('universities', 'name logo location.province location.city')
      .select('-__v')

    // 获取总数
    const total = await Major.countDocuments(query)

    res.json({
      success: true,
      data: {
        majors,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('获取专业列表失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 获取专业详情
router.get('/:id', async (req, res) => {
  try {
    const major = await Major.findById(req.params.id)
      .populate('universities', 'name logo location.province location.city type level rating.overall')
      .select('-__v')

    if (!major) {
      return res.status(404).json({
        success: false,
        message: '专业不存在'
      })
    }

    res.json({
      success: true,
      data: major
    })

  } catch (error) {
    console.error('获取专业详情失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

export default router