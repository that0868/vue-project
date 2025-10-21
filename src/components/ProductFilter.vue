<template>
<div class="card grid md:grid-cols-5 gap-3">
<input v-model.trim="model.q" type="text" placeholder="Tìm theo tên/brand..." class="border rounded px-3 py-2 md:col-span-2" @keyup.enter="$emit('apply')" />
<select v-model="model.brand" class="border rounded px-3 py-2">
<option value="">Brand</option>
<option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
</select>
<select v-model="model.stiffness" class="border rounded px-3 py-2">
<option value="">Độ cứng</option>
<option>Flexible</option><option>Medium</option><option>Stiff</option>
</select>
<div class="flex items-center gap-2">
<input v-model.number="model.price_min" type="number" min="0" placeholder="Giá từ" class="border rounded px-3 py-2 w-1/2" />
<input v-model.number="model.price_max" type="number" min="0" placeholder="đến" class="border rounded px-3 py-2 w-1/2" />
</div>
<div class="md:col-span-5 flex gap-2">
<button class="btn-primary" @click="$emit('apply')">Lọc</button>
<button class="btn-accent" @click="reset">Reset</button>
</div>
</div>
</template>
<script setup>
const props = defineProps({ brands: { type: Array, default: () => [] } })
const model = defineModel({ type: Object, default: () => ({ q:'', brand:'', stiffness:'', price_min:'', price_max:'' }) })
function reset(){ Object.assign(model.value, { q:'', brand:'', stiffness:'', price_min:'', price_max:'' }) }
</script>