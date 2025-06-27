<template>
  <view class="home-page">
    <!-- 轮播图 -->
    <view class="banner-section">
      <swiper class="banner-swiper" indicator-dots indicator-color="rgba(255,255,255,0.5)" 
              indicator-active-color="#ffffff" autoplay circular>
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <view class="banner-item" :style="{ backgroundImage: `url(${banner.image})` }">
            <view class="banner-content">
              <text class="banner-title">{{ banner.title }}</text>
              <text class="banner-subtitle">{{ banner.subtitle }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 搜索框 -->
    <view class="search-section">
      <view class="search-container">
        <view class="search-box" @click="goToSearch">
          <text class="search-icon">🔍</text>
          <text class="search-placeholder">搜索大学、专业、问题...</text>
        </view>
      </view>
    </view>

    <!-- 功能模块 -->
    <view class="modules-section">
      <view class="container">
        <text class="section-title">功能模块</text>
        <view class="modules-grid">
          <view 
            v-for="module in modules" 
            :key="module.id"
            class="module-item card-hover"
            @click="navigateToModule(module)"
          >
            <view class="module-icon">{{ module.icon }}</view>
            <text class="module-name">{{ module.name }}</text>
            <text class="module-desc">{{ module.description }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 热门推荐 -->
    <view class="recommendations-section">
      <view class="container">
        <text class="section-title">热门推荐</text>
        <view class="recommendations-list">
          <view 
            v-for="item in recommendations" 
            :key="item.id"
            class="recommendation-item card card-hover"
            @click="viewRecommendation(item)"
          >
            <image class="recommendation-image" :src="item.image" mode="aspectFill" />
            <view class="recommendation-content">
              <text class="recommendation-title">{{ item.title }}</text>
              <text class="recommendation-excerpt">{{ item.excerpt }}</text>
              <view class="recommendation-meta">
                <text class="recommendation-author">{{ item.author }}</text>
                <text class="recommendation-date">{{ formatDate(item.date) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="stats-section">
      <view class="container">
        <view class="stats-grid">
          <view v-for="stat in stats" :key="stat.label" class="stat-item">
            <text class="stat-number">{{ stat.value }}</text>
            <text class="stat-label">{{ stat.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

// 轮播图数据
const banners = ref([
  {
    title: '发现理想大学',
    subtitle: '全国数千所高校信息，助你找到心仪学府',
    image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    title: '专业选择指南',
    subtitle: '深度解析各专业前景，规划未来职业道路',
    image: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    title: '校友经验分享',
    subtitle: '真实校友故事，传递成长正能量',
    image: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
])

// 功能模块
const modules = ref([
  { id: 1, name: '全国高校', description: '高校信息查询', icon: '🏫', path: '/pages/universities/index' },
  { id: 2, name: '选专业', description: '专业介绍分析', icon: '📚', path: '/pages/majors/index' },
  { id: 3, name: '入学指南', description: '新生入学攻略', icon: '📋', path: '/pages/guide/index' },
  { id: 4, name: '宿舍实拍', description: '真实宿舍环境', icon: '🏠', path: '/pages/dormitory/index' },
  { id: 5, name: '校友故事', description: '成长经历分享', icon: '👥', path: '/pages/alumni/index' },
  { id: 6, name: '留学资讯', description: '海外求学信息', icon: '✈️', path: '/pages/study-abroad/index' },
  { id: 7, name: '考研资讯', description: '考研备考指南', icon: '📖', path: '/pages/postgraduate/index' },
  { id: 8, name: '论坛社区', description: '互动交流平台', icon: '💬', path: '/pages/forum/index' }
])

// 热门推荐
const recommendations = ref([
  {
    id: 1,
    title: '北京大学计算机专业深度解析',
    excerpt: '作为国内顶尖学府，北大计算机专业有着怎样的特色和优势？',
    author: '学长小李',
    date: new Date('2024-01-15'),
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    title: '清华大学宿舍生活全攻略',
    excerpt: '从住宿环境到生活设施，为你详细介绍清华大学的宿舍生活',
    author: '校友小王',
    date: new Date('2024-01-12'),
    image: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    title: '复旦大学经济学专业就业前景',
    excerpt: '经济学专业毕业生的就业方向和薪资待遇如何？',
    author: '导师张教授',
    date: new Date('2024-01-10'),
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
])

// 统计数据
const stats = ref([
  { label: '合作高校', value: '2000+' },
  { label: '注册用户', value: '500万+' },
  { label: '专业介绍', value: '1000+' },
  { label: '校友故事', value: '10万+' }
])

const formatDate = (date: Date) => {
  return dayjs(date).format('MM-DD')
}

const goToSearch = () => {
  uni.navigateTo({
    url: '/pages/search/index'
  })
}

const navigateToModule = (module: any) => {
  uni.navigateTo({
    url: module.path
  })
}

const viewRecommendation = (item: any) => {
  // 可以导航到详细页面
  uni.showToast({
    title: '查看推荐内容',
    icon: 'none'
  })
}

onMounted(() => {
  // 初始化页面数据
  console.log('首页加载完成')
})
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: var(--background);
}

.banner-section {
  height: 400rpx;
  
  .banner-swiper {
    height: 100%;
    
    .banner-item {
      height: 100%;
      background-size: cover;
      background-position: center;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
      }
      
      .banner-content {
        position: relative;
        z-index: 1;
        text-align: center;
        color: white;
        
        .banner-title {
          font-size: 48rpx;
          font-weight: 700;
          margin-bottom: 16rpx;
          display: block;
        }
        
        .banner-subtitle {
          font-size: 28rpx;
          opacity: 0.9;
          display: block;
        }
      }
    }
  }
}

.search-section {
  padding: 32rpx 0;
  background: white;
  
  .search-container {
    padding: 0 32rpx;
    
    .search-box {
      background: #f8fafc;
      border-radius: 24rpx;
      padding: 24rpx 32rpx;
      display: flex;
      align-items: center;
      gap: 16rpx;
      
      .search-icon {
        font-size: 32rpx;
        color: var(--text-muted);
      }
      
      .search-placeholder {
        font-size: 28rpx;
        color: var(--text-muted);
      }
    }
  }
}

.modules-section {
  padding: 48rpx 0;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 32rpx;
    display: block;
  }
  
  .modules-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24rpx;
    
    @media (max-width: 750px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .module-item {
      background: white;
      border-radius: 16rpx;
      padding: 32rpx 24rpx;
      text-align: center;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      
      .module-icon {
        font-size: 48rpx;
        margin-bottom: 16rpx;
        display: block;
      }
      
      .module-name {
        font-size: 28rpx;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 8rpx;
        display: block;
      }
      
      .module-desc {
        font-size: 24rpx;
        color: var(--text-secondary);
        display: block;
      }
      
      &:hover {
        transform: translateY(-8rpx);
        box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
      }
    }
  }
}

.recommendations-section {
  padding: 48rpx 0;
  background: white;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 32rpx;
    display: block;
  }
  
  .recommendations-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    
    .recommendation-item {
      display: flex;
      gap: 24rpx;
      padding: 24rpx;
      
      .recommendation-image {
        width: 160rpx;
        height: 120rpx;
        border-radius: 12rpx;
        flex-shrink: 0;
      }
      
      .recommendation-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        
        .recommendation-title {
          font-size: 28rpx;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }
        
        .recommendation-excerpt {
          font-size: 24rpx;
          color: var(--text-secondary);
          line-height: 1.4;
          flex: 1;
        }
        
        .recommendation-meta {
          display: flex;
          justify-content: space-between;
          font-size: 22rpx;
          color: var(--text-muted);
        }
      }
    }
  }
}

.stats-section {
  padding: 48rpx 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32rpx;
    
    @media (max-width: 750px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .stat-item {
      text-align: center;
      color: white;
      
      .stat-number {
        font-size: 48rpx;
        font-weight: 700;
        display: block;
        margin-bottom: 8rpx;
      }
      
      .stat-label {
        font-size: 24rpx;
        opacity: 0.9;
        display: block;
      }
    }
  }
}
</style>