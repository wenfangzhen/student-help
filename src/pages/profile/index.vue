<template>
  <view class="profile-page">
    <!-- 用户信息头部 -->
    <view class="profile-header">
      <view class="container">
        <view v-if="userStore.isLoggedIn" class="user-info">
          <image class="user-avatar" :src="userStore.user?.avatar" mode="aspectFill" />
          <view class="user-details">
            <text class="user-name">{{ userStore.user?.username }}</text>
            <text class="user-email">{{ userStore.user?.email }}</text>
            <view class="user-stats">
              <view class="stat-item">
                <text class="stat-number">{{ userStore.user?.stats?.postsCount || 0 }}</text>
                <text class="stat-label">帖子</text>
              </view>
              <view class="stat-item">
                <text class="stat-number">{{ userStore.user?.stats?.likesCount || 0 }}</text>
                <text class="stat-label">获赞</text>
              </view>
              <view class="stat-item">
                <text class="stat-number">{{ userStore.user?.stats?.followersCount || 0 }}</text>
                <text class="stat-label">粉丝</text>
              </view>
            </view>
          </view>
        </view>
        
        <view v-else class="login-prompt">
          <text class="prompt-text">请先登录</text>
          <button class="login-btn" @click="goToLogin">立即登录</button>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="container">
        <view class="menu-list">
          <view 
            v-for="menu in menuItems" 
            :key="menu.id"
            class="menu-item card-hover"
            @click="handleMenuClick(menu)"
          >
            <view class="menu-icon">{{ menu.icon }}</view>
            <text class="menu-title">{{ menu.title }}</text>
            <text class="menu-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view v-if="userStore.isLoggedIn" class="logout-section">
      <view class="container">
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const menuItems = ref([
  { id: 1, title: '个人资料', icon: '👤', action: 'profile' },
  { id: 2, title: '我的帖子', icon: '📝', action: 'posts' },
  { id: 3, title: '我的收藏', icon: '⭐', action: 'favorites' },
  { id: 4, title: '浏览历史', icon: '📖', action: 'history' },
  { id: 5, title: '设置', icon: '⚙️', action: 'settings' },
  { id: 6, title: '帮助与反馈', icon: '❓', action: 'help' },
  { id: 7, title: '关于我们', icon: 'ℹ️', action: 'about' }
])

const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  })
}

const handleMenuClick = (menu: any) => {
  if (!userStore.isLoggedIn && ['profile', 'posts', 'favorites', 'history'].includes(menu.action)) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    return
  }
  
  switch (menu.action) {
    case 'profile':
      uni.showToast({
        title: '个人资料功能开发中',
        icon: 'none'
      })
      break
    case 'posts':
      uni.showToast({
        title: '我的帖子功能开发中',
        icon: 'none'
      })
      break
    case 'favorites':
      uni.showToast({
        title: '我的收藏功能开发中',
        icon: 'none'
      })
      break
    case 'history':
      uni.showToast({
        title: '浏览历史功能开发中',
        icon: 'none'
      })
      break
    case 'settings':
      uni.showToast({
        title: '设置功能开发中',
        icon: 'none'
      })
      break
    case 'help':
      uni.navigateTo({
        url: '/pages/contact/index'
      })
      break
    case 'about':
      uni.showToast({
        title: '关于我们功能开发中',
        icon: 'none'
      })
      break
  }
}

const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: var(--background);
}

.profile-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 48rpx 0;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 24rpx;
    
    .user-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
    }
    
    .user-details {
      flex: 1;
      
      .user-name {
        font-size: 36rpx;
        font-weight: 700;
        display: block;
        margin-bottom: 8rpx;
      }
      
      .user-email {
        font-size: 24rpx;
        opacity: 0.8;
        display: block;
        margin-bottom: 16rpx;
      }
      
      .user-stats {
        display: flex;
        gap: 32rpx;
        
        .stat-item {
          text-align: center;
          
          .stat-number {
            font-size: 28rpx;
            font-weight: 700;
            display: block;
            margin-bottom: 4rpx;
          }
          
          .stat-label {
            font-size: 20rpx;
            opacity: 0.8;
            display: block;
          }
        }
      }
    }
  }
  
  .login-prompt {
    text-align: center;
    
    .prompt-text {
      font-size: 32rpx;
      margin-bottom: 24rpx;
      display: block;
    }
    
    .login-btn {
      padding: 20rpx 48rpx;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2rpx solid rgba(255, 255, 255, 0.3);
      border-radius: 24rpx;
      font-size: 28rpx;
    }
  }
}

.menu-section {
  padding: 32rpx 0;
  
  .menu-list {
    background: white;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
    
    .menu-item {
      display: flex;
      align-items: center;
      padding: 32rpx;
      border-bottom: 1rpx solid var(--border-color);
      transition: background-color 0.3s ease;
      
      &:last-child {
        border-bottom: none;
      }
      
      &:hover {
        background: var(--surface-hover);
      }
      
      .menu-icon {
        font-size: 36rpx;
        margin-right: 24rpx;
      }
      
      .menu-title {
        flex: 1;
        font-size: 28rpx;
        color: var(--text-primary);
      }
      
      .menu-arrow {
        font-size: 32rpx;
        color: var(--text-muted);
      }
    }
  }
}

.logout-section {
  padding: 32rpx 0;
  
  .logout-btn {
    width: 100%;
    padding: 28rpx;
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: 12rpx;
    font-size: 28rpx;
    font-weight: 500;
  }
}
</style>