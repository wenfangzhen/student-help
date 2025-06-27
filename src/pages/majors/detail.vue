<template>
  <view class="major-detail-page">
    <!-- 专业头部信息 -->
    <view class="major-header">
      <view class="container">
        <view class="major-info">
          <text class="major-name">{{ major.name }}</text>
          <text class="major-english-name">{{ major.englishName }}</text>
          <view class="major-tags">
            <text class="tag">{{ major.category }}</text>
            <text class="tag">{{ major.degreeLevel }}</text>
            <text class="tag">{{ major.duration }}年制</text>
          </view>
          <view class="rating-section">
            <view class="rating-item">
              <text class="rating-label">综合评分</text>
              <text class="rating-score">{{ major.rating?.overall || 0 }}</text>
            </view>
            <view class="rating-item">
              <text class="rating-label">就业前景</text>
              <text class="rating-score">{{ major.rating?.prospects || 0 }}</text>
            </view>
            <view class="rating-item">
              <text class="rating-label">学习难度</text>
              <text class="rating-score">{{ major.rating?.difficulty || 0 }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 专业详情内容 -->
    <view class="major-content">
      <view class="container">
        <!-- 专业概述 -->
        <view class="section card">
          <text class="section-title">专业概述</text>
          <text class="section-content">{{ major.description }}</text>
        </view>

        <!-- 核心课程 -->
        <view class="section card">
          <text class="section-title">核心课程</text>
          <view class="course-list">
            <text 
              v-for="course in major.curriculum?.coreSubjects" 
              :key="course"
              class="course-item"
            >
              {{ course }}
            </text>
          </view>
        </view>

        <!-- 就业方向 -->
        <view class="section card">
          <text class="section-title">就业方向</text>
          <view class="career-list">
            <view 
              v-for="career in major.career?.directions" 
              :key="career.title"
              class="career-item"
            >
              <text class="career-title">{{ career.title }}</text>
              <text class="career-desc">{{ career.description }}</text>
            </view>
          </view>
        </view>

        <!-- 开设院校 -->
        <view class="section card">
          <text class="section-title">开设院校</text>
          <view class="universities-list">
            <view 
              v-for="university in major.universities" 
              :key="university._id"
              class="university-item"
              @click="viewUniversity(university._id)"
            >
              <image class="university-logo" :src="university.logo" mode="aspectFill" />
              <view class="university-info">
                <text class="university-name">{{ university.name }}</text>
                <text class="university-location">{{ university.location?.province }}{{ university.location?.city }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { get } from '@/utils/request'

interface Major {
  _id: string
  name: string
  englishName: string
  category: string
  degreeLevel: string
  duration: number
  description: string
  curriculum?: {
    coreSubjects: string[]
  }
  career?: {
    directions: Array<{
      title: string
      description: string
    }>
  }
  rating?: {
    overall: number
    prospects: number
    difficulty: number
  }
  universities: Array<{
    _id: string
    name: string
    logo: string
    location: {
      province: string
      city: string
    }
  }>
}

const major = ref<Major>({
  _id: '',
  name: '',
  englishName: '',
  category: '',
  degreeLevel: '',
  duration: 4,
  description: '',
  universities: []
})

const majorId = ref('')

const loadMajorDetail = async () => {
  try {
    const response = await get(`/majors/${majorId.value}`)
    if (response.success) {
      major.value = response.data
    }
  } catch (error) {
    console.error('加载专业详情失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'error'
    })
  }
}

const viewUniversity = (universityId: string) => {
  uni.navigateTo({
    url: `/pages/universities/detail?id=${universityId}`
  })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  majorId.value = currentPage.options?.id || ''
  
  if (majorId.value) {
    loadMajorDetail()
  }
})
</script>

<style lang="scss" scoped>
.major-detail-page {
  min-height: 100vh;
  background: var(--background);
}

.major-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 48rpx 0;
  
  .major-info {
    text-align: center;
    
    .major-name {
      font-size: 48rpx;
      font-weight: 700;
      display: block;
      margin-bottom: 16rpx;
    }
    
    .major-english-name {
      font-size: 28rpx;
      opacity: 0.9;
      display: block;
      margin-bottom: 24rpx;
    }
    
    .major-tags {
      display: flex;
      justify-content: center;
      gap: 16rpx;
      margin-bottom: 32rpx;
      
      .tag {
        padding: 8rpx 16rpx;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 16rpx;
        font-size: 24rpx;
      }
    }
    
    .rating-section {
      display: flex;
      justify-content: center;
      gap: 48rpx;
      
      .rating-item {
        text-align: center;
        
        .rating-label {
          font-size: 24rpx;
          opacity: 0.8;
          display: block;
          margin-bottom: 8rpx;
        }
        
        .rating-score {
          font-size: 36rpx;
          font-weight: 700;
          display: block;
        }
      }
    }
  }
}

.major-content {
  padding: 32rpx 0;
  
  .section {
    margin-bottom: 32rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 24rpx;
      display: block;
    }
    
    .section-content {
      font-size: 28rpx;
      color: var(--text-secondary);
      line-height: 1.6;
      display: block;
    }
  }
  
  .course-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    
    .course-item {
      padding: 12rpx 24rpx;
      background: #f0f9ff;
      color: var(--secondary-color);
      border-radius: 20rpx;
      font-size: 24rpx;
    }
  }
  
  .career-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    
    .career-item {
      .career-title {
        font-size: 28rpx;
        font-weight: 600;
        color: var(--text-primary);
        display: block;
        margin-bottom: 8rpx;
      }
      
      .career-desc {
        font-size: 24rpx;
        color: var(--text-secondary);
        line-height: 1.5;
        display: block;
      }
    }
  }
  
  .universities-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    
    .university-item {
      display: flex;
      align-items: center;
      gap: 16rpx;
      padding: 16rpx;
      background: #f8fafc;
      border-radius: 12rpx;
      
      .university-logo {
        width: 80rpx;
        height: 80rpx;
        border-radius: 8rpx;
      }
      
      .university-info {
        flex: 1;
        
        .university-name {
          font-size: 28rpx;
          font-weight: 600;
          color: var(--text-primary);
          display: block;
          margin-bottom: 4rpx;
        }
        
        .university-location {
          font-size: 24rpx;
          color: var(--text-secondary);
          display: block;
        }
      }
    }
  }
}
</style>