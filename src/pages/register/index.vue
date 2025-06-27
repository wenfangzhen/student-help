<template>
  <view class="register-page">
    <view class="register-container">
      <view class="register-header">
        <text class="app-title">高校信息平台</text>
        <text class="register-subtitle">创建您的账户</text>
      </view>
      
      <view class="register-form">
        <view class="form-group">
          <text class="form-label">用户名</text>
          <input 
            class="form-input"
            type="text"
            v-model="formData.username"
            placeholder="请输入用户名"
            :disabled="loading"
          />
        </view>
        
        <view class="form-group">
          <text class="form-label">邮箱</text>
          <input 
            class="form-input"
            type="text"
            v-model="formData.email"
            placeholder="请输入邮箱地址"
            :disabled="loading"
          />
        </view>
        
        <view class="form-group">
          <text class="form-label">密码</text>
          <input 
            class="form-input"
            type="password"
            v-model="formData.password"
            placeholder="请输入密码（至少6位）"
            :disabled="loading"
          />
        </view>
        
        <view class="form-group">
          <text class="form-label">确认密码</text>
          <input 
            class="form-input"
            type="password"
            v-model="formData.confirmPassword"
            placeholder="请再次输入密码"
            :disabled="loading"
          />
        </view>
        
        <button 
          class="register-btn"
          :class="{ loading: loading }"
          :disabled="loading"
          @click="handleRegister"
        >
          {{ loading ? '注册中...' : '注册' }}
        </button>
        
        <view class="register-footer">
          <text class="login-link" @click="goToLogin">
            已有账户？立即登录
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)

const validateForm = () => {
  if (!formData.value.username.trim()) {
    uni.showToast({
      title: '请输入用户名',
      icon: 'none'
    })
    return false
  }
  
  if (formData.value.username.length < 2 || formData.value.username.length > 20) {
    uni.showToast({
      title: '用户名长度应在2-20个字符之间',
      icon: 'none'
    })
    return false
  }
  
  if (!formData.value.email.trim()) {
    uni.showToast({
      title: '请输入邮箱地址',
      icon: 'none'
    })
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email)) {
    uni.showToast({
      title: '请输入有效的邮箱地址',
      icon: 'none'
    })
    return false
  }
  
  if (!formData.value.password.trim()) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    })
    return false
  }
  
  if (formData.value.password.length < 6) {
    uni.showToast({
      title: '密码至少需要6个字符',
      icon: 'none'
    })
    return false
  }
  
  if (formData.value.password !== formData.value.confirmPassword) {
    uni.showToast({
      title: '两次输入的密码不一致',
      icon: 'none'
    })
    return false
  }
  
  return true
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const result = await userStore.register(
      formData.value.username,
      formData.value.email,
      formData.value.password
    )
    
    if (result.success) {
      uni.showToast({
        title: '注册成功',
        icon: 'success'
      })
      
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/login/index'
        })
      }, 1500)
    } else {
      uni.showToast({
        title: result.message || '注册失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('注册失败:', error)
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.register-container {
  width: 100%;
  max-width: 600rpx;
  background: white;
  border-radius: 24rpx;
  padding: 64rpx 48rpx;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 48rpx;
  
  .app-title {
    font-size: 48rpx;
    font-weight: 700;
    color: var(--text-primary);
    display: block;
    margin-bottom: 16rpx;
  }
  
  .register-subtitle {
    font-size: 28rpx;
    color: var(--text-secondary);
    display: block;
  }
}

.register-form {
  .form-group {
    margin-bottom: 32rpx;
    
    .form-label {
      font-size: 28rpx;
      color: var(--text-primary);
      font-weight: 500;
      display: block;
      margin-bottom: 12rpx;
    }
    
    .form-input {
      width: 100%;
      padding: 24rpx;
      border: 2rpx solid var(--border-color);
      border-radius: 12rpx;
      font-size: 28rpx;
      color: var(--text-primary);
      background: white;
      transition: border-color 0.3s ease;
      
      &:focus {
        border-color: var(--primary-color);
        outline: none;
      }
      
      &:disabled {
        background: #f8fafc;
        color: var(--text-muted);
      }
    }
  }
  
  .register-btn {
    width: 100%;
    padding: 28rpx;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border: none;
    border-radius: 12rpx;
    font-size: 32rpx;
    font-weight: 600;
    margin-top: 24rpx;
    transition: all 0.3s ease;
    
    &:not(:disabled):hover {
      opacity: 0.9;
      transform: translateY(-2rpx);
    }
    
    &:disabled {
      opacity: 0.6;
      transform: none;
    }
    
    &.loading {
      background: var(--text-muted);
    }
  }
  
  .register-footer {
    text-align: center;
    margin-top: 32rpx;
    
    .login-link {
      color: var(--primary-color);
      font-size: 26rpx;
      text-decoration: underline;
    }
  }
}
</style>