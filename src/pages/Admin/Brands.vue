<template>
  <section class="grid md:grid-cols-4 gap-6">
    <AdminSidebar class="md:col-span-1" />

    <div class="md:col-span-3 card">
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-xl font-bold">Thương hiệu</h1>
        <router-link to="/admin/brands/new" class="btn-primary">Thêm</router-link>
      </div>

      <table class="w-full text-sm border">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 text-left">Tên thương hiệu</th>
            <th class="p-2 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in list" :key="b.id" class="border-b hover:bg-gray-50 transition">
            <td class="p-2">{{ b.name }}</td>
            <td class="p-2 text-right">
              <router-link :to="`/admin/brands/${b.id}`" class="text-blue-600 mr-2">Sửa</router-link>
              <button class="text-red-600" @click="del(b.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar.vue";

const API = "http://localhost:3000/brands";
const list = ref([]);

async function load() {
  const { data } = await axios.get(API);
  list.value = data;
}

async function del(id) {
  if (confirm("Xóa thương hiệu này?")) {
    await axios.delete(`${API}/${id}`);
    await load();
  }
}

onMounted(load);
</script>

