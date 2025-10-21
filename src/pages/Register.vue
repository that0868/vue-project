<template>
<section class="max-w-md mx-auto card grid gap-3">
<h1 class="text-2xl font-bold">Đăng ký</h1>
<input v-model="username" type="text" placeholder="Username" class="border rounded px-3 py-2" />
<input v-model="password" type="password" placeholder="Mật khẩu" class="border rounded px-3 py-2" />
<button class="btn-primary" @click="submit">Tạo tài khoản</button>
</section>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'


const username = ref(''); const password = ref(''); const router = useRouter(); const user = useUserStore()
function submit(){
try{ user.register({ username: username.value, password: password.value }); alert('Đăng ký thành công!'); router.push('/login') } catch(e){ alert(e.message) }
}
</script>