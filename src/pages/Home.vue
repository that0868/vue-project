<template>
<section class="grid gap-8">
<!-- Banner -->
<div class="rounded-2xl bg-gradient-to-r from-navy to-blue-900 text-white p-10 flex items-center justify-between">
<div>
<h1 class="text-3xl md:text-5xl font-extrabold">Sức mạnh từ từng cú vung</h1>
<p class="opacity-90 mt-3">Khám phá vợt cầu lông chính hãng — giá tốt nhất!</p>
<router-link to="/shop" class="btn-accent mt-5 inline-block">Mua ngay</router-link>
</div>
<img src="https://images.unsplash.com/photo-1521417531741-735e36d1a06f?q=80&w=1200" class="hidden md:block w-80 rounded-2xl shadow-lg" />
</div>


 <!-- Sản phẩm nổi bật -->
    <div class="container mx-auto">
      <h2 class="text-2xl font-bold mb-4">Sản phẩm nổi bật</h2>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard v-for="p in featured" :key="p.id" :p="p" />
      </div>
    </div>

    <!-- Sản phẩm mới nhất -->
    <div class="container mx-auto">
      <h2 class="text-2xl font-bold mb-4">Sản phẩm mới nhất</h2>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard v-for="p in newest" :key="p.id" :p="p" />
      </div>
    </div>

    <!-- Sản phẩm bán chạy -->
    <div class="container mx-auto">
      <h2 class="text-2xl font-bold mb-4">Sản phẩm bán chạy</h2>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard v-for="p in bestSellers" :key="p.id" :p="p" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProductCard from '@/components/ProductCard.vue'

const API = 'http://localhost:3000/products'
const featured = ref([])
const newest = ref([])
const bestSellers = ref([])

onMounted(async () => {
  const { data } = await axios.get(API)

  featured.value = data.filter(p => p.featured)
  newest.value = [...data].reverse().slice(0, 4)
  bestSellers.value = data.filter(p => p.sold && p.sold > 50)
})
</script>