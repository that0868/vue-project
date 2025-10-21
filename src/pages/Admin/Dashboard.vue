<template>
<section class="grid md:grid-cols-4 gap-6">
<AdminSidebar class="md:col-span-1" />
<div class="md:col-span-3 grid gap-4">
<div class="grid md:grid-cols-3 gap-4">
<div class="card"><div class="text-sm text-gray-500">Tổng sản phẩm</div><div class="text-2xl font-bold">{{ stats.products }}</div></div>
<div class="card"><div class="text-sm text-gray-500">Doanh thu</div><div class="text-2xl font-bold">{{ (stats.revenue).toLocaleString('vi-VN') }}₫</div></div>
<div class="card"><div class="text-sm text-gray-500">Đơn hàng</div><div class="text-2xl font-bold">{{ stats.orders }}</div></div>
</div>
<div class="card">
<!-- <div class="font-semibold mb-2">Gợi ý</div> -->
<ul class="list-disc pl-5 text-gray-600 text-sm">
<!-- <li>Kết nối backend thật (Express + MySQL) sau.</li>
<li>Tích hợp VNPAY/MoMo thật.</li>
<li>Thêm review, coupon, quản lý đơn.</li> -->
</ul>
</div>
</div>
</section>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import axios from 'axios'
import AdminSidebar from '@/components/AdminSidebar.vue'
const API = 'http://localhost:3000'
const stats = reactive({ products: 0, revenue: 125000000, orders: 0 })


onMounted(async () => {
const { data } = await axios.get(`${API}/products`)
stats.products = data.length
})
</script>