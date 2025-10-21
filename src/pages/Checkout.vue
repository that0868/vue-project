<template>
  <section class="grid md:grid-cols-3 gap-6">
    <div class="md:col-span-2 card grid gap-3">
      <h2 class="text-xl font-bold">Thông tin giao hàng</h2>
      <input v-model="form.name" type="text" placeholder="Họ tên" class="border rounded px-3 py-2" />
      <input v-model="form.phone" type="text" placeholder="Số điện thoại" class="border rounded px-3 py-2" />
      <input v-model="form.address" type="text" placeholder="Địa chỉ" class="border rounded px-3 py-2" />
      <select v-model="form.method" class="border rounded px-3 py-2">
        <option value="COD">COD</option>
        <option value="VNPAY">VNPAY (giả lập)</option>
      </select>
      <button class="btn-primary w-full" @click="placeOrder">Đặt hàng</button>
    </div>

    <div class="card h-max">
      <div class="font-semibold mb-2">Đơn hàng</div>
      <div class="text-sm text-gray-600">{{ cart.count }} sản phẩm</div>
      <div class="font-bold text-lg mt-2">Tổng: {{ format(cart.total) }}</div>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

const cart = useCartStore()
const user = useUserStore()
const router = useRouter()

const form = reactive({
  name: '',
  phone: '',
  address: '',
  method: 'COD'
})

function format(n) {
  return n.toLocaleString('vi-VN') + '₫'
}

async function placeOrder() {
  if (!form.name || !form.phone || !form.address) {
    alert('Vui lòng nhập đủ thông tin')
    return
  }

  if (!user.isLoggedIn) {
    alert('Bạn cần đăng nhập trước khi đặt hàng')
    router.push('/login')
    return
  }

  if (!cart.items.length) {
    alert('Giỏ hàng đang trống!')
    return
  }

  try {
    // Tạo đơn hàng thật
    const order = {
      id: Date.now(),
      userId: Number(user.user.id),
      username: user.user.username,
      name: form.name,
      phone: form.phone,
      address: form.address,
      method: form.method,
      total: cart.total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      items: cart.items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty
      }))
    }

    // Gửi đơn hàng vào db.json
    await axios.post('http://localhost:3000/orders', order)

    // Xóa giỏ hàng
    cart.clear()
    alert('Đặt hàng thành công! Đơn hàng của bạn đang chờ xử lý.')
    router.push('/profile')
  } catch (err) {
    console.error('Lỗi khi đặt hàng:', err)
    alert('Có lỗi xảy ra, vui lòng thử lại.')
  }
}
</script>
