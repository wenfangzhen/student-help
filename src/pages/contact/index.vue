<template>
  <view class="contact-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="container">
        <text class="page-title">联系我们</text>
        <text class="page-subtitle">我们随时为您提供帮助</text>
      </view>
    </view>

    <!-- 联系方式 -->
    <view class="contact-methods">
      <view class="container">
        <view class="methods-grid">
          <view 
            v-for="method in contactMethods" 
            :key="method.id"
            class="method-item card card-hover"
            @click="handleContact(method)"
          >
            <view class="method-icon">{{ method.icon }}</view>
            <text class="method-title">{{ method.title }}</text>
            <text class="method-value">{{ method.value }}</text>
            <text class="method-desc">{{ method.description }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 意见反馈表单 -->
    <view class="feedback-section">
      <view class="container">
        <text class="section-title">意见反馈</text>
        <view class="feedback-form card">
          <view class="form-group">
            <text class="form-label">反馈类型</text>
            <picker 
              :value="feedbackForm.typeIndex"
              :range="feedbackTypes"
              @change="onTypeChange"
            >
              <view class="picker-input">
                {{ feedbackTypes[feedbackForm.typeIndex] }}
              </view>
            </picker>
          </view>
          
          <view class="form-group">
            <text class="form-label">联系方式</text>
            <input 
              class="form-input"
              type="text"
              v-model="feedbackForm.contact"
              placeholder="请输入您的邮箱或手机号"
            />
          </view>
          
          <view class="form-group">
            <text class="form-label">反馈内容</text>
            <textarea 
              class="form-textarea"
              v-model="feedbackForm.content"
              placeholder="请详细描述您的问题或建议..."
              maxlength="500"
            />
            <text class="char-count">{{ feedbackForm.content.length }}/500</text>
          </view>
          
          <button 
            class="submit-btn"
            :disabled="!canSubmit"
            @click="submitFeedback"
          >
            提交反馈
          </button>
        </view>
      </view>
    </view>

    <!-- 常见问题 -->
    <view class="faq-section">
      <view class="container">
        <text class="section-title">常见问题</text>
        <view class="faq-list">
          <view 
            v-for="faq in faqs" 
            :key="faq.id"
            class="faq-item card"
            @click="toggleFaq(faq.id)"
          >
            <view class="faq-question">
              <text class="question-text">{{ faq.question }}</text>
              <text class="toggle-icon" :class="{ expanded: faq.expanded }">▼</text>
            </view>
            <view v-if="faq.expanded" class="faq-answer">
              <text class="answer-text">{{ faq.answer }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const contactMethods = ref([
  {
    id: 1,
    title: '客服热线',
    value: '400-123-4567',
    description: '工作日 9:00-18:00',
    icon: '📞',
    type: 'phone'
  },
  {
    id: 2,
    title: '客服邮箱',
    value: 'service@university-platform.com',
    description: '24小时内回复',
    icon: '📧',
    type: 'email'
  },
  {
    id: 3,
    title: '在线客服',
    value: '立即咨询',
    description: '实时在线解答',
    icon: '💬',
    type: 'chat'
  },
  {
    id: 4,
    title: '官方微信',
    value: 'UniversityPlatform',
    description: '扫码关注获取更多信息',
    icon: '📱',
    type: 'wechat'
  }
])

const feedbackTypes = ref([
  '功能建议',
  '问题反馈',
  '内容纠错',
  '合作咨询',
  '其他'
])

const feedbackForm = ref({
  typeIndex: 0,
  contact: '',
  content: ''
})

const faqs = ref([
  {
    id: 1,
    question: '如何注册账户？',
    answer: '点击登录页面的"立即注册"按钮，填写用户名、邮箱和密码即可完成注册。注册后请验证邮箱以激活账户。',
    expanded: false
  },
  {
    id: 2,
    question: '忘记密码怎么办？',
    answer: '在登录页面点击"忘记密码"，输入注册邮箱，系统会发送重置密码的链接到您的邮箱。',
    expanded: false
  },
  {
    id: 3,
    question: '如何搜索大学信息？',
    answer: '您可以通过首页搜索框或"全国高校"页面进行搜索，支持按地区、类型、层次等条件筛选。',
    expanded: false
  },
  {
    id: 4,
    question: '如何发布帖子？',
    answer: '登录后进入论坛页面，点击右下角的发帖按钮，选择分类并填写标题和内容即可发布。',
    expanded: false
  },
  {
    id: 5,
    question: '平台信息是否准确？',
    answer: '我们的信息来源于官方渠道和用户分享，会定期更新和审核。如发现错误信息，请及时反馈给我们。',
    expanded: false
  }
])

const canSubmit = computed(() => {
  return feedbackForm.value.contact.trim() && feedbackForm.value.content.trim()
})

const onTypeChange = (e: any) => {
  feedbackForm.value.typeIndex = e.detail.value
}

const handleContact = (method: any) => {
  switch (method.type) {
    case 'phone':
      uni.makePhoneCall({
        phoneNumber: method.value
      })
      break
    case 'email':
      uni.setClipboardData({
        data: method.value,
        success: () => {
          uni.showToast({
            title: '邮箱已复制',
            icon: 'success'
          })
        }
      })
      break
    case 'chat':
      uni.showToast({
        title: '在线客服功能开发中',
        icon: 'none'
      })
      break
    case 'wechat':
      uni.showToast({
        title: '微信号已复制',
        icon: 'success'
      })
      uni.setClipboardData({
        data: method.value
      })
      break
  }
}

const submitFeedback = () => {
  if (!canSubmit.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }
  
  // 这里可以调用API提交反馈
  uni.showToast({
    title: '反馈提交成功',
    icon: 'success'
  })
  
  // 重置表单
  feedbackForm.value = {
    typeIndex: 0,
    contact: '',
    content: ''
  }
}

const toggleFaq = (id: number) => {
  const faq = faqs.value.find(item => item.id === id)
  if (faq) {
    faq.expanded = !faq.expanded
  }
}
</script>

<style lang="scss" scoped>
.contact-page {
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

.contact-methods {
  padding: 48rpx 0;
  
  .methods-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24rpx;
    
    @media (max-width: 750px) {
      grid-template-columns: 1fr;
    }
    
    .method-item {
      text-align: center;
      padding: 40rpx 24rpx;
      
      .method-icon {
        font-size: 64rpx;
        margin-bottom: 16rpx;
        display: block;
      }
      
      .method-title {
        font-size: 28rpx;
        font-weight: 600;
        color: var(--text-primary);
        display: block;
        margin-bottom: 8rpx;
      }
      
      .method-value {
        font-size: 24rpx;
        color: var(--primary-color);
        font-weight: 500;
        display: block;
        margin-bottom: 8rpx;
      }
      
      .method-desc {
        font-size: 22rpx;
        color: var(--text-secondary);
        display: block;
      }
    }
  }
}

.feedback-section {
  padding: 48rpx 0;
  background: white;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 32rpx;
    display: block;
  }
  
  .feedback-form {
    padding: 32rpx;
    
    .form-group {
      margin-bottom: 32rpx;
      
      .form-label {
        font-size: 28rpx;
        color: var(--text-primary);
        font-weight: 500;
        display: block;
        margin-bottom: 12rpx;
      }
      
      .picker-input {
        padding: 24rpx;
        border: 2rpx solid var(--border-color);
        border-radius: 12rpx;
        font-size: 28rpx;
        color: var(--text-primary);
        background: white;
      }
      
      .form-input {
        width: 100%;
        padding: 24rpx;
        border: 2rpx solid var(--border-color);
        border-radius: 12rpx;
        font-size: 28rpx;
        color: var(--text-primary);
        background: white;
      }
      
      .form-textarea {
        width: 100%;
        min-height: 200rpx;
        padding: 24rpx;
        border: 2rpx solid var(--border-color);
        border-radius: 12rpx;
        font-size: 28rpx;
        color: var(--text-primary);
        background: white;
        resize: none;
      }
      
      .char-count {
        font-size: 22rpx;
        color: var(--text-muted);
        text-align: right;
        display: block;
        margin-top: 8rpx;
      }
    }
    
    .submit-btn {
      width: 100%;
      padding: 28rpx;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      border: none;
      border-radius: 12rpx;
      font-size: 28rpx;
      font-weight: 500;
      
      &:disabled {
        background: var(--text-muted);
        opacity: 0.6;
      }
    }
  }
}

.faq-section {
  padding: 48rpx 0;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 32rpx;
    display: block;
  }
  
  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    
    .faq-item {
      padding: 24rpx;
      
      .faq-question {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .question-text {
          font-size: 28rpx;
          font-weight: 500;
          color: var(--text-primary);
          flex: 1;
        }
        
        .toggle-icon {
          font-size: 24rpx;
          color: var(--text-muted);
          transition: transform 0.3s ease;
          
          &.expanded {
            transform: rotate(180deg);
          }
        }
      }
      
      .faq-answer {
        margin-top: 16rpx;
        padding-top: 16rpx;
        border-top: 1rpx solid var(--border-color);
        
        .answer-text {
          font-size: 26rpx;
          color: var(--text-secondary);
          line-height: 1.5;
          display: block;
        }
      }
    }
  }
}
</style>