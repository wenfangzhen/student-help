<template>
  <view class="universities-page">
    <!-- 筛选栏 -->
    <view class="filter-section">
      <view class="container">
        <view class="filter-tabs">
          <view 
            v-for="region in regions" 
            :key="region.code"
            class="filter-tab"
            :class="{ active: selectedRegion === region.code }"
            @click="selectRegion(region.code)"
          >
            {{ region.name }}
          </view>
        </view>
        
        <view class="filter-row">
          <view class="filter-group">
            <text class="filter-label">类型：</text>
            <view class="filter-options">
              <view 
                v-for="type in universityTypes" 
                :key="type.code"
                class="filter-option"
                :class="{ selected: selectedType === type.code }"
                @click="selectType(type.code)"
              >
                {{ type.name }}
              </view>
            </view>
          </view>
          
          <view class="filter-group">
            <text class="filter-label">层次：</text>
            <view class="filter-options">
              <view 
                v-for="level in universityLevels" 
                :key="level.code"
                class="filter-option"
                :class="{ selected: selectedLevel === level.code }"
                @click="selectLevel(level.code)"
              >
                {{ level.name }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 大学列表 -->
    <view class="universities-list">
      <view class="container">
        <view v-if="loading" class="loading-container">
          <text>加载中...</text>
        </view>
        
        <view v-else-if="filteredUniversities.length === 0" class="empty-container">
          <text>暂无数据</text>
        </view>
        
        <view v-else class="universities-grid">
          <view 
            v-for="university in filteredUniversities" 
            :key="university.id"
            class="university-item card card-hover"
            @click="viewUniversity(university)"
          >
            <image class="university-logo" :src="university.logo" mode="aspectFill" />
            <view class="university-content">
              <text class="university-name">{{ university.name }}</text>
              <text class="university-location">{{ university.location }}</text>
              <view class="university-tags">
                <text class="tag">{{ university.type }}</text>
                <text class="tag">{{ university.level }}</text>
              </view>
              <text class="university-description">{{ university.description }}</text>
              <view class="university-meta">
                <view class="rating">
                  <text class="rating-score">{{ university.rating }}</text>
                  <text class="rating-text">分</text>
                </view>
                <text class="student-count">{{ university.studentCount }}人</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { get } from '@/utils/request'

interface University {
  id: string
  name: string
  location: string
  type: string
  level: string
  description: string
  logo: string
  rating: number
  studentCount: number
}

// 筛选选项
const regions = ref([
  { code: 'all', name: '全部地区' },
  { code: 'beijing', name: '北京' },
  { code: 'shanghai', name: '上海' },
  { code: 'guangdong', name: '广东' },
  { code: 'jiangsu', name: '江苏' },
  { code: 'zhejiang', name: '浙江' },
  { code: 'shandong', name: '山东' },
  { code: 'hubei', name: '湖北' },
  { code: 'hunan', name: '湖南' },
  { code: 'sichuan', name: '四川' },
  { code: 'shaanxi', name: '陕西' }
])

const universityTypes = ref([
  { code: 'all', name: '全部类型' },
  { code: 'comprehensive', name: '综合类' },
  { code: 'engineering', name: '理工类' },
  { code: 'normal', name: '师范类' },
  { code: 'medical', name: '医学类' },
  { code: 'finance', name: '财经类' },
  { code: 'agriculture', name: '农林类' },
  { code: 'art', name: '艺术类' },
  { code: 'language', name: '语言类' }
])

const universityLevels = ref([
  { code: 'all', name: '全部层次' },
  { code: 'undergraduate', name: '本科' },
  { code: 'college', name: '专科' },
  { code: '985', name: '985工程' },
  { code: '211', name: '211工程' },
  { code: 'double-first-class', name: '双一流' }
])

// 筛选状态
const selectedRegion = ref('all')
const selectedType = ref('all')
const selectedLevel = ref('all')
const loading = ref(false)

// 大学数据
const universities = ref<University[]>([
  {
    id: '1',
    name: '北京大学',
    location: '北京',
    type: '综合类',
    level: '985工程',
    description: '中国近现代第一所国立综合性大学，也是最早以"大学"之名创办的学校。',
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 9.5,
    studentCount: 45000
  },
  {
    id: '2',
    name: '清华大学',
    location: '北京',
    type: '理工类',
    level: '985工程',
    description: '中国著名高等学府，坐落于北京西北郊风景秀丽的清华园。',
    logo: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 9.4,
    studentCount: 48000
  },
  {
    id: '3',
    name: '复旦大学',
    location: '上海',
    type: '综合类',
    level: '985工程',
    description: '中国人自主创办的第一所高等院校，"博学而笃行，切问而近思"。',
    logo: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 9.2,
    studentCount: 32000
  },
  {
    id: '4',
    name: '上海交通大学',
    location: '上海',
    type: '理工类',
    level: '985工程',
    description: '历史悠久、声誉卓著的高等学府，是中国历史最悠久、享誉海内外的高等学府之一。',
    logo: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 9.1,
    studentCount: 40000
  },
  {
    id: '5',
    name: '浙江大学',
    location: '浙江',
    type: '综合类',
    level: '985工程',
    description: '历史悠久、声誉卓著的高等学府，坐落于中国历史文化名城、风景旅游胜地杭州。',
    logo: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 9.0,
    studentCount: 55000
  },
  {
    id: '6',
    name: '中山大学',
    location: '广东',
    type: '综合类',
    level: '985工程',
    description: '由孙中山先生创办，有着一百多年办学传统，是中国南方科学研究、文化学术与人才培养的重镇。',
    logo: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 8.8,
    studentCount: 50000
  }
])

// 计算过滤后的大学列表
const filteredUniversities = computed(() => {
  return universities.value.filter(university => {
    const regionMatch = selectedRegion.value === 'all' || 
      (selectedRegion.value === 'beijing' && university.location === '北京') ||
      (selectedRegion.value === 'shanghai' && university.location === '上海') ||
      (selectedRegion.value === 'guangdong' && university.location === '广东') ||
      (selectedRegion.value === 'zhejiang' && university.location === '浙江')
    
    const typeMatch = selectedType.value === 'all' || 
      (selectedType.value === 'comprehensive' && university.type === '综合类') ||
      (selectedType.value === 'engineering' && university.type === '理工类')
    
    const levelMatch = selectedLevel.value === 'all' || 
      (selectedLevel.value === '985' && university.level === '985工程')
    
    return regionMatch && typeMatch && levelMatch
  })
})

// 筛选方法
const selectRegion = (code: string) => {
  selectedRegion.value = code
}

const selectType = (code: string) => {
  selectedType.value = code
}

const selectLevel = (code: string) => {
  selectedLevel.value = code
}

// 查看大学详情
const viewUniversity = (university: University) => {
  uni.navigateTo({
    url: `/pages/universities/detail?id=${university.id}`
  })
}

// 加载数据
const loadUniversities = async () => {
  loading.value = true
  try {
    // 这里可以调用API获取数据
    // const response = await get('/universities')
    // universities.value = response.data
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('加载大学数据失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUniversities()
})
</script>

<style lang="scss" scoped>
.universities-page {
  min-height: 100vh;
  background: var(--background);
}

.filter-section {
  background: white;
  padding: 24rpx 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  
  .filter-tabs {
    display: flex;
    gap: 16rpx;
    margin-bottom: 24rpx;
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
  
  .filter-row {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    
    .filter-group {
      display: flex;
      align-items: center;
      gap: 16rpx;
      
      .filter-label {
        font-size: 24rpx;
        color: var(--text-primary);
        white-space: nowrap;
      }
      
      .filter-options {
        display: flex;
        gap: 12rpx;
        flex-wrap: wrap;
        
        .filter-option {
          padding: 8rpx 16rpx;
          background: #f8fafc;
          border-radius: 16rpx;
          color: var(--text-secondary);
          font-size: 22rpx;
          transition: all 0.3s ease;
          
          &.selected {
            background: var(--primary-color);
            color: white;
          }
        }
      }
    }
  }
}

.universities-list {
  padding: 32rpx 0;
  
  .loading-container,
  .empty-container {
    text-align: center;
    padding: 80rpx 0;
    color: var(--text-muted);
    font-size: 28rpx;
  }
  
  .universities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300rpx, 1fr));
    gap: 24rpx;
    
    @media (max-width: 750px) {
      grid-template-columns: 1fr;
    }
    
    .university-item {
      display: flex;
      flex-direction: column;
      padding: 24rpx;
      
      .university-logo {
        width: 100%;
        height: 200rpx;
        border-radius: 12rpx;
        margin-bottom: 16rpx;
      }
      
      .university-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;
        
        .university-name {
          font-size: 32rpx;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
        }
        
        .university-location {
          font-size: 24rpx;
          color: var(--text-secondary);
        }
        
        .university-tags {
          display: flex;
          gap: 8rpx;
          margin: 8rpx 0;
          
          .tag {
            padding: 4rpx 12rpx;
            background: #e0f2fe;
            color: var(--secondary-color);
            border-radius: 12rpx;
            font-size: 20rpx;
          }
        }
        
        .university-description {
          font-size: 24rpx;
          color: var(--text-secondary);
          line-height: 1.4;
          flex: 1;
        }
        
        .university-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16rpx;
          
          .rating {
            display: flex;
            align-items: baseline;
            gap: 4rpx;
            
            .rating-score {
              font-size: 28rpx;
              font-weight: 700;
              color: var(--accent-color);
            }
            
            .rating-text {
              font-size: 20rpx;
              color: var(--text-muted);
            }
          }
          
          .student-count {
            font-size: 22rpx;
            color: var(--text-muted);
          }
        }
      }
    }
  }
}
</style>