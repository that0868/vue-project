import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),

  getters: {
    //  Kiểm tra đăng nhập (true nếu có token)
    isLoggedIn: (s) => !!s.token,

    //  Lấy vai trò (admin/user/guest)
    role: (s) => s.user?.role || 'guest',

    //  Tên hiển thị
    username: (s) => s.user?.username || ''
  },

  actions: {
    //  Đăng nhập (mock auth, client-side)
    login({ username, password }) {
      if (!username || !password) throw new Error('Thiếu thông tin')

      //  Giả lập người dùng như trong db.json
      const records = [
        { username: 'admin', password: '123456', role: 'admin' },
        { username: 'user', password: '123456', role: 'user' },
      ]

      const found = records.find(
        (u) => u.username === username && u.password === password
      )
      if (!found) throw new Error('Sai tài khoản hoặc mật khẩu')
        

      // Lưu user + token
      this.user = { id: Date.now(), username: found.username, role: found.role }
      this.token = 'mock-token-' + Date.now()

      

      localStorage.setItem('user', JSON.stringify(this.user))
      localStorage.setItem('token', this.token)
    },

    // 🚪 Đăng xuất
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },

    //  Đăng ký giả lập
    register({ username, password }) {
      if (!username || !password) throw new Error('Thiếu thông tin')
      return true // mock register ok
    },

    //  Hàm hỗ trợ thêm cho Cart, Checkout,...
    requireLogin() {
      if (!this.token) {
        throw new Error('NOT_LOGGED_IN')
      }
    }
  }
})
