<template>
<aside class="bg-white rounded-2xl shadow p-4 h-max sticky top-24">
<div class="font-bold text-lg mb-3">Admin</div>
<nav class="grid gap-2">
<router-link class="px-3 py-2 rounded hover:bg-gray-100" to="/admin">Dashboard</router-link>
<router-link class="px-3 py-2 rounded hover:bg-gray-100" to="/admin/products">Sản phẩm</router-link>
<router-link class="px-3 py-2 rounded hover:bg-gray-100" to="/admin/brands">Thương hiệu</router-link>
<router-link class="px-3 py-2 rounded hover:bg-gray-100" to="/admin/users">Người dùng</router-link>
<router-link class="px-3 py-2 rounded hover:bg-gray-100" to="/admin/orders">Đơn hàng</router-link>
</nav>
</aside>
</template>