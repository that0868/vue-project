<template>
<div class="flex items-center justify-between gap-3 py-3 border-b">
<div class="flex items-center gap-3">
<img :src="item.image" class="w-16 h-16 object-cover rounded" />
<div>
<div class="font-semibold">{{ item.name }}</div>
<div class="text-sm text-gray-500">{{ format(item.price) }}</div>
</div>
</div>


<div class="flex items-center gap-2">
<button class="px-2 py-1 border rounded" @click="$emit('dec', item.id)">-</button>
<input type="number" class="w-16 text-center border rounded py-1" :value="item.qty" @input="$emit('update', item.id, $event.target.value)" min="1" />
<button class="px-2 py-1 border rounded" @click="$emit('inc', item.id)">+</button>
<button class="px-3 py-1 ml-2 rounded bg-red-50 text-red-600" @click="$emit('remove', item.id)">Xóa</button>
</div>
</div>
</template>
<script setup>
const props = defineProps({ item: Object })
function format(n){ return n.toLocaleString('vi-VN') + '₫' }
</script>