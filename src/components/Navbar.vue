<template>
<header class="bg-navy text-white sticky top-0 z-50">
<div class="container mx-auto px-4 py-3 flex items-center justify-between">
<router-link to="/" class="font-bold text-xl">Net<span class="text-accent">king</span></router-link>


<nav class="hidden md:flex items-center gap-6">
<router-link to="/" class="hover:text-accent">Home</router-link>
<router-link to="/shop" class="hover:text-accent">Shop</router-link>
<router-link to="/cart" class="hover:text-accent flex items-center gap-2">
<ShoppingCart class="w-5 h-5" />
<span class="inline-flex items-center justify-center bg-accent text-navy rounded-full text-xs w-5 h-5">{{ cart.count }}</span>
</router-link>
</nav>


<div class="flex items-center gap-3">
<template v-if="user.isLoggedIn">
<router-link to="/profile" class="hover:text-accent flex items-center gap-2"><User class="w-5 h-5" /> {{ user.username }}</router-link>
<button @click="logout" class="hover:text-accent flex items-center gap-2"><LogOut class="w-5 h-5" /> Logout</button>
<router-link v-if="user.role==='admin'" to="/admin" class="ml-2 px-3 py-1 rounded bg-accent text-navy">Admin</router-link>
</template>
<template v-else>
<router-link to="/login" class="px-3 py-1 rounded bg-accent text-navy">Login</router-link>
</template>
<button class="md:hidden" @click="open = !open"><Menu class="w-6 h-6" /></button>
</div>
</div>


<!-- mobile -->
<div v-if="open" class="md:hidden bg-navy/95 px-4 pb-3 space-y-2">
<router-link @click="open=false" to="/" class="block py-1">Home</router-link>
<router-link @click="open=false" to="/shop" class="block py-1">Shop</router-link>
<router-link @click="open=false" to="/cart" class="block py-1">Cart ({{ cart.count }})</router-link>
</div>
</header>
</template>


<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { ShoppingCart, User, LogOut, Menu } from 'lucide-vue-next'


const open = ref(false)
const cart = useCartStore()
const user = useUserStore()


function logout(){ user.logout() }
</script>