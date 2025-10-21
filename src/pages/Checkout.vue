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
import { useCartStore } from '@/stores/cart'

import { computed } from 'vue' 


const cart = useCartStore(); const router = useRouter()
const form = reactive({ name:'', phone:'', address:'', method:'COD' })

const total = computed(() => {
  return Math.max(0, cart.total)
})



function format(n){ return n.toLocaleString('vi-VN') + '₫' }
function placeOrder(){
if(!form.name || !form.phone || !form.address) return alert('Vui lòng nhập đủ thông tin')
// Mock success
cart.clear()
alert('Đặt hàng thành công!')
router.push('/')
}
</script>