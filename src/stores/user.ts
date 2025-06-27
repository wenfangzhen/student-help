import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  role: 'user' | 'admin'
  createdAt: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const isLoggedIn = computed(() => !!user.value && !!token.value)

  const initUser = async () => {
    try {
      const storedToken = uni.getStorageSync('token')
      const storedUser = uni.getStorageSync('user')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    } catch (error) {
      console.error('初始化用户信息失败:', error)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await uni.request({
        url: 'http://localhost:3000/api/auth/login',
        method: 'POST',
        data: { email, password }
      })

      if (response.statusCode === 200 && response.data.success) {
        const { token: newToken, user: newUser } = response.data.data
        token.value = newToken
        user.value = newUser
        
        uni.setStorageSync('token', newToken)
        uni.setStorageSync('user', JSON.stringify(newUser))
        
        return { success: true }
      } else {
        return { success: false, message: response.data.message || '登录失败' }
      }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, message: '网络错误，请稍后重试' }
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await uni.request({
        url: 'http://localhost:3000/api/auth/register',
        method: 'POST',
        data: { username, email, password }
      })

      if (response.statusCode === 201 && response.data.success) {
        return { success: true }
      } else {
        return { success: false, message: response.data.message || '注册失败' }
      }
    } catch (error) {
      console.error('注册失败:', error)
      return { success: false, message: '网络错误，请稍后重试' }
    }
  }

  const logout = () => {
    user.value = null
    token.value = ''
    uni.removeStorageSync('token')
    uni.removeStorageSync('user')
  }

  const updateUser = (newUser: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...newUser }
      uni.setStorageSync('user', JSON.stringify(user.value))
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    initUser,
    login,
    register,
    logout,
    updateUser
  }
})