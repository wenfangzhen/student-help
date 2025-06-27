<template>
  <view class="postgraduate-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="container">
        <text class="page-title">考研资讯</text>
        <text class="page-subtitle">考研备考指南，助力研途梦想</text>
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

    <!-- 热门院校 -->
    <view class="universities-section">
      <view class="container">
        <text class="section-title">热门考研院校</text>
        <view class="universities-list">
          <view 
            v-for="university in universities" 
            :key="university.id"
            class="university-item card card-hover"
            @click="viewUniversity(university)"
          >
            <image class="university-logo" :src="university.logo" mode="aspectFill" />
            <view class="university-content">
              <text class="university-name">{{ university.name }}</text>
              <text class="university-location">{{ university.location }}</text>
              <view class="university-stats">
                <text class="stat-item">报录比：{{ university.admissionRatio }}</text>
                <text class="stat-item">复试线：{{ university.cutoffScore }}</text>
              </view>
              <view class="university-tags">
                <text 
                  v-for="tag in university.tags" 
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

    <!-- 备考攻略 -->
    <view class="strategies-section">
      <view class="container">
        <text class="section-title">备考攻略</text>
        <view class="strategies-list">
          <view 
            v-for="strategy in strategies" 
            :key="strategy.id"
            class="strategy-item card card-hover"
            @click="viewStrategy(strategy)"
          >
            <image class="strategy-image" :src="strategy.image" mode="aspectFill" />
            <view class="strategy-content">
              <text class="strategy-title">{{ strategy.title }}</text>
              <text class="strategy-summary">{{ strategy.summary }}</text>
              <view class="strategy-meta">
                <text class="strategy-category">{{ strategy.category }}</text>
                <text class="strategy-views">{{ strategy.views }}次浏览</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 考研时间轴 -->
    <view class="timeline-section">
      <view class="container">
        <text class="section-title">考研时间轴</text>
        <view class="timeline-list">
          <view 
            v-for="(item, index) in timeline" 
            :key="item.id"
            class="timeline-item"
            :class="{ active: index === 0 }"
          >
            <view class="timeline-dot"></view>
            <view class="timeline-content">
              <text class="timeline-date">{{ item.date }}</text>
              <text class="timeline-title">{{ item.title }}</text>
              <text class="timeline-desc">{{ item.description }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const navItems = ref([
  {
    id: 1,
    title: '院校查询',
    description: '研究生院校信息',
    icon: '🏫'
  },
  {
    id: 2,
    title: '专业目录',
    description: '专业设置详情',
    icon: '📚'
  },
  {
    id: 3,
    title: '历年真题',
    description: '真题资料下载',
    icon: '📝'
  },
  {
    id: 4,
    title: '分数线',
    description: '历年分数线查询',
    icon: '📊'
  },
  {
    id: 5,
    title: '备考经验',
    description: '学长学姐分享',
    icon: '💡'
  },
  {
    id: 6,
    title: '调剂信息',
    description: '调剂院校汇总',
    icon: '🔄'
  }
])

const universities = ref([
  {
    id: 1,
    name: '北京大学',
    location: '北京',
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400',
    admissionRatio: '10:1',
    cutoffScore: '380分',
    tags: ['985', '211', '双一流']
  },
  {
    id: 2,
    name: '清华大学',
    location: '北京',
    logo: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400',
    admissionRatio: '12:1',
    cutoffScore: '385分',
    tags: ['985', '211', '双一流']
  },
  {
    id: 3,
    name: '复旦大学',
    location: '上海',
    logo: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
    admissionRatio: '8:1',
    cutoffScore: '375分',
    tags: ['985', '211', '双一流']
  },
  {
    id: 4,
    name: '上海交通大学',
    location: '上海',
    logo: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400',
    admissionRatio: '9:1',
    cutoffScore: '370分',
    tags: ['985', '211', '双一流']
  }
])

const strategies = ref([
  {
    id: 1,
    title: '考研数学高分攻略',
    summary: '从基础到强化，系统性数学复习方法，助你数学高分上岸',
    category: '数学',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 15420
  },
  {
    id: 2,
    title: '英语阅读理解技巧',
    summary: '掌握阅读理解解题技巧，提高英语成绩的关键所在',
    category: '英语',
    image: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 12350
  },
  {
    id: 3,
    title: '政治复习时间规划',
    summary: '合理安排政治复习时间，高效备考政治科目',
    category: '政治',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 9840
  },
  {
    id: 4,
    title: '专业课复习方法',
    summary: '针对不同专业的复习策略，专业课高分秘籍',
    category: '专业课',
    image: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 18760
  }
])

const timeline = ref([
  {
    id: 1,
    date: '2024年3月',
    title: '确定目标院校和专业',
    description: '收集院校信息，确定报考目标，制定复习计划'
  },
  {
    id: 2,
    date: '2024年4-6月',
    title: '基础阶段复习',
    description: '夯实基础知识，建立知识框架，培养学习习惯'
  },
  {
    id: 3,
    date: '2024年7-9月',
    title: '强化阶段复习',
    description: '深入学习重点难点，大量练习真题，提高解题能力'
  },
  {
    id: 4,
    date: '2024年10月',
    title: '网上报名',
    description: '完成网上报名和现场确认，准备考试相关材料'
  },
  {
    id: 5,
    date: '2024年11-12月',
    title: '冲刺阶段复习',
    description: '查漏补缺，模拟考试，调整心态，准备初试'
  },
  {
    id: 6,
    date: '2024年12月',
    title: '初试考试',
    description: '参加全国硕士研究生招生考试初试'
  }
])

const navigateToSection = (nav: any) => {
  uni.showToast({
    title: `${nav.title}功能开发中`,
    icon: 'none'
  })
}

const viewUniversity = (university: any) => {
  uni.showToast({
    title: `${university.name}考研信息功能开发中`,
    icon: 'none'
  })
}

const viewStrategy = (strategy: any) => {
  uni.showToast({
    title: '攻略详情功能开发中',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.postgraduate-page {
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

.universities-section {
  padding: 48rpx 0;
  background: white;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 32rpx;
    display: block;
  }
  
  .universities-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    
    .university-item {
      display: flex;
      gap: 24rpx;
      padding: 24rpx;
      
      .university-logo {
        width: 120rpx;
        height: 120rpx;
        border-radius: 12rpx;
        flex-shrink: 0;
      }
      
      .university-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        
        .university-name {
          font-size: 32rpx;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .university-location {
          font-size: 24rpx;
          color: var(--text-secondary);
        }
        
        .university-stats {
          display: flex;
          gap: 16rpx;
          font-size: 22rpx;
          color: var(--text-muted);
          margin: 8rpx 0;
        }
        
        .university-tags {
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

.strategies-section {
  padding: 48rpx 0;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 32rpx;
    display: block;
  }
  
  .strategies-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    
    .strategy-item {
      display: flex;
      gap: 24rpx;
      padding: 24rpx;
      
      .strategy-image {
        width: 160rpx;
        height: 120rpx;
        border-radius: 12rpx;
        flex-shrink: 0;
      }
      
      .strategy-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        
        .strategy-title {
          font-size: 28rpx;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }
        
        .strategy-summary {
          font-size: 24rpx;
          color: var(--text-secondary);
          line-height: 1.4;
          flex: 1;
        }
        
        .strategy-meta {
          display: flex;
          justify-content: space-between;
          font-size: 22rpx;
          color: var(--text-muted);
        }
      }
    }
  }
}

.timeline-section {
  padding: 48rpx 0;
  background: white;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 32rpx;
    display: block;
  }
  
  .timeline-list {
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: 24rpx;
      top: 0;
      bottom: 0;
      width: 4rpx;
      background: var(--border-color);
    }
    
    .timeline-item {
      position: relative;
      padding-left: 80rpx;
      margin-bottom: 48rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .timeline-dot {
        position: absolute;
        left: 16rpx;
        top: 8rpx;
        width: 16rpx;
        height: 16rpx;
        background: var(--border-color);
        border-radius: 50%;
      }
      
      &.active .timeline-dot {
        background: var(--primary-color);
        box-shadow: 0 0 0 8rpx rgba(79, 70, 229, 0.2);
      }
      
      .timeline-content {
        .timeline-date {
          font-size: 24rpx;
          color: var(--primary-color);
          font-weight: 500;
          display: block;
          margin-bottom: 8rpx;
        }
        
        .timeline-title {
          font-size: 28rpx;
          font-weight: 600;
          color: var(--text-primary);
          display: block;
          margin-bottom: 8rpx;
        }
        
        .timeline-desc {
          font-size: 24rpx;
          color: var(--text-secondary);
          line-height: 1.4;
          display: block;
        }
      }
    }
  }
}
</style>