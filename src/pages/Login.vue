<template>
<section class="max-w-md mx-auto card grid gap-3">
<h1 class="text-2xl font-bold">Đăng nhập</h1>
<input v-model="username" type="text" placeholder="Username" class="border rounded px-3 py-2" />
<input v-model="password" type="password" placeholder="Mật khẩu" class="border rounded px-3 py-2" />
<button class="btn-primary" @click="submit">Đăng nhập</button>
<p class="text-sm">Chưa có tài khoản? <router-link to="/register" class="text-navy underline">Đăng ký</router-link></p>
</section>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'


const route = useRoute(); const router = useRouter(); const user = useUserStore()
const username = ref(''); const password = ref('')


function submit(){
try{
user.login({ username: username.value, password: password.value })
router.push(route.query.redirect || '/')
}catch(e){ alert(e.message) }
}
</script>