<template>
  <section v-if="p" class="grid md:grid-cols-2 gap-6">
    <div>
      <img :src="mainImg" class="w-full h-80 object-cover rounded-2xl bg-gray-100" />
      <div v-if="imgs.length > 1" class="flex gap-2 mt-3">
        <img
          v-for="(src, i) in imgs"
          :key="i"
          :src="src"
          class="w-16 h-16 object-cover rounded cursor-pointer border hover:opacity-80"
          @click="active = i"
        />
      </div>
    </div>

    <div>
      <h1 class="text-2xl font-bold mb-2">{{ p.name }}</h1>
      <p class="text-gray-600 mb-1">{{ p.brand }}</p>
      <div class="text-2xl font-extrabold text-navy mb-4">{{ format(p.price) }}</div>

      <div class="flex items-center gap-2 mb-4">
        <input v-model.number="qty" type="number" min="1" class="border rounded px-3 py-1 w-20" />
        <button class="btn-primary" @click="addToCart">Thêm vào giỏ</button>
      </div>

      <p>{{ p.description }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const p = ref(null)
const qty = ref(1)
const active = ref(0)
const cart = useCartStore()

onMounted(async () => {
  const { data } = await axios.get(`http://localhost:3000/products/${route.params.id}`)
  p.value = data
})

const imgs = computed(() => {
  if (!p.value) return []
  if (Array.isArray(p.value.image)) return p.value.image
  return p.value.image ? [p.value.image] : []
})

const mainImg = computed(() => imgs.value[active.value] || '/images/placeholder.jpg')

function format(n) {
  return n ? n.toLocaleString('vi-VN') + '₫' : ''
}

async function addToCart() {
  try {
    await cart.add(p.value, qty.value)
    alert('Đã thêm vào giỏ hàng!')
  } catch (err) {
    if (err.message === 'NOT_LOGGED_IN') {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng!')
      window.location.href = '/login'
    } else {
      console.error(err)
    }
  }
}

</script>
