import express from 'express'
import Post from '../models/Post.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// 获取帖子列表
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    // 构建查询条件
    const query = { isActive: true }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    if (category) {
      query.category = category
    }

    if (tags) {
      const tagsArray = tags.split(',')
      query.tags = { $in: tagsArray }
    }

    // 构建排序条件
    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // 分页查询
    const skip = (page - 1) * limit
    const posts = await Post.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'username avatar')
      .populate('university', 'name logo')
      .select('-__v')

    // 获取总数
    const total = await Post.countDocuments(query)

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('获取帖子列表失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 获取帖子详情
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar profile')
      .populate('university', 'name logo location')
      .populate('comments.author', 'username avatar')
      .select('-__v')

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      })
    }

    // 增加浏览量
    post.stats.views += 1
    await post.save()

    res.json({
      success: true,
      data: post
    })

  } catch (error) {
    console.error('获取帖子详情失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 创建帖子
router.post('/', auth, async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      author: req.userId
    })

    await post.save()
    await post.populate('author', 'username avatar')

    res.status(201).json({
      success: true,
      message: '帖子创建成功',
      data: post
    })

  } catch (error) {
    console.error('创建帖子失败:', error)
    
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

// 更新帖子
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      })
    }

    // 检查权限
    if (post.author.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足，只能编辑自己的帖子'
      })
    }

    const allowedUpdates = ['title', 'content', 'category', 'tags', 'images']
    const updates = {}

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key]
      }
    })

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar')

    res.json({
      success: true,
      message: '帖子更新成功',
      data: updatedPost
    })

  } catch (error) {
    console.error('更新帖子失败:', error)
    
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

// 删除帖子（软删除）
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      })
    }

    // 检查权限
    if (post.author.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足，只能删除自己的帖子'
      })
    }

    post.isActive = false
    await post.save()

    res.json({
      success: true,
      message: '帖子删除成功'
    })

  } catch (error) {
    console.error('删除帖子失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 点赞帖子
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      })
    }

    const hasLiked = post.likes.includes(req.userId)

    if (hasLiked) {
      // 取消点赞
      post.likes = post.likes.filter(id => id.toString() !== req.userId)
      post.stats.likes -= 1
    } else {
      // 点赞
      post.likes.push(req.userId)
      post.stats.likes += 1
    }

    await post.save()

    res.json({
      success: true,
      message: hasLiked ? '取消点赞成功' : '点赞成功',
      data: {
        liked: !hasLiked,
        likesCount: post.stats.likes
      }
    })

  } catch (error) {
    console.error('点赞操作失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

// 添加评论
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content, parentId } = req.body

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: '评论内容不能为空'
      })
    }

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      })
    }

    const comment = {
      author: req.userId,
      content: content.trim(),
      parentId: parentId || null,
      createdAt: new Date()
    }

    post.comments.push(comment)
    post.stats.comments += 1
    await post.save()

    await post.populate('comments.author', 'username avatar')

    const newComment = post.comments[post.comments.length - 1]

    res.status(201).json({
      success: true,
      message: '评论添加成功',
      data: newComment
    })

  } catch (error) {
    console.error('添加评论失败:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  }
})

export default router