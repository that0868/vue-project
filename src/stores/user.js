import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),

  getters: {
    isLoggedIn: (s) => !!s.token,
    role: (s) => s.user?.role || 'guest',
    username: (s) => s.user?.username || ''
  },

  actions: {
    // Đăng nhập
    async login({ username, password }) {
      if (!username || !password) throw new Error('Thiếu thông tin')

      // Lấy danh sách users thật từ db.json
      const res = await axios.get('http://localhost:3000/users')
      const users = res.data || []

      const found = users.find(
        (u) => u.username === username && u.password === password
      )

      if (!found) throw new Error('Sai tài khoản hoặc mật khẩu')

      this.user = { id: found.id, username: found.username, role: found.role }
      this.token = 'mock-token-' + Date.now()
      localStorage.setItem('user', JSON.stringify(this.user))
      localStorage.setItem('token', this.token)
    },

    // Đăng xuất
    logout() {
      const ok = confirm('Bạn có chắc chắn muốn đăng xuất không?')
      if (!ok) return

      this.user = null
      this.token = ''
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      alert('Đăng xuất thành công!')
      window.location.href = '/'
    },

    // Đăng ký (lưu vào db.json thật)
    async register({ username, password }) {
      if (!username || !password) throw new Error('Thiếu thông tin')

      // Lấy danh sách users hiện tại
      const res = await axios.get('http://localhost:3000/users')
      const users = res.data || []

      // Kiểm tra trùng username
      if (users.some(u => u.username === username))
        throw new Error('Tên người dùng đã tồn tại')

      // Tạo mới và lưu vào db.json
      const newUser = { username, password, role: 'user' }
      await axios.post('http://localhost:3000/users', newUser)

      alert('Tạo tài khoản thành công!')
      return true
    },

    requireLogin() {
      if (!this.token) {
        throw new Error('NOT_LOGGED_IN')
      }
    }
  }
})

