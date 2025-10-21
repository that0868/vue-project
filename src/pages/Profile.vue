<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const orders = ref([])
const api = 'http://localhost:3000/orders'

// 🟢 Lấy danh sách đơn hàng theo userId
const fetchOrders = async () => {
  if (!userStore.isLoggedIn) return
  try {
    const id = Number(userStore.user.id) // ép về số cho chắc chắn
    const res = await axios.get(`${api}?userId=${id}`)
    orders.value = res.data
    console.log('Đơn hàng của user:', res.data)
  } catch (err) {
    console.error('Lỗi tải đơn hàng:', err)
  }
}

onMounted(fetchOrders)
</script>

<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Thông tin tài khoản</h1>

    <div v-if="userStore.user" class="border p-4 rounded mb-6 bg-gray-50">
      <p><strong>Tên đăng nhập:</strong> {{ userStore.user.username }}</p>
      <p><strong>Vai trò:</strong> {{ userStore.user.role }}</p>
      <p><strong>Token:</strong> {{ userStore.token }}</p>
    </div>

    <h2 class="text-xl font-semibold mb-3">Theo dõi đơn hàng</h2>

    <div v-if="orders.length">
      <table class="w-full border border-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-2">Mã</th>
            <th class="border p-2">Ngày đặt</th>
            <th class="border p-2">Tổng tiền</th>
            <th class="border p-2">Trạng thái</th>
            <th class="border p-2">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id" class="text-center">
            <td class="border p-2">{{ o.id }}</td>
            <td class="border p-2">{{ new Date(o.createdAt).toLocaleString('vi-VN') }}</td>
            <td class="border p-2">{{ o.total.toLocaleString('vi-VN') }}₫</td>
            <td class="border p-2">
              <span
                class="px-2 py-1 rounded text-xs"
                :class="{
                  'bg-yellow-100 text-yellow-700': o.status === 'pending',
                  'bg-blue-100 text-blue-700': o.status === 'confirmed',
                  'bg-indigo-100 text-indigo-700': o.status === 'shipping',
                  'bg-green-100 text-green-700': o.status === 'completed',
                  'bg-red-100 text-red-700': o.status === 'cancelled'
                }"
              >
                {{ o.status }}
              </span>
            </td>
            <td class="border p-2 text-left">
              <ul class="text-xs text-gray-600">
                <li v-for="i in o.items" :key="i.id">
                  {{ i.name }} × {{ i.qty }} — {{ i.price.toLocaleString('vi-VN') }}₫
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-gray-500 mt-4">Chưa có đơn hàng nào.</p>
  </div>
</template>
    