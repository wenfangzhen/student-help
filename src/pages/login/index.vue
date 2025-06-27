<template>
  <view class="login-page">
    <view class="login-container">
      <view class="login-header">
        <text class="app-title">高校信息平台</text>
        <text class="login-subtitle">登录您的账户</text>
      </view>
      
      <view class="login-form">
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
            placeholder="请输入密码"
            :disabled="loading"
          />
        </view>
        
        <button 
          class="login-btn"
          :class="{ loading: loading }"
          :disabled="loading"
          @click="handleLogin"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
        
        <view class="login-footer">
          <text class="register-link" @click="goToRegister">
            还没有账户？立即注册
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
  email: '',
  password: ''
})

const loading = ref(false)

const validateForm = () => {
  if (!formData.value.email.trim()) {
    uni.showToast({
      title: '请输入邮箱地址',
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
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email)) {
    uni.showToast({
      title: '请输入有效的邮箱地址',
      icon: 'none'
    })
    return false
  }
  
  return true
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const result = await userStore.login(formData.value.email, formData.value.password)
    
    if (result.success) {
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }, 1500)
    } else {
      uni.showToast({
        title: result.message || '登录失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('登录失败:', error)
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  uni.navigateTo({
    url: '/pages/register/index'
  })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.login-container {
  width: 100%;
  max-width: 600rpx;
  background: white;
  border-radius: 24rpx;
  padding: 64rpx 48rpx;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 48rpx;
  
  .app-title {
    font-size: 48rpx;
    font-weight: 700;
    color: var(--text-primary);
    display: block;
    margin-bottom: 16rpx;
  }
  
  .login-subtitle {
    font-size: 28rpx;
    color: var(--text-secondary);
    display: block;
  }
}

.login-form {
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
  
  .login-btn {
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
  
  .login-footer {
    text-align: center;
    margin-top: 32rpx;
    
    .register-link {
      color: var(--primary-color);
      font-size: 26rpx;
      text-decoration: underline;
    }
  }
}
</style>