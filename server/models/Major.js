import mongoose from 'mongoose'

const majorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '专业名称必填'],
    unique: true,
    trim: true,
    maxlength: [100, '专业名称最多100个字符']
  },
  englishName: {
    type: String,
    trim: true,
    maxlength: [200, '英文名称最多200个字符']
  },
  code: {
    type: String,
    unique: true,
    trim: true,
    maxlength: [20, '专业代码最多20个字符']
  },
  category: {
    type: String,
    enum: [
      '哲学',
      '经济学',
      '法学',
      '教育学',
      '文学',
      '历史学',
      '理学',
      '工学',
      '农学',
      '医学',
      '管理学',
      '艺术学',
      '军事学',
      '交叉学科'
    ],
    required: [true, '专业类别必填']
  },
  subcategory: {
    type: String,
    maxlength: [50, '专业子类别最多50个字符']
  },
  degreeLevel: {
    type: String,
    enum: ['专科', '本科', '硕士', '博士'],
    required: [true, '学位层次必填']
  },
  duration: {
    type: Number,
    min: [1, '学制不能少于1年'],
    max: [10, '学制不能超过10年'],
    required: [true, '学制必填']
  },
  description: {
    type: String,
    required: [true, '专业描述必填'],
    maxlength: [2000, '专业描述最多2000个字符']
  },
  overview: {
    type: String,
    maxlength: [500, '专业概述最多500个字符']
  },
  curriculum: {
    coreSubjects: [{
      type: String,
      maxlength: [100, '核心课程名称最多100个字符']
    }],
    practicalCourses: [{
      type: String,
      maxlength: [100, '实践课程名称最多100个字符']
    }],
    electives: [{
      type: String,
      maxlength: [100, '选修课程名称最多100个字符']
    }]
  },
  skills: {
    required: [{
      type: String,
      maxlength: [100, '技能要求最多100个字符']
    }],
    preferred: [{
      type: String,
      maxlength: [100, '技能要求最多100个字符']
    }]
  },
  career: {
    directions: [{
      title: {
        type: String,
        maxlength: [100, '就业方向标题最多100个字符']
      },
      description: {
        type: String,
        maxlength: [500, '就业方向描述最多500个字符']
      }
    }],
    industries: [{
      type: String,
      maxlength: [50, '行业名称最多50个字符']
    }],
    positions: [{
      type: String,
      maxlength: [50, '职位名称最多50个字符']
    }],
    averageSalary: {
      min: {
        type: Number,
        min: [0, '薪资不能为负数']
      },
      max: {
        type: Number,
        min: [0, '薪资不能为负数']
      }
    },
    employmentRate: {
      type: Number,
      min: [0, '就业率不能小于0'],
      max: [100, '就业率不能大于100']
    }
  },
  requirements: {
    academic: {
      type: String,
      maxlength: [200, '学术要求最多200个字符']
    },
    language: {
      type: String,
      maxlength: [200, '语言要求最多200个字符']
    },
    other: {
      type: String,
      maxlength: [200, '其他要求最多200个字符']
    }
  },
  admission: {
    cutoffScore: {
      type: Number,
      min: [0, '录取分数不能为负数']
    },
    competitiveness: {
      type: String,
      enum: ['低', '中', '高', '很高'],
      default: '中'
    },
    additionalTests: [{
      type: String,
      maxlength: [100, '附加考试名称最多100个字符']
    }]
  },
  universities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University'
  }],
  ranking: {
    national: {
      type: Number,
      min: [1, '全国排名不能小于1']
    },
    international: {
      type: Number,
      min: [1, '国际排名不能小于1']
    }
  },
  rating: {
    overall: {
      type: Number,
      min: [0, '评分不能小于0'],
      max: [10, '评分不能大于10'],
      default: 0
    },
    difficulty: {
      type: Number,
      min: [0, '难度评分不能小于0'],
      max: [10, '难度评分不能大于10'],
      default: 0
    },
    prospects: {
      type: Number,
      min: [0, '前景评分不能小于0'],
      max: [10, '前景评分不能大于10'],
      default: 0
    },
    satisfaction: {
      type: Number,
      min: [0, '满意度评分不能小于0'],
      max: [10, '满意度评分不能大于10'],
      default: 0
    }
  },
  tags: [{
    type: String,
    maxlength: [30, '标签最多30个字符']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// 虚拟字段：平均评分
majorSchema.virtual('averageRating').get(function() {
  const ratings = [
    this.rating.difficulty,
    this.rating.prospects,
    this.rating.satisfaction
  ]
  const validRatings = ratings.filter(rating => rating > 0)
  return validRatings.length > 0 ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length : 0
})

// 索引
majorSchema.index({ name: 1 })
majorSchema.index({ category: 1 })
majorSchema.index({ degreeLevel: 1 })
majorSchema.index({ 'rating.overall': -1 })
majorSchema.index({ createdAt: -1 })

export default mongoose.model('Major', majorSchema)