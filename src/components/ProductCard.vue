<template>
  <div class="card group">
    <img :src="getImg(p.image)" :alt="p.name" class="w-full h-48 object-cover rounded-xl" />
    <div class="mt-3">
      <h3 class="font-semibold group-hover:text-navy">{{ p.name }}</h3>
      <p class="text-sm text-gray-500">{{ p.brand }} · {{ p.stiffness }}</p>
      <div class="flex items-center justify-between mt-2">
        <div class="font-bold text-navy">{{ format(p.price) }}</div>
        <router-link :to="`/product/${p.id}`" class="btn-primary">Xem</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ p: Object })

function format(n) {
  return n ? n.toLocaleString('vi-VN') + '₫' : ''
}

// 🟢 Lấy ảnh đầu tiên (base64 hoặc URL)
function getImg(image) {
  if (!image) return '/images/placeholder.jpg'
  if (Array.isArray(image)) return image[0] || '/images/placeholder.jpg'
  if (typeof image === 'string') return image
  return '/images/placeholder.jpg'
}
</script>
