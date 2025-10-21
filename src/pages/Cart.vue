<template>
  <section>
    <h1 class="text-2xl font-bold mb-4">Giỏ hàng</h1>
    <div v-if="cart.items.length === 0" class="text-gray-500">Chưa có sản phẩm.</div>

    <div v-else class="grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2 card">
        <CartItem
          v-for="it in cart.items"
          :key="it.id"
          :item="it"
          @inc="cart.inc(it.id)"
          @dec="cart.dec(it.id)"
          @update="cart.update(it.id, $event)"
          @remove="cart.remove(it.id)"
        />
      </div>

      <div class="card h-max">
        <div class="flex items-center justify-between">
          <div>Tổng</div>
          <div class="font-bold">{{ format(cart.total) }}</div>
        </div>
        <router-link to="/checkout" class="btn-accent w-full text-center mt-4 block">Thanh toán</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import CartItem from '@/components/CartItem.vue'

const cart = useCartStore()
function format(n) {
  return n.toLocaleString('vi-VN') + '₫'
}
</script>
    