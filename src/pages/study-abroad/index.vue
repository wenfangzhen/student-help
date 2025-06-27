<template>
  <view class="study-abroad-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="container">
        <text class="page-title">留学资讯</text>
        <text class="page-subtitle">海外求学信息，助力留学梦想</text>
      </view>
    </view>

    <!-- 功能导航 -->
    <view class="nav-section">
      <view class="container">
        <view class="nav-grid">
          <view 
            v-for="nav in navItems" 
            :key="nav.id"
            class="nav-item card card-hover"
            @click="navigateToSection(nav)"
          >
            <view class="nav-icon">{{ nav.icon }}</view>
            <text class="nav-title">{{ nav.title }}</text>
            <text class="nav-desc">{{ nav.description }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 热门国家 -->
    <view class="countries-section">
      <view class="container">
        <text class="section-title">热门留学国家</text>
        <view class="countries-list">
          <view 
            v-for="country in countries" 
            :key="country.id"
            class="country-item card card-hover"
            @click="viewCountry(country)"
          >
            <image class="country-flag" :src="country.flag" mode="aspectFill" />
            <view class="country-content">
              <text class="country-name">{{ country.name }}</text>
              <text class="country-desc">{{ country.description }}</text>
              <view class="country-stats">
                <text class="stat-item">{{ country.universityCount }}所大学</text>
                <text class="stat-item">学费：{{ country.tuitionRange }}</text>
              </view>
              <view class="country-tags">
                <text 
                  v-for="tag in country.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 最新资讯 -->
    <view class="news-section">
      <view class="container">
        <text class="section-title">最新资讯</text>
        <view class="news-list">
          <view 
            v-for="news in newsList" 
            :key="news.id"
            class="news-item card card-hover"
            @click="viewNews(news)"
          >
            <image class="news-image" :src="news.image" mode="aspectFill" />
            <view class="news-content">
              <text class="news-title">{{ news.title }}</text>
              <text class="news-summary">{{ news.summary }}</text>
              <view class="news-meta">
                <text class="news-category">{{ news.category }}</text>
                <text class="news-date">{{ formatDate(news.publishDate) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'

const navItems = ref([
  {
    id: 1,
    title: '院校查询',
    description: '全球院校信息',
    icon: '🏫'
  },
  {
    id: 2,
    title: '申请指南',
    description: '申请流程详解',
    icon: '📋'
  },
  {
    id: 3,
    title: '语言考试',
    description: '托福雅思攻略',
    icon: '📝'
  },
  {
    id: 4,
    title: '费用计算',
    description: '留学成本估算',
    icon: '💰'
  },
  {
    id: 5,
    title: '签证办理',
    description: '签证申请指导',
    icon: '📄'
  },
  {
    id: 6,
    title: '生活指南',
    description: '海外生活攻略',
    icon: '🌍'
  }
])

const countries = ref([
  {
    id: 1,
    name: '美国',
    description: '世界顶尖教育资源，多元化学习环境',
    flag: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400',
    universityCount: 4000,
    tuitionRange: '$20,000-60,000',
    tags: ['世界名校', '科研强国', '就业机会多']
  },
  {
    id: 2,
    name: '英国',
    description: '历史悠久的教育体系，学制短效率高',
    flag: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400',
    universityCount: 150,
    tuitionRange: '£15,000-35,000',
    tags: ['学制短', '名校多', '文化底蕴深']
  },
  {
    id: 3,
    name: '加拿大',
    description: '性价比高，移民政策友好',
    flag: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
    universityCount: 100,
    tuitionRange: 'CAD$15,000-40,000',
    tags: ['性价比高', '移民友好', '环境优美']
  },
  {
    id: 4,
    name: '澳大利亚',
    description: '教育质量高，气候宜人',
    flag: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400',
    universityCount: 40,
    tuitionRange: 'AUD$20,000-45,000',
    tags: ['八大名校', '气候宜人', '工作机会多']
  }
])

const newsList = ref([
  {
    id: 1,
    title: '2024年美国大学申请趋势分析',
    summary: '最新统计显示，2024年美国大学申请竞争更加激烈，录取率普遍下降...',
    category: '申请资讯',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    publishDate: '2024-01-15'
  },
  {
    id: 2,
    title: '英国学生签证新政策解读',
    summary: '英国政府发布最新学生签证政策，对申请条件和材料要求进行了调整...',
    category: '签证政策',
    image: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400',
    publishDate: '2024-01-12'
  },
  {
    id: 3,
    title: '加拿大移民新通道开放',
    summary: '加拿大政府宣布开放新的移民通道，为国际学生提供更多留下的机会...',
    category: '移民政策',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
    publishDate: '2024-01-10'
  },
  {
    id: 4,
    title: '澳洲八大2024年录取要求更新',
    summary: '澳洲八大名校纷纷更新2024年入学要求，部分专业提高了语言成绩门槛...',
    category: '院校资讯',
    image: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400',
    publishDate: '2024-01-08'
  }
])

const navigateToSection = (nav: any) => {
  uni.showToast({
    title: `${nav.title}功能开发中`,
    icon: 'none'
  })
}

const viewCountry = (country: any) => {
  uni.showToast({
    title: `${country.name}留学信息功能开发中`,
    icon: 'none'
  })
}

const viewNews = (news: any) => {
  uni.showToast({
    title: '资讯详情功能开发中',
    icon: 'none'
  })
}

const formatDate = (date: string) => {
  return dayjs(date).format('MM-DD')
}
</script>

<style lang="scss" scoped>
.study-abroad-page {
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

.nav-section {
  padding: 48rpx 0;
  
  .nav-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24rpx;
    
    @media (max-width: 750px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .nav-item {
      text-align: center;
      padding: 32rpx 24rpx;
      
      .nav-icon {
        font-size: 48rpx;
        margin-bottom: 16rpx;
        display: block;
      }
      
      .nav-title {
        font-size: 28rpx;
        font-weight: 600;
        color: var(--text-primary);
        display: block;
        margin-bottom: 8rpx;
      }
      
      .nav-desc {
        font-size: 22rpx;
        color: var(--text-secondary);
        display: block;
      }
    }
  }
}

.countries-section {
  padding: 48rpx 0;
  background: white;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 32rpx;
    display: block;
  }
  
  .countries-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    
    .country-item {
      display: flex;
      gap: 24rpx;
      padding: 24rpx;
      
      .country-flag {
        width: 120rpx;
        height: 80rpx;
        border-radius: 8rpx;
        flex-shrink: 0;
      }
      
      .country-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        
        .country-name {
          font-size: 32rpx;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .country-desc {
          font-size: 24rpx;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        
        .country-stats {
          display: flex;
          gap: 16rpx;
          font-size: 22rpx;
          color: var(--text-muted);
          margin: 8rpx 0;
        }
        
        .country-tags {
          display: flex;
          gap: 8rpx;
          flex-wrap: wrap;
          
          .tag {
            padding: 4rpx 12rpx;
            background: #e0f2fe;
            color: var(--secondary-color);
            border-radius: 12rpx;
            font-size: 20rpx;
          }
        }
      }
    }
  }
}

.news-section {
  padding: 48rpx 0;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 32rpx;
    display: block;
  }
  
  .news-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    
    .news-item {
      display: flex;
      gap: 24rpx;
      padding: 24rpx;
      
      .news-image {
        width: 160rpx;
        height: 120rpx;
        border-radius: 12rpx;
        flex-shrink: 0;
      }
      
      .news-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        
        .news-title {
          font-size: 28rpx;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }
        
        .news-summary {
          font-size: 24rpx;
          color: var(--text-secondary);
          line-height: 1.4;
          flex: 1;
        }
        
        .news-meta {
          display: flex;
          justify-content: space-between;
          font-size: 22rpx;
          color: var(--text-muted);
        }
      }
    }
  }
}
</style>