<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const orders = ref([])
const api = 'http://localhost:3000/orders'

const fetchOrders = async () => {
  const res = await axios.get(api)
  orders.value = res.data
}

const updateStatus = async (order, newStatus) => {
  await axios.patch(`${api}/${order.id}`, { status: newStatus })
  order.status = newStatus
  await fetchOrders() // cập nhật lại danh sách sau khi đổi trạng thái
}

const deleteOrder = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa đơn hàng này?')) return
  try {
    await axios.delete(`${api}/${id}`)
    await fetchOrders() // làm mới danh sách sau khi xóa
    alert('Đã xóa đơn hàng thành công!')
  } catch (err) {
    console.error('Lỗi khi xóa đơn hàng:', err)
    alert('Không thể xóa đơn hàng! Kiểm tra console hoặc db.json.')
  }
}

onMounted(fetchOrders)
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Quản lý đơn hàng</h1>
      <router-link
        to="/admin"
        class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        ← Quay lại
      </router-link>
    </div>

    <table class="w-full border border-gray-200 text-sm">
      <thead class="bg-gray-100">
        <tr>
          <th class="border p-2">Mã</th>
          <th class="border p-2">Khách hàng</th>
          <th class="border p-2">Tổng tiền</th>
          <th class="border p-2">Trạng thái</th>
          <th class="border p-2">Ngày tạo</th>
          <th class="border p-2">Hành động</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="o in orders" :key="o.id" class="text-center">
          <td class="border p-2">{{ o.id }}</td>
          <td class="border p-2">{{ o.username }}</td>
          <td class="border p-2">{{ o.total.toLocaleString() }}₫</td>
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
          <td class="border p-2">{{ new Date(o.createdAt).toLocaleString() }}</td>

          <td class="border p-2 space-x-2">
            <select
              class="border rounded px-2 py-1 text-sm"
              v-model="o.status"
              @change="updateStatus(o, o.status)"
            >
              <option value="pending">Chờ xử lý</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="shipping">Đang giao</option>
              <option value="completed">Hoàn tất</option>
              <option value="cancelled">Hủy</option>
            </select>

            <button
              @click="deleteOrder(o.id)"
              class="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
            >
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
