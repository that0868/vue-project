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

      const res = await axios.get(`http://localhost:3000/products/${product.id}`)
      const realProduct = res.data

      if (!realProduct || realProduct.stock <= 0) {
        alert('Sản phẩm này đã hết hàng!')
        if (realProduct) await axios.delete(`http://localhost:3000/products/${product.id}`)
        this.items = this.items.filter(i => i.id !== product.id)
        this.persist()
        return
      }

      const q = Math.max(1, Number(qty) || 1)
      const found = this.items.find(i => i.id === product.id)

      if (found) {
        if (found.qty + q > realProduct.stock) {
          alert('Số lượng vượt quá tồn kho!')
          found.qty = realProduct.stock
        } else {
          found.qty += q
        }
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: Math.min(q, realProduct.stock),
          stock: realProduct.stock
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

    async inc(id) {
      const it = this.items.find(i => i.id === id)
      if (!it) return

      const res = await axios.get(`http://localhost:3000/products/${id}`)
      const realProduct = res.data

      if (!realProduct || realProduct.stock <= 0) {
        alert('Sản phẩm này đã hết hàng!')
        await axios.delete(`http://localhost:3000/products/${id}`)
        this.remove(id)
        return
      }

      if (it.qty < realProduct.stock) this.update(id, it.qty + 1)
      else alert('Đã đạt số lượng tối đa trong kho!')
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

    async checkout() {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) throw new Error('NOT_LOGGED_IN')
      if (!this.items.length) {
        alert('Giỏ hàng đang trống!')
        return
      }

      const order = {
        id: Date.now(),
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

      await axios.post('http://localhost:3000/orders', order)

      for (const item of this.items) {
        const res = await axios.get(`http://localhost:3000/products/${item.id}`)
        const product = res.data
        const newStock = Math.max(0, product.stock - item.qty)

        if (newStock === 0) {
          await axios.delete(`http://localhost:3000/products/${item.id}`)
        } else {
          await axios.patch(`http://localhost:3000/products/${item.id}`, { stock: newStock })
        }
      }

      this.clear()
      alert('Đặt hàng thành công! Đơn của bạn đang chờ xử lý.')
      window.location.href = '/profile'
    }
  }
})

