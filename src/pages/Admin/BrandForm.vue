<template>
  <div class="p-4 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">
        {{ isEdit ? "Sửa thương hiệu" : "Thêm thương hiệu mới" }}
      </h1>
      <router-link to="/admin/brands" class="btn-gray">← Quay lại</router-link>
    </div>

    <form @submit.prevent="save" class="grid gap-3">
      <input
        v-model="f.name"
        placeholder="Tên thương hiệu"
        class="border rounded px-3 py-2"
        required
      />

      <button type="submit" class="btn-primary mt-3">
        {{ isEdit ? "Lưu thay đổi" : "Thêm thương hiệu" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const API = "http://localhost:3000/brands";
const route = useRoute();
const router = useRouter();

const isEdit = ref(false);
const f = ref({ name: "" });

async function save() {
  if (isEdit.value) {
    await axios.put(`${API}/${route.params.id}`, f.value);
    alert("Cập nhật thành công!");
  } else {
    await axios.post(API, f.value);
    alert("Thêm thương hiệu thành công!");
  }
  router.push("/admin/brands");
}

onMounted(async () => {
  if (route.params.id) {
    isEdit.value = true;
    const { data } = await axios.get(`${API}/${route.params.id}`);
    f.value = data;
  }
});
</script>
