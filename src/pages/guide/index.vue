<template>
  <view class="guide-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="container">
        <text class="page-title">入学指南</text>
        <text class="page-subtitle">为新生提供全方位入学指引</text>
      </view>
    </view>

    <!-- 指南分类 -->
    <view class="guide-categories">
      <view class="container">
        <view class="categories-grid">
          <view 
            v-for="category in categories" 
            :key="category.id"
            class="category-item card card-hover"
            @click="viewCategory(category)"
          >
            <view class="category-icon">{{ category.icon }}</view>
            <text class="category-title">{{ category.title }}</text>
            <text class="category-desc">{{ category.description }}</text>
            <text class="category-count">{{ category.count }}项内容</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 热门指南 -->
    <view class="popular-guides">
      <view class="container">
        <text class="section-title">热门指南</text>
        <view class="guides-list">
          <view 
            v-for="guide in popularGuides" 
            :key="guide.id"
            class="guide-item card card-hover"
            @click="viewGuide(guide)"
          >
            <image class="guide-image" :src="guide.image" mode="aspectFill" />
            <view class="guide-content">
              <text class="guide-title">{{ guide.title }}</text>
              <text class="guide-summary">{{ guide.summary }}</text>
              <view class="guide-meta">
                <text class="guide-category">{{ guide.category }}</text>
                <text class="guide-views">{{ guide.views }}次浏览</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 快速链接 -->
    <view class="quick-links">
      <view class="container">
        <text class="section-title">快速链接</text>
        <view class="links-grid">
          <view 
            v-for="link in quickLinks" 
            :key="link.id"
            class="link-item"
            @click="openLink(link)"
          >
            <view class="link-icon">{{ link.icon }}</view>
            <text class="link-title">{{ link.title }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const categories = ref([
  {
    id: 1,
    title: '入学准备',
    description: '证件材料、生活用品清单',
    icon: '📋',
    count: 15
  },
  {
    id: 2,
    title: '报到流程',
    description: '详细的报到步骤指引',
    icon: '📍',
    count: 8
  },
  {
    id: 3,
    title: '校园导航',
    description: '校园地图、建筑位置',
    icon: '🗺️',
    count: 12
  },
  {
    id: 4,
    title: '生活指南',
    description: '住宿、餐饮、购物指南',
    icon: '🏠',
    count: 20
  },
  {
    id: 5,
    title: '学习指导',
    description: '选课、图书馆使用指南',
    icon: '📚',
    count: 18
  },
  {
    id: 6,
    title: '安全须知',
    description: '校园安全、防诈骗指南',
    icon: '🛡️',
    count: 10
  }
])

const popularGuides = ref([
  {
    id: 1,
    title: '新生入学必备物品清单',
    summary: '详细列出新生入学需要准备的各类物品，避免遗漏重要物品',
    category: '入学准备',
    views: 15420,
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    title: '大学报到流程详解',
    summary: '从到达学校到完成报到的完整流程，让你轻松完成入学手续',
    category: '报到流程',
    views: 12350,
    image: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    title: '校园生活全攻略',
    summary: '涵盖住宿、餐饮、学习、娱乐等各个方面的校园生活指南',
    category: '生活指南',
    views: 18760,
    image: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 4,
    title: '选课指南与学习规划',
    summary: '如何选择适合的课程，制定合理的学习计划',
    category: '学习指导',
    views: 9840,
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
])

const quickLinks = ref([
  { id: 1, title: '校历查询', icon: '📅' },
  { id: 2, title: '课程表', icon: '📊' },
  { id: 3, title: '成绩查询', icon: '📈' },
  { id: 4, title: '图书馆', icon: '📖' },
  { id: 5, title: '校园卡', icon: '💳' },
  { id: 6, title: '在线服务', icon: '💻' }
])

const viewCategory = (category: any) => {
  uni.showToast({
    title: `${category.title}功能开发中`,
    icon: 'none'
  })
}

const viewGuide = (guide: any) => {
  uni.showToast({
    title: '指南详情功能开发中',
    icon: 'none'
  })
}

const openLink = (link: any) => {
  uni.showToast({
    title: `${link.title}功能开发中`,
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.guide-page {
  min-height: 100vh;
  background: var(--background);
}

.page-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 48rpx 0;
  text-align: center;
  
  .page-title {
    font-size: 48rpx;
    font-weight: 700;
    display: block;
    margin-bottom: 16rpx;
  }
  
  .page-subtitle {
    font-size: 28rpx;
    opacity: 0.9;
    display: block;
  }
}

.guide-categories {
  padding: 48rpx 0;
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300rpx, 1fr));
    gap: 24rpx;
    
    @media (max-width: 750px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .category-item {
      text-align: center;
      padding: 40rpx 24rpx;
      
      .category-icon {
        font-size: 64rpx;
        margin-bottom: 16rpx;
        display: block;
      }
      
      .category-title {
        font-size: 32rpx;
        font-weight: 600;
        color: var(--text-primary);
        display: block;
        margin-bottom: 8rpx;
      }
      
      .category-desc {
        font-size: 24rpx;
        color: var(--text-secondary);
        line-height: 1.4;
        display: block;
        margin-bottom: 12rpx;
      }
      
      .category-count {
        font-size: 22rpx;
        color: var(--text-muted);
        display: block;
      }
    }
  }
}

.popular-guides {
  padding: 48rpx 0;
  background: white;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 32rpx;
    display: block;
  }
  
  .guides-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    
    .guide-item {
      display: flex;
      gap: 24rpx;
      padding: 24rpx;
      
      .guide-image {
        width: 160rpx;
        height: 120rpx;
        border-radius: 12rpx;
        flex-shrink: 0;
      }
      
      .guide-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        
        .guide-title {
          font-size: 28rpx;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }
        
        .guide-summary {
          font-size: 24rpx;
          color: var(--text-secondary);
          line-height: 1.4;
          flex: 1;
        }
        
        .guide-meta {
          display: flex;
          justify-content: space-between;
          font-size: 22rpx;
          color: var(--text-muted);
        }
      }
    }
  }
}

.quick-links {
  padding: 48rpx 0;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 32rpx;
    display: block;
  }
  
  .links-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24rpx;
    
    @media (max-width: 750px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .link-item {
      background: white;
      padding: 32rpx 24rpx;
      border-radius: 16rpx;
      text-align: center;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-4rpx);
        box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
      }
      
      .link-icon {
        font-size: 48rpx;
        margin-bottom: 16rpx;
        display: block;
      }
      
      .link-title {
        font-size: 26rpx;
        color: var(--text-primary);
        font-weight: 500;
        display: block;
      }
    }
  }
}
</style>