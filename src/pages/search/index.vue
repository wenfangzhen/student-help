<template>
  <view class="search-page">
    <!-- 搜索栏 -->
    <view class="search-header">
      <view class="container">
        <view class="search-box">
          <input 
            class="search-input"
            type="text"
            v-model="searchQuery"
            placeholder="搜索大学、专业、问题..."
            @input="handleSearch"
            @confirm="handleSearchConfirm"
          />
          <view class="search-btn" @click="handleSearchConfirm">
            <text class="search-icon">🔍</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索类型切换 -->
    <view class="search-tabs">
      <view class="container">
        <view class="tabs-list">
          <view 
            v-for="tab in searchTabs" 
            :key="tab.type"
            class="tab-item"
            :class="{ active: activeTab === tab.type }"
            @click="switchTab(tab.type)"
          >
            {{ tab.name }}
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-results">
      <view class="container">
        <view v-if="loading" class="loading-container">
          <text>搜索中...</text>
        </view>
        
        <view v-else-if="searchQuery && searchResults.length === 0" class="empty-container">
          <text>未找到相关结果</text>
        </view>
        
        <view v-else-if="searchResults.length > 0" class="results-list">
          <!-- 大学搜索结果 -->
          <view 
            v-if="activeTab === 'universities'"
            v-for="university in searchResults" 
            :key="university._id"
            class="result-item card card-hover"
            @click="viewUniversity(university._id)"
          >
            <image class="result-image" :src="university.logo" mode="aspectFill" />
            <view class="result-content">
              <text class="result-title">{{ university.name }}</text>
              <text class="result-subtitle">{{ university.location?.province }}{{ university.location?.city }}</text>
              <text class="result-description">{{ university.description }}</text>
              <view class="result-tags">
                <text class="tag">{{ university.type }}</text>
                <text class="tag">{{ university.level }}</text>
              </view>
            </view>
          </view>
          
          <!-- 专业搜索结果 -->
          <view 
            v-if="activeTab === 'majors'"
            v-for="major in searchResults" 
            :key="major._id"
            class="result-item card card-hover"
            @click="viewMajor(major._id)"
          >
            <view class="result-content">
              <text class="result-title">{{ major.name }}</text>
              <text class="result-subtitle">{{ major.category }} · {{ major.degreeLevel }}</text>
              <text class="result-description">{{ major.description }}</text>
              <view class="result-meta">
                <text class="meta-item">学制：{{ major.duration }}年</text>
                <text class="meta-item">评分：{{ major.rating?.overall || 0 }}</text>
              </view>
            </view>
          </view>
          
          <!-- 帖子搜索结果 -->
          <view 
            v-if="activeTab === 'posts'"
            v-for="post in searchResults" 
            :key="post._id"
            class="result-item card card-hover"
            @click="viewPost(post._id)"
          >
            <view class="result-content">
              <text class="result-title">{{ post.title }}</text>
              <text class="result-subtitle">{{ post.category }}</text>
              <text class="result-description">{{ post.content.substring(0, 100) }}...</text>
              <view class="result-meta">
                <text class="meta-item">作者：{{ post.author?.username }}</text>
                <text class="meta-item">{{ formatDate(post.createdAt) }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 热门搜索 -->
        <view v-else class="hot-searches">
          <text class="section-title">热门搜索</text>
          <view class="hot-tags">
            <text 
              v-for="tag in hotSearches" 
              :key="tag"
              class="hot-tag"
              @click="searchHotTag(tag)"
            >
              {{ tag }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { get } from '@/utils/request'
import dayjs from 'dayjs'

const searchQuery = ref('')
const activeTab = ref('universities')
const loading = ref(false)
const searchResults = ref([])

const searchTabs = ref([
  { type: 'universities', name: '大学' },
  { type: 'majors', name: '专业' },
  { type: 'posts', name: '帖子' }
])

const hotSearches = ref([
  '北京大学', '清华大学', '计算机科学', '金融学', 
  '宿舍环境', '食堂评价', '考研经验', '就业前景'
])

let searchTimer: any = null

const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  searchTimer = setTimeout(() => {
    if (searchQuery.value.trim()) {
      performSearch()
    } else {
      searchResults.value = []
    }
  }, 500)
}

const handleSearchConfirm = () => {
  if (searchQuery.value.trim()) {
    performSearch()
  }
}

const performSearch = async () => {
  loading.value = true
  
  try {
    let endpoint = ''
    const params = {
      search: searchQuery.value,
      limit: 20
    }
    
    switch (activeTab.value) {
      case 'universities':
        endpoint = '/universities'
        break
      case 'majors':
        endpoint = '/majors'
        break
      case 'posts':
        endpoint = '/posts'
        break
    }
    
    const response = await get(endpoint, params)
    if (response.success) {
      searchResults.value = response.data[activeTab.value] || response.data.posts || []
    }
  } catch (error) {
    console.error('搜索失败:', error)
    uni.showToast({
      title: '搜索失败',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const switchTab = (type: string) => {
  activeTab.value = type
  if (searchQuery.value.trim()) {
    performSearch()
  }
}

const searchHotTag = (tag: string) => {
  searchQuery.value = tag
  performSearch()
}

const viewUniversity = (id: string) => {
  uni.navigateTo({
    url: `/pages/universities/detail?id=${id}`
  })
}

const viewMajor = (id: string) => {
  uni.navigateTo({
    url: `/pages/majors/detail?id=${id}`
  })
}

const viewPost = (id: string) => {
  uni.showToast({
    title: '帖子详情功能开发中',
    icon: 'none'
  })
}

const formatDate = (date: string) => {
  return dayjs(date).format('MM-DD')
}

watch(activeTab, () => {
  searchResults.value = []
})
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: var(--background);
}

.search-header {
  background: white;
  padding: 24rpx 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  
  .search-box {
    display: flex;
    align-items: center;
    background: #f8fafc;
    border-radius: 24rpx;
    padding: 8rpx;
    
    .search-input {
      flex: 1;
      padding: 16rpx 24rpx;
      font-size: 28rpx;
      color: var(--text-primary);
      background: transparent;
      border: none;
      outline: none;
    }
    
    .search-btn {
      padding: 16rpx 20rpx;
      background: var(--primary-color);
      border-radius: 20rpx;
      
      .search-icon {
        color: white;
        font-size: 28rpx;
      }
    }
  }
}

.search-tabs {
  background: white;
  padding: 16rpx 0;
  border-bottom: 1rpx solid var(--border-color);
  
  .tabs-list {
    display: flex;
    gap: 32rpx;
    
    .tab-item {
      padding: 16rpx 24rpx;
      font-size: 28rpx;
      color: var(--text-secondary);
      border-radius: 20rpx;
      transition: all 0.3s ease;
      
      &.active {
        background: var(--primary-color);
        color: white;
      }
    }
  }
}

.search-results {
  padding: 32rpx 0;
  
  .loading-container,
  .empty-container {
    text-align: center;
    padding: 80rpx 0;
    color: var(--text-muted);
    font-size: 28rpx;
  }
  
  .results-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    
    .result-item {
      display: flex;
      gap: 16rpx;
      padding: 24rpx;
      
      .result-image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 12rpx;
        flex-shrink: 0;
      }
      
      .result-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        
        .result-title {
          font-size: 32rpx;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }
        
        .result-subtitle {
          font-size: 24rpx;
          color: var(--text-secondary);
        }
        
        .result-description {
          font-size: 24rpx;
          color: var(--text-secondary);
          line-height: 1.4;
          flex: 1;
        }
        
        .result-tags {
          display: flex;
          gap: 8rpx;
          
          .tag {
            padding: 4rpx 12rpx;
            background: #e0f2fe;
            color: var(--secondary-color);
            border-radius: 12rpx;
            font-size: 20rpx;
          }
        }
        
        .result-meta {
          display: flex;
          gap: 16rpx;
          font-size: 22rpx;
          color: var(--text-muted);
        }
      }
    }
  }
  
  .hot-searches {
    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 24rpx;
      display: block;
    }
    
    .hot-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;
      
      .hot-tag {
        padding: 16rpx 24rpx;
        background: white;
        color: var(--text-primary);
        border-radius: 20rpx;
        font-size: 24rpx;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
        
        &:hover {
          background: var(--primary-color);
          color: white;
        }
      }
    }
  }
}
</style>