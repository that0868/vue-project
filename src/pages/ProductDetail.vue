<template>
  <section v-if="p" class="grid md:grid-cols-2 gap-8 items-start">
    <!-- Ảnh sản phẩm -->
    <div>
      <div class="relative w-full aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
        <img
          :src="mainImg"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div v-if="imgs.length > 1" class="flex gap-3 mt-4">
        <img
          v-for="(src, i) in imgs"
          :key="i"
          :src="src"
          class="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:ring-2 hover:ring-navy transition"
          :class="{ 'ring-2 ring-navy': active === i }"
          @click="active = i"
        />
      </div>
    </div>

    <!-- Thông tin sản phẩm -->
    <div>
      <h1 class="text-3xl font-bold mb-2">{{ p.name }}</h1>
      <p class="text-gray-500 mb-2">{{ p.brand }} · {{ p.stiffness }}</p>
      <div class="text-2xl font-extrabold text-navy mb-4">{{ format(p.price) }}</div>

      <div class="flex items-center gap-3 mb-6">
        <input
          v-model.number="qty"
          type="number"
          min="1"
          class="border rounded px-3 py-2 w-24 text-center"
        />
        <button class="btn-primary px-5 py-2" @click="addToCart">Thêm vào giỏ</button>
      </div>

      <div class="text-gray-700 leading-relaxed whitespace-pre-line">
        {{ p.description }}
      </div>
    </div>
  </section>

  <!-- 🧩 Sản phẩm liên quan -->
  <section v-if="related.length" class="mt-12">
    <h2 class="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProductCard v-for="item in related" :key="item.id" :p="item" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const p = ref(null)
const qty = ref(1)
const active = ref(0)
const cart = useCartStore()
const related = ref([])

onMounted(async () => {
  const { data } = await axios.get(`http://localhost:3000/products/${route.params.id}`)
  p.value = data

  // Lấy sản phẩm liên quan cùng brand
  const all = await axios.get('http://localhost:3000/products')
  related.value = all.data
    .filter(item => item.brand === data.brand && item.id !== data.id)
    .slice(0, 4) // chỉ lấy 4 sản phẩm
})

const imgs = computed(() => {
  if (!p.value) return []
  if (Array.isArray(p.value.image)) return p.value.image
  return p.value.image ? [p.value.image] : []
})

const mainImg = computed(() => imgs.value[active.value] || '/images/placeholder.png')

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
