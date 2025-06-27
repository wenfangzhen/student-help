<template>
  <view class="alumni-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="container">
        <text class="page-title">校友故事</text>
        <text class="page-subtitle">分享成长经历，传递正能量</text>
      </view>
    </view>

    <!-- 分类筛选 -->
    <view class="category-section">
      <view class="container">
        <scroll-view class="category-scroll" scroll-x>
          <view class="category-list">
            <view 
              v-for="category in categories" 
              :key="category.code"
              class="category-item"
              :class="{ active: selectedCategory === category.code }"
              @click="selectCategory(category.code)"
            >
              {{ category.name }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 校友故事列表 -->
    <view class="stories-section">
      <view class="container">
        <view v-if="loading" class="loading-container">
          <text>加载中...</text>
        </view>
        
        <view v-else-if="stories.length === 0" class="empty-container">
          <text>暂无故事</text>
        </view>
        
        <view v-else class="stories-list">
          <view 
            v-for="story in stories" 
            :key="story.id"
            class="story-item card card-hover"
            @click="viewStory(story)"
          >
            <image class="story-image" :src="story.avatar" mode="aspectFill" />
            <view class="story-content">
              <text class="story-title">{{ story.title }}</text>
              <view class="alumni-info">
                <text class="alumni-name">{{ story.alumniName }}</text>
                <text class="alumni-details">{{ story.university }} · {{ story.major }} · {{ story.graduationYear }}届</text>
              </view>
              <text class="story-excerpt">{{ story.excerpt }}</text>
              <view class="story-tags">
                <text class="tag">{{ story.category }}</text>
                <text class="tag">{{ story.industry }}</text>
              </view>
              <view class="story-meta">
                <text class="meta-item">{{ story.readCount }}次阅读</text>
                <text class="meta-item">{{ formatDate(story.publishDate) }}</text>
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
import dayjs from 'dayjs'

interface AlumniStory {
  id: string
  title: string
  alumniName: string
  university: string
  major: string
  graduationYear: number
  category: string
  industry: string
  excerpt: string
  avatar: string
  readCount: number
  publishDate: string
}

const categories = ref([
  { code: 'all', name: '全部故事' },
  { code: 'career', name: '职业发展' },
  { code: 'entrepreneurship', name: '创业经历' },
  { code: 'academic', name: '学术成就' },
  { code: 'social', name: '社会贡献' },
  { code: 'life', name: '人生感悟' }
])

const selectedCategory = ref('all')
const loading = ref(false)

const stories = ref<AlumniStory[]>([
  {
    id: '1',
    title: '从北大计算机到互联网创业的十年路',
    alumniName: '张明',
    university: '北京大学',
    major: '计算机科学与技术',
    graduationYear: 2013,
    category: '创业经历',
    industry: '互联网',
    excerpt: '回顾我从北大毕业后的十年创业路，从初入职场的青涩到如今公司上市，每一步都充满挑战与收获...',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400',
    readCount: 15420,
    publishDate: '2024-01-15'
  },
  {
    id: '2',
    title: '清华女博士的科研之路',
    alumniName: '李雪',
    university: '清华大学',
    major: '材料科学与工程',
    graduationYear: 2018,
    category: '学术成就',
    industry: '科研院所',
    excerpt: '作为一名女性科研工作者，我想分享我在材料科学领域的研究经历和心得体会...',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400',
    readCount: 8960,
    publishDate: '2024-01-12'
  },
  {
    id: '3',
    title: '复旦金融系毕业生的华尔街奋斗史',
    alumniName: '王强',
    university: '复旦大学',
    major: '金融学',
    graduationYear: 2015,
    category: '职业发展',
    industry: '金融',
    excerpt: '从上海到纽约，从分析师到基金经理，分享我在华尔街的成长经历和职场感悟...',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400',
    readCount: 12350,
    publishDate: '2024-01-10'
  },
  {
    id: '4',
    title: '用教育改变山区孩子命运的支教老师',
    alumniName: '陈美',
    university: '北京师范大学',
    major: '教育学',
    graduationYear: 2016,
    category: '社会贡献',
    industry: '教育',
    excerpt: '毕业后我选择到贵州山区支教，五年来见证了无数孩子的成长，也收获了人生最宝贵的财富...',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400',
    readCount: 18760,
    publishDate: '2024-01-08'
  },
  {
    id: '5',
    title: '中年转行的勇气与收获',
    alumniName: '刘建',
    university: '上海交通大学',
    major: '机械工程',
    graduationYear: 2005,
    category: '人生感悟',
    industry: '设计',
    excerpt: '35岁那年，我放弃了稳定的工程师工作，转行做设计师。这个决定改变了我的人生轨迹...',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400',
    readCount: 9840,
    publishDate: '2024-01-05'
  }
])

const filteredStories = ref<AlumniStory[]>([])

const selectCategory = (code: string) => {
  selectedCategory.value = code
  filterStories()
}

const filterStories = () => {
  if (selectedCategory.value === 'all') {
    filteredStories.value = stories.value
  } else {
    filteredStories.value = stories.value.filter(story => {
      switch (selectedCategory.value) {
        case 'career':
          return story.category === '职业发展'
        case 'entrepreneurship':
          return story.category === '创业经历'
        case 'academic':
          return story.category === '学术成就'
        case 'social':
          return story.category === '社会贡献'
        case 'life':
          return story.category === '人生感悟'
        default:
          return true
      }
    })
  }
}

const viewStory = (story: AlumniStory) => {
  uni.showToast({
    title: '故事详情功能开发中',
    icon: 'none'
  })
}

const formatDate = (date: string) => {
  return dayjs(date).format('MM-DD')
}

onMounted(() => {
  filterStories()
})
</script>

<style lang="scss" scoped>
.alumni-page {
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

.category-section {
  background: white;
  padding: 16rpx 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  
  .category-scroll {
    white-space: nowrap;
    
    .category-list {
      display: inline-flex;
      gap: 16rpx;
      padding: 0 32rpx;
      
      .category-item {
        padding: 16rpx 24rpx;
        background: #f8fafc;
        color: var(--text-secondary);
        border-radius: 20rpx;
        font-size: 24rpx;
        white-space: nowrap;
        transition: all 0.3s ease;
        
        &.active {
          background: var(--primary-color);
          color: white;
        }
      }
    }
  }
}

.stories-section {
  padding: 32rpx 0;
  
  .loading-container,
  .empty-container {
    text-align: center;
    padding: 80rpx 0;
    color: var(--text-muted);
    font-size: 28rpx;
  }
  
  .stories-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    
    .story-item {
      display: flex;
      gap: 24rpx;
      padding: 24rpx;
      
      .story-image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 60rpx;
        flex-shrink: 0;
      }
      
      .story-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        
        .story-title {
          font-size: 32rpx;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
          margin-bottom: 8rpx;
        }
        
        .alumni-info {
          margin-bottom: 8rpx;
          
          .alumni-name {
            font-size: 26rpx;
            font-weight: 500;
            color: var(--text-primary);
            display: block;
            margin-bottom: 4rpx;
          }
          
          .alumni-details {
            font-size: 22rpx;
            color: var(--text-secondary);
            display: block;
          }
        }
        
        .story-excerpt {
          font-size: 24rpx;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 12rpx;
        }
        
        .story-tags {
          display: flex;
          gap: 8rpx;
          margin-bottom: 12rpx;
          
          .tag {
            padding: 4rpx 12rpx;
            background: #e0f2fe;
            color: var(--secondary-color);
            border-radius: 12rpx;
            font-size: 20rpx;
          }
        }
        
        .story-meta {
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