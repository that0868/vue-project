import { defineStore } from 'pinia'
import { useUserStore } from './user'
import axios from 'axios'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart') || '[]')
  }),

  getters: {
    count: (s) => s.items.reduce((a, i) => a + i.qty, 0),
    total: (s) => s.items.reduce((a, i) => a + i.qty * i.price, 0)
  },

  actions: {
    persist() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    async add(product, qty = 1) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) throw new Error('NOT_LOGGED_IN')

      if (product.stock <= 0) {
        alert('Sản phẩm này đã hết hàng!')
        return
      }

      const q = Math.max(1, Number(qty) || 1)
      const found = this.items.find(i => i.id === product.id)

      if (found) {
        found.qty = Math.min(found.qty + q, product.stock)
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: Math.min(q, product.stock),
          stock: product.stock
        })
      }

      this.items = this.items.filter(i => i.stock > 0)
      this.persist()
    },

    update(id, qty) {
      const item = this.items.find(i => i.id === id)
      if (!item) return
      const q = Math.max(1, Math.min(Number(qty) || 1, item.stock))
      item.qty = q
      if (item.stock <= 0) this.remove(id)
      else this.persist()
    },

    inc(id) {
      const it = this.items.find(i => i.id === id)
      if (it) {
        if (it.qty < it.stock) this.update(id, it.qty + 1)
        else alert('Đã đạt số lượng tối đa trong kho!')
      }
    },

    dec(id) {
      const it = this.items.find(i => i.id === id)
      if (it) {
        if (it.qty > 1) this.update(id, it.qty - 1)
        else this.remove(id)
      }
    },

    remove(id) {
      this.items = this.items.filter(i => i.id !== id)
      this.persist()
    },

    clear() {
      this.items = []
      this.persist()
    },

    //  Thanh toán & lưu đơn hàng
    async checkout() {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) throw new Error('NOT_LOGGED_IN')
      if (!this.items.length) {
        alert('Giỏ hàng đang trống!')
        return
      }

      //  1. Tạo đơn hàng
      const order = {
        id: Date.now(), //  thêm ID để json-server nhận dạng đúng
        userId: Number(userStore.user.id),
        username: userStore.user.username,
        total: this.total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        items: this.items.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty
        }))
      }

      //  2. Lưu đơn hàng vào db.json
      await axios.post('http://localhost:3000/orders', order)

      //  3. Cập nhật tồn kho
      for (const item of this.items) {
        const res = await axios.get(`http://localhost:3000/products/${item.id}`)
        const product = res.data
        const newStock = Math.max(0, product.stock - item.qty)
        await axios.patch(`http://localhost:3000/products/${item.id}`, { stock: newStock })

        if (newStock === 0) {
          await axios.delete(`http://localhost:3000/products/${item.id}`)
        }
      }

      // 🟢 4. Xóa giỏ hàng & chuyển trang Profile
      this.clear()
      alert('✅ Đặt hàng thành công! Đơn của bạn đang chờ xử lý.')
      window.location.href = '/profile' // 👈 chuyển user qua trang theo dõi đơn
    }
  }
})
