<template>
<section class="grid md:grid-cols-4 gap-6">
<AdminSidebar class="md:col-span-1" />
<div class="md:col-span-3 card">
<h1 class="text-xl font-bold mb-3">Người dùng</h1>
<table class="w-full text-sm">
<thead>
<tr class="text-left border-b"><th class="py-2">Username</th><th>Role</th></tr>
</thead>
<tbody>
<tr v-for="u in users" :key="u.id" class="border-b">
<td class="py-2">{{ u.username }}</td>
<td>{{ u.role }}</td>
</tr>
</tbody>
</table>
</div>
</section>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import AdminSidebar from '@/components/AdminSidebar.vue'
const API = 'http://localhost:3000'
const users = ref([])


onMounted(async () => { const { data } = await axios.get(`${API}/users`); users.value = data })
</script>