<template>
  <view class="forum-page">
    <!-- 分类导航 -->
    <view class="category-nav">
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

    <!-- 帖子列表 -->
    <view class="posts-section">
      <view class="container">
        <view v-if="loading" class="loading-container">
          <text>加载中...</text>
        </view>
        
        <view v-else-if="posts.length === 0" class="empty-container">
          <text>暂无帖子</text>
        </view>
        
        <view v-else class="posts-list">
          <view 
            v-for="post in posts" 
            :key="post._id"
            class="post-item card card-hover"
            @click="viewPost(post._id)"
          >
            <view class="post-header">
              <image class="author-avatar" :src="post.author?.avatar" mode="aspectFill" />
              <view class="author-info">
                <text class="author-name">{{ post.author?.username }}</text>
                <text class="post-time">{{ formatDate(post.createdAt) }}</text>
              </view>
              <view class="post-category">
                <text class="category-tag">{{ post.category }}</text>
              </view>
            </view>
            
            <view class="post-content">
              <text class="post-title">{{ post.title }}</text>
              <text class="post-excerpt">{{ post.content.substring(0, 150) }}...</text>
              
              <view v-if="post.images && post.images.length > 0" class="post-images">
                <image 
                  v-for="(image, index) in post.images.slice(0, 3)" 
                  :key="index"
                  class="post-image"
                  :src="image.url"
                  mode="aspectFill"
                />
              </view>
            </view>
            
            <view class="post-footer">
              <view class="post-stats">
                <view class="stat-item">
                  <text class="stat-icon">👁</text>
                  <text class="stat-text">{{ post.stats?.views || 0 }}</text>
                </view>
                <view class="stat-item">
                  <text class="stat-icon">👍</text>
                  <text class="stat-text">{{ post.stats?.likes || 0 }}</text>
                </view>
                <view class="stat-item">
                  <text class="stat-icon">💬</text>
                  <text class="stat-text">{{ post.stats?.comments || 0 }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 发帖按钮 -->
    <view class="fab-container">
      <view class="fab-btn" @click="createPost">
        <text class="fab-icon">✏️</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { get } from '@/utils/request'
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'

const userStore = useUserStore()

interface Post {
  _id: string
  title: string
  content: string
  category: string
  author: {
    username: string
    avatar: string
  }
  images?: Array<{
    url: string
  }>
  stats: {
    views: number
    likes: number
    comments: number
  }
  createdAt: string
}

const categories = ref([
  { code: 'all', name: '全部' },
  { code: '住宿体验', name: '住宿体验' },
  { code: '教学质量', name: '教学质量' },
  { code: '校园活动', name: '校园活动' },
  { code: '食堂评价', name: '食堂评价' },
  { code: '学习心得', name: '学习心得' },
  { code: '就业经验', name: '就业经验' },
  { code: '考研经验', name: '考研经验' },
  { code: '留学经验', name: '留学经验' },
  { code: '社团活动', name: '社团活动' },
  { code: '校园生活', name: '校园生活' },
  { code: '学术讨论', name: '学术讨论' },
  { code: '求助问答', name: '求助问答' },
  { code: '其他', name: '其他' }
])

const selectedCategory = ref('all')
const posts = ref<Post[]>([])
const loading = ref(false)

const selectCategory = (code: string) => {
  selectedCategory.value = code
  loadPosts()
}

const loadPosts = async () => {
  loading.value = true
  
  try {
    const params: any = {
      page: 1,
      limit: 20
    }
    
    if (selectedCategory.value !== 'all') {
      params.category = selectedCategory.value
    }
    
    const response = await get('/posts', params)
    if (response.success) {
      posts.value = response.data.posts || []
    }
  } catch (error) {
    console.error('加载帖子失败:', error)
    // 使用模拟数据
    posts.value = [
      {
        _id: '1',
        title: '北京大学宿舍生活分享',
        content: '作为一名北大的学生，我想和大家分享一下我们学校的宿舍生活。北大的宿舍条件整体来说还是不错的，特别是新建的宿舍楼，设施比较完善...',
        category: '住宿体验',
        author: {
          username: '北大小李',
          avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        images: [
          { url: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400' }
        ],
        stats: {
          views: 1250,
          likes: 89,
          comments: 23
        },
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        title: '清华大学食堂美食推荐',
        content: '清华的食堂真的是太棒了！今天给大家推荐几个我最爱的食堂和菜品。首先是桃李园，这里的川菜做得特别正宗...',
        category: '食堂评价',
        author: {
          username: '清华小王',
          avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        stats: {
          views: 980,
          likes: 67,
          comments: 15
        },
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
}

const viewPost = (postId: string) => {
  uni.showToast({
    title: '帖子详情功能开发中',
    icon: 'none'
  })
}

const createPost = () => {
  if (!userStore.isLoggedIn) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    return
  }
  
  uni.showToast({
    title: '发帖功能开发中',
    icon: 'none'
  })
}

const formatDate = (date: string) => {
  return dayjs(date).format('MM-DD HH:mm')
}

onMounted(() => {
  loadPosts()
})
</script>

<style lang="scss" scoped>
.forum-page {
  min-height: 100vh;
  background: var(--background);
  padding-bottom: 120rpx;
}

.category-nav {
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

.posts-section {
  padding: 32rpx 0;
  
  .loading-container,
  .empty-container {
    text-align: center;
    padding: 80rpx 0;
    color: var(--text-muted);
    font-size: 28rpx;
  }
  
  .posts-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    
    .post-item {
      padding: 24rpx;
      
      .post-header {
        display: flex;
        align-items: center;
        margin-bottom: 16rpx;
        
        .author-avatar {
          width: 64rpx;
          height: 64rpx;
          border-radius: 32rpx;
          margin-right: 16rpx;
        }
        
        .author-info {
          flex: 1;
          
          .author-name {
            font-size: 26rpx;
            font-weight: 500;
            color: var(--text-primary);
            display: block;
            margin-bottom: 4rpx;
          }
          
          .post-time {
            font-size: 22rpx;
            color: var(--text-muted);
            display: block;
          }
        }
        
        .post-category {
          .category-tag {
            padding: 6rpx 12rpx;
            background: #e0f2fe;
            color: var(--secondary-color);
            border-radius: 12rpx;
            font-size: 20rpx;
          }
        }
      }
      
      .post-content {
        margin-bottom: 16rpx;
        
        .post-title {
          font-size: 32rpx;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
          display: block;
          margin-bottom: 12rpx;
        }
        
        .post-excerpt {
          font-size: 26rpx;
          color: var(--text-secondary);
          line-height: 1.5;
          display: block;
          margin-bottom: 16rpx;
        }
        
        .post-images {
          display: flex;
          gap: 8rpx;
          
          .post-image {
            width: 120rpx;
            height: 120rpx;
            border-radius: 8rpx;
          }
        }
      }
      
      .post-footer {
        .post-stats {
          display: flex;
          gap: 32rpx;
          
          .stat-item {
            display: flex;
            align-items: center;
            gap: 8rpx;
            
            .stat-icon {
              font-size: 24rpx;
            }
            
            .stat-text {
              font-size: 22rpx;
              color: var(--text-muted);
            }
          }
        }
      }
    }
  }
}

.fab-container {
  position: fixed;
  right: 32rpx;
  bottom: 120rpx;
  z-index: 100;
  
  .fab-btn {
    width: 112rpx;
    height: 112rpx;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 24rpx rgba(79, 70, 229, 0.3);
    
    .fab-icon {
      font-size: 36rpx;
      color: white;
    }
  }
}
</style>