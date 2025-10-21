<template>
  <div class="card group overflow-hidden rounded-xl shadow hover:shadow-lg transition">
    <!-- Ảnh sản phẩm -->
    <div class="relative w-full aspect-[1/1] bg-gray-100">
      <img
        :src="getImg(p.image)"
        :alt="p.name"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <!-- Nội dung -->
    <div class="mt-3 px-2 pb-3">
      <h3 class="font-semibold group-hover:text-navy truncate">{{ p.name }}</h3>
      <p class="text-sm text-gray-500">{{ p.brand }} · {{ p.stiffness }}</p>

      <div class="flex items-center justify-between mt-2">
        <div class="font-bold text-navy">{{ format(p.price) }}</div>
        <router-link
          :to="`/product/${p.id}`"
          class="btn-primary text-sm px-3 py-1.5"
        >
          Xem
        </router-link>
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
  if (!image) return '/images/placeholder.png'
  if (Array.isArray(image)) return image[0] || '/images/placeholder.png'
  if (typeof image === 'string') return image
  return '/images/placeholder.png'
}
</script>

