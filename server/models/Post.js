import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, '评论内容必填'],
    maxlength: [1000, '评论内容最多1000个字符']
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '帖子标题必填'],
    trim: true,
    maxlength: [200, '帖子标题最多200个字符']
  },
  content: {
    type: String,
    required: [true, '帖子内容必填'],
    maxlength: [10000, '帖子内容最多10000个字符']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: [
      '住宿体验',
      '教学质量',
      '校园活动',
      '食堂评价',
      '学习心得',
      '就业经验',
      '考研经验',
      '留学经验',
      '社团活动',
      '校园生活',
      '学术讨论',
      '求助问答',
      '其他'
    ],
    required: [true, '帖子类别必填']
  },
  tags: [{
    type: String,
    maxlength: [30, '标签最多30个字符']
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      maxlength: [200, '图片说明最多200个字符']
    }
  }],
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University'
  },
  major: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major'
  },
  type: {
    type: String,
    enum: ['discussion', 'question', 'experience', 'review'],
    default: 'discussion'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'reviewed', 'featured'],
    default: 'published'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  stats: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  metadata: {
    featured: {
      type: Boolean,
      default: false
    },
    pinned: {
      type: Boolean,
      default: false
    },
    allowComments: {
      type: Boolean,
      default: true
    },
    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  moderation: {
    isReported: {
      type: Boolean,
      default: false
    },
    reportCount: {
      type: Number,
      default: 0
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// 虚拟字段：评论数量
postSchema.virtual('commentCount').get(function() {
  return this.comments.filter(comment => comment.isActive).length
})

// 虚拟字段：点赞数量
postSchema.virtual('likeCount').get(function() {
  return this.likes.length
})

// 索引
postSchema.index({ title: 1 })
postSchema.index({ author: 1 })
postSchema.index({ category: 1 })
postSchema.index({ tags: 1 })
postSchema.index({ university: 1 })
postSchema.index({ createdAt: -1 })
postSchema.index({ 'stats.views': -1 })
postSchema.index({ 'stats.likes': -1 })

export default mongoose.model('Post', postSchema)