interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
}

interface Response<T = any> {
  success: boolean
  data: T
  message: string
  code: number
}

const BASE_URL = 'http://localhost:3000/api'

export const request = <T = any>(options: RequestOptions): Promise<Response<T>> => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Response<T>)
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.data?.message || '请求失败'}`))
        }
      },
      fail: (error) => {
        reject(new Error(`网络错误: ${error.errMsg}`))
      }
    })
  })
}

export const get = <T = any>(url: string, data?: any) => 
  request<T>({ url, method: 'GET', data })

export const post = <T = any>(url: string, data?: any) => 
  request<T>({ url, method: 'POST', data })

export const put = <T = any>(url: string, data?: any) => 
  request<T>({ url, method: 'PUT', data })

export const del = <T = any>(url: string, data?: any) => 
  request<T>({ url, method: 'DELETE', data })