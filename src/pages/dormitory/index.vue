<template>
  <view class="dormitory-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="container">
        <text class="page-title">宿舍实拍</text>
        <text class="page-subtitle">真实宿舍环境，提前了解住宿条件</text>
      </view>
    </view>

    <!-- 筛选栏 -->
    <view class="filter-section">
      <view class="container">
        <view class="filter-tabs">
          <view 
            v-for="type in dormitoryTypes" 
            :key="type.code"
            class="filter-tab"
            :class="{ active: selectedType === type.code }"
            @click="selectType(type.code)"
          >
            {{ type.name }}
          </view>
        </view>
      </view>
    </view>

    <!-- 宿舍列表 -->
    <view class="dormitory-list">
      <view class="container">
        <view v-if="loading" class="loading-container">
          <text>加载中...</text>
        </view>
        
        <view v-else-if="dormitories.length === 0" class="empty-container">
          <text>暂无数据</text>
        </view>
        
        <view v-else class="dormitories-grid">
          <view 
            v-for="dormitory in dormitories" 
            :key="dormitory.id"
            class="dormitory-item card card-hover"
            @click="viewDormitory(dormitory)"
          >
            <image class="dormitory-image" :src="dormitory.coverImage" mode="aspectFill" />
            <view class="dormitory-content">
              <text class="dormitory-title">{{ dormitory.title }}</text>
              <text class="dormitory-university">{{ dormitory.university }}</text>
              <view class="dormitory-tags">
                <text class="tag">{{ dormitory.type }}</text>
                <text class="tag">{{ dormitory.capacity }}人间</text>
                <text class="tag">{{ dormitory.hasAircon ? '有空调' : '无空调' }}</text>
              </view>
              <text class="dormitory-description">{{ dormitory.description }}</text>
              <view class="dormitory-meta">
                <text class="meta-item">{{ dormitory.imageCount }}张图片</text>
                <text class="meta-item">{{ dormitory.views }}次浏览</text>
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

interface Dormitory {
  id: string
  title: string
  university: string
  type: string
  capacity: number
  hasAircon: boolean
  description: string
  coverImage: string
  imageCount: number
  views: number
}

const dormitoryTypes = ref([
  { code: 'all', name: '全部类型' },
  { code: 'standard', name: '标准宿舍' },
  { code: 'apartment', name: '公寓式' },
  { code: 'suite', name: '套间' },
  { code: 'single', name: '单人间' }
])

const selectedType = ref('all')
const loading = ref(false)

const dormitories = ref<Dormitory[]>([
  {
    id: '1',
    title: '北京大学燕园学生公寓',
    university: '北京大学',
    type: '公寓式',
    capacity: 4,
    hasAircon: true,
    description: '现代化学生公寓，设施齐全，环境优美，配备独立卫浴和空调系统。',
    coverImage: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400',
    imageCount: 12,
    views: 2580
  },
  {
    id: '2',
    title: '清华大学紫荆学生公寓',
    university: '清华大学',
    type: '标准宿舍',
    capacity: 6,
    hasAircon: true,
    description: '传统风格宿舍，宽敞明亮，配备现代化设施，学习生活两不误。',
    coverImage: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400',
    imageCount: 8,
    views: 1920
  },
  {
    id: '3',
    title: '复旦大学本部学生宿舍',
    university: '复旦大学',
    type: '套间',
    capacity: 2,
    hasAircon: true,
    description: '精装修套间，私密性好，适合研究生居住，配备独立学习区域。',
    coverImage: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
    imageCount: 15,
    views: 3240
  },
  {
    id: '4',
    title: '上海交大闵行校区宿舍',
    university: '上海交通大学',
    type: '公寓式',
    capacity: 4,
    hasAircon: true,
    description: '新建学生公寓，设计现代，功能齐全，是理想的学习生活场所。',
    coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    imageCount: 10,
    views: 1680
  },
  {
    id: '5',
    title: '浙江大学紫金港校区宿舍',
    university: '浙江大学',
    type: '标准宿舍',
    capacity: 4,
    hasAircon: false,
    description: '经典四人间宿舍，布局合理，采光良好，性价比高。',
    coverImage: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400',
    imageCount: 6,
    views: 1350
  },
  {
    id: '6',
    title: '中山大学珠海校区宿舍',
    university: '中山大学',
    type: '单人间',
    capacity: 1,
    hasAircon: true,
    description: '独立单人间，私密性极佳，适合需要安静学习环境的学生。',
    coverImage: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400',
    imageCount: 9,
    views: 2100
  }
])

const filteredDormitories = ref<Dormitory[]>([])

const selectType = (code: string) => {
  selectedType.value = code
  filterDormitories()
}

const filterDormitories = () => {
  if (selectedType.value === 'all') {
    filteredDormitories.value = dormitories.value
  } else {
    filteredDormitories.value = dormitories.value.filter(dormitory => {
      switch (selectedType.value) {
        case 'standard':
          return dormitory.type === '标准宿舍'
        case 'apartment':
          return dormitory.type === '公寓式'
        case 'suite':
          return dormitory.type === '套间'
        case 'single':
          return dormitory.type === '单人间'
        default:
          return true
      }
    })
  }
}

const viewDormitory = (dormitory: Dormitory) => {
  uni.showToast({
    title: '宿舍详情功能开发中',
    icon: 'none'
  })
}

onMounted(() => {
  filterDormitories()
})
</script>

<style lang="scss" scoped>
.dormitory-page {
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

.filter-section {
  background: white;
  padding: 24rpx 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  
  .filter-tabs {
    display: flex;
    gap: 16rpx;
    overflow-x: auto;
    padding-bottom: 8rpx;
    
    .filter-tab {
      padding: 16rpx 24rpx;
      background: #f8fafc;
      border-radius: 20rpx;
      color: var(--text-secondary);
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

.dormitory-list {
  padding: 32rpx 0;
  
  .loading-container,
  .empty-container {
    text-align: center;
    padding: 80rpx 0;
    color: var(--text-muted);
    font-size: 28rpx;
  }
  
  .dormitories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300rpx, 1fr));
    gap: 24rpx;
    
    @media (max-width: 750px) {
      grid-template-columns: 1fr;
    }
    
    .dormitory-item {
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
      
      .dormitory-image {
        width: 100%;
        height: 200rpx;
      }
      
      .dormitory-content {
        padding: 24rpx;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        
        .dormitory-title {
          font-size: 28rpx;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }
        
        .dormitory-university {
          font-size: 24rpx;
          color: var(--text-secondary);
        }
        
        .dormitory-tags {
          display: flex;
          gap: 8rpx;
          margin: 8rpx 0;
          flex-wrap: wrap;
          
          .tag {
            padding: 4rpx 12rpx;
            background: #e0f2fe;
            color: var(--secondary-color);
            border-radius: 12rpx;
            font-size: 20rpx;
          }
        }
        
        .dormitory-description {
          font-size: 24rpx;
          color: var(--text-secondary);
          line-height: 1.4;
          flex: 1;
        }
        
        .dormitory-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 16rpx;
          font-size: 22rpx;
          color: var(--text-muted);
        }
      }
    }
  }
}
</style>