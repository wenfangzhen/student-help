import mongoose from 'mongoose'

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '大学名称必填'],
    unique: true,
    trim: true,
    maxlength: [100, '大学名称最多100个字符']
  },
  englishName: {
    type: String,
    trim: true,
    maxlength: [200, '英文名称最多200个字符']
  },
  logo: {
    type: String,
    default: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  images: [{
    type: String
  }],
  description: {
    type: String,
    required: [true, '大学描述必填'],
    maxlength: [2000, '大学描述最多2000个字符']
  },
  location: {
    province: {
      type: String,
      required: [true, '省份必填']
    },
    city: {
      type: String,
      required: [true, '城市必填']
    },
    district: {
      type: String
    },
    address: {
      type: String,
      maxlength: [200, '详细地址最多200个字符']
    },
    coordinates: {
      longitude: Number,
      latitude: Number
    }
  },
  type: {
    type: String,
    enum: ['综合类', '理工类', '师范类', '医学类', '财经类', '农林类', '艺术类', '语言类', '政法类', '体育类'],
    required: [true, '大学类型必填']
  },
  level: {
    type: String,
    enum: ['985工程', '211工程', '双一流', '本科', '专科'],
    required: [true, '办学层次必填']
  },
  establishedYear: {
    type: Number,
    min: [1800, '建校年份不能早于1800年'],
    max: [new Date().getFullYear(), '建校年份不能晚于当前年份']
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, '请输入有效的网站地址']
  },
  phoneNumber: {
    type: String,
    match: [/^[\d-+\s()]+$/, '请输入有效的电话号码']
  },
  email: {
    type: String,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
  },
  stats: {
    studentCount: {
      type: Number,
      min: [0, '学生人数不能为负数'],
      default: 0
    },
    facultyCount: {
      type: Number,
      min: [0, '教职工人数不能为负数'],
      default: 0
    },
    campusArea: {
      type: Number,
      min: [0, '校园面积不能为负数'],
      default: 0
    }
  },
  tuition: {
    undergraduate: {
      min: Number,
      max: Number
    },
    graduate: {
      min: Number,
      max: Number
    }
  },
  ranking: {
    national: {
      type: Number,
      min: [1, '全国排名不能小于1']
    },
    regional: {
      type: Number,
      min: [1, '地区排名不能小于1']
    },
    global: {
      type: Number,
      min: [1, '全球排名不能小于1']
    }
  },
  rating: {
    overall: {
      type: Number,
      min: [0, '评分不能小于0'],
      max: [10, '评分不能大于10'],
      default: 0
    },
    teaching: {
      type: Number,
      min: [0, '教学评分不能小于0'],
      max: [10, '教学评分不能大于10'],
      default: 0
    },
    research: {
      type: Number,
      min: [0, '科研评分不能小于0'],
      max: [10, '科研评分不能大于10'],
      default: 0
    },
    employment: {
      type: Number,
      min: [0, '就业评分不能小于0'],
      max: [10, '就业评分不能大于10'],
      default: 0
    },
    campus: {
      type: Number,
      min: [0, '校园环境评分不能小于0'],
      max: [10, '校园环境评分不能大于10'],
      default: 0
    }
  },
  facilities: {
    library: {
      type: Boolean,
      default: false
    },
    laboratory: {
      type: Boolean,
      default: false
    },
    dormitory: {
      type: Boolean,
      default: false
    },
    dining: {
      type: Boolean,
      default: false
    },
    sports: {
      type: Boolean,
      default: false
    },
    hospital: {
      type: Boolean,
      default: false
    }
  },
  transportation: {
    subway: {
      type: Boolean,
      default: false
    },
    bus: {
      type: Boolean,
      default: false
    },
    train: {
      type: Boolean,
      default: false
    },
    airport: {
      type: Boolean,
      default: false
    }
  },
  majors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major'
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

// 虚拟字段：完整地址
universitySchema.virtual('fullAddress').get(function() {
  return `${this.location.province}${this.location.city}${this.location.district || ''}${this.location.address || ''}`
})

// 虚拟字段：平均评分
universitySchema.virtual('averageRating').get(function() {
  const ratings = [
    this.rating.teaching,
    this.rating.research,
    this.rating.employment,
    this.rating.campus
  ]
  const validRatings = ratings.filter(rating => rating > 0)
  return validRatings.length > 0 ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length : 0
})

// 索引
universitySchema.index({ name: 1 })
universitySchema.index({ 'location.province': 1, 'location.city': 1 })
universitySchema.index({ type: 1 })
universitySchema.index({ level: 1 })
universitySchema.index({ 'rating.overall': -1 })
universitySchema.index({ createdAt: -1 })

export default mongoose.model('University', universitySchema)