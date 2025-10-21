<template>
  <section class="grid md:grid-cols-4 gap-6">
    <AdminSidebar class="md:col-span-1" />

    <div class="md:col-span-3 card">
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-xl font-bold">Sản phẩm</h1>
        <router-link to="/admin/products/new" class="btn-primary">Thêm</router-link>
      </div>

      <table class="w-full text-sm border">
        <thead class="bg-gray-100">
          <tr class="text-left border-b">
            <th class="p-2 w-20">Ảnh</th>
            <th class="p-2">Tên</th>
            <th class="p-2">Brand</th>
            <th class="p-2">Giá</th>
            <th class="p-2">Kho</th>
            <th class="p-2 text-right">Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="p in list"
            :key="p.id"
            class="border-b hover:bg-gray-50"
          >
            <!-- 🟢 Ảnh đại diện -->
            <td class="p-2">
              <img
                :src="getImg(p.image)"
                class="w-14 h-14 object-cover rounded border"
                alt="product"
              />
            </td>

            <td class="p-2 font-medium">{{ p.name }}</td>
            <td class="p-2">{{ p.brand }}</td>
            <td class="p-2">{{ p.price.toLocaleString('vi-VN') }}₫</td>
            <td class="p-2">{{ p.stock }}</td>

            <td class="p-2 text-right">
              <router-link
                :to="`/admin/products/${p.id}`"
                class="text-blue-600 mr-2 hover:underline"
              >
                Sửa
              </router-link>
              <button
                class="text-red-600 hover:underline"
                @click="del(p.id)"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AdminSidebar from '@/components/AdminSidebar.vue'

const API = 'http://localhost:3000/products'
const list = ref([])

async function load() {
  const { data } = await axios.get(API)
  list.value = data
}

async function del(id) {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    await axios.delete(`${API}/${id}`)
    await load()
  }
}

// 🟢 Ảnh đầu tiên (base64 hoặc link)
function getImg(img) {
  if (!img) return '/images/placeholder.jpg'
  if (Array.isArray(img)) return img[0] || '/images/placeholder.jpg'
  if (typeof img === 'string') return img
  return '/images/placeholder.jpg'
}

onMounted(load)
</script>
    