<template>
<section class="grid gap-6">
<ProductFilter v-model="filter" :brands="brands" @apply="apply" />


<div v-if="store.loading" class="text-center py-10">Đang tải...</div>


<div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
<ProductCard v-for="p in store.list" :key="p.id" :p="p" />
</div>


<div class="flex items-center justify-center gap-2" v-if="pages > 1">
<button class="px-3 py-1 border rounded" :disabled="page===1" @click="go(page-1)">«</button>
<span>Trang {{ page }} / {{ pages }}</span>
<button class="px-3 py-1 border rounded" :disabled="page===pages" @click="go(page+1)">»</button>
</div>
</section>
</template>
<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import ProductCard from '@/components/ProductCard.vue'
import ProductFilter from '@/components/ProductFilter.vue'


const store = useProductStore()
const route = useRoute(); const router = useRouter()
const limit = 12
const filter = reactive({ q:'', brand:'', stiffness:'', price_min:'', price_max:'' })
const brands = ['Yonex', 'Victor', 'Li-Ning', 'Mizuno']


const page = computed(() => Number(route.query.page || 1))
const pages = computed(() => Math.max(1, Math.ceil(store.total / limit)))


function load(){ store.fetch({ page: page.value, limit, ...filter }) }
function apply(){ router.push({ query: { page: 1, ...filter } }) }
function go(p){ router.push({ query: { ...route.query, page: p } }) }


watch(() => route.query, () => {
Object.assign(filter, {
q: route.query.q || '',
brand: route.query.brand || '',
stiffness: route.query.stiffness || '',
price_min: route.query.price_min || '',
price_max: route.query.price_max || ''
})
load()
},{ immediate: true })


onMounted(load)
</script>