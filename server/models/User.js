import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名必填'],
    unique: true,
    trim: true,
    minlength: [2, '用户名至少2个字符'],
    maxlength: [20, '用户名最多20个字符']
  },
  email: {
    type: String,
    required: [true, '邮箱必填'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
  },
  password: {
    type: String,
    required: [true, '密码必填'],
    minlength: [6, '密码至少6个字符']
  },
  avatar: {
    type: String,
    default: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    bio: {
      type: String,
      maxlength: [500, '个人简介最多500个字符']
    },
    university: {
      type: String,
      maxlength: [100, '学校名称最多100个字符']
    },
    major: {
      type: String,
      maxlength: [100, '专业名称最多100个字符']
    },
    graduationYear: {
      type: Number,
      min: [1900, '毕业年份不能早于1900年'],
      max: [2100, '毕业年份不能晚于2100年']
    },
    location: {
      type: String,
      maxlength: [100, '地址最多100个字符']
    }
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    postsCount: {
      type: Number,
      default: 0
    },
    likesCount: {
      type: Number,
      default: 0
    },
    followersCount: {
      type: Number,
      default: 0
    },
    followingCount: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// 比较密码方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// 获取用户公开信息
userSchema.methods.getPublicProfile = function() {
  const userObj = this.toObject()
  delete userObj.password
  delete userObj.email
  return userObj
}

// 虚拟字段：完整姓名
userSchema.virtual('displayName').get(function() {
  return this.username
})

// 索引
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })
userSchema.index({ createdAt: -1 })

export default mongoose.model('User', userSchema)