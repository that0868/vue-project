<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">
      {{ isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới' }}
    </h1>

    <form @submit.prevent="save" class="grid gap-3">
      <input v-model="f.name" placeholder="Tên sản phẩm" class="border rounded px-3 py-2" required />
   <select v-model="f.brand" class="border rounded px-3 py-2">
      <option disabled value="">Chọn thương hiệu</option>
      <option v-for="b in brands" :key="b.id" :value="b.name">{{ b.name }}</option>
   </select>

      <input v-model.number="f.price" type="number" min="0" placeholder="Giá" class="border rounded px-3 py-2" />
      <input v-model.number="f.stock" type="number" min="0" placeholder="Tồn kho" class="border rounded px-3 py-2" />

      <!-- Upload nhiều ảnh -->
      <div>
        <label class="block font-medium mb-1">Hình ảnh</label>
        <input type="file" multiple accept="image/*" @change="handleFiles" class="border rounded px-3 py-2 w-full" />

        <!-- Preview -->
        <div v-if="previews.length" class="flex flex-wrap gap-3 mt-3">
          <div v-for="(src, i) in previews" :key="i" class="relative group">
            <img :src="src" class="w-24 h-24 object-cover rounded border" />
            <button
              type="button"
              class="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 hidden group-hover:block"
              @click="removeImage(i)"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <textarea v-model="f.description" placeholder="Mô tả sản phẩm" class="border rounded px-3 py-2"></textarea>

      <button type="submit" class="btn-primary mt-3">
        {{ isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'


const brands = ref([])

const API = 'http://localhost:3000/products'
const route = useRoute()
const router = useRouter()

const isEdit = ref(false)
const f = ref({
  name: '',
  brand: '',
  price: 0,
  stock: 0,
  description: '',
  image: [] // 🟢 Lưu base64
})
const previews = ref([])

// 🔵 Chuyển file sang base64
function handleFiles(e) {
  const files = Array.from(e.target.files)
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = ev => {
      const base64 = ev.target.result
      if (base64.startsWith('data:image')) {
        f.value.image.push(base64)
        previews.value.push(base64)
      }
    }
    reader.readAsDataURL(file)
  })
}

// 🔵 Xóa ảnh
function removeImage(i) {
  f.value.image.splice(i, 1)
  previews.value.splice(i, 1)
}

// 🔵 Lưu / Cập nhật
async function save() {
  if (isEdit.value) {
    await axios.put(`${API}/${route.params.id}`, f.value)
    alert('Cập nhật thành công!')
  } else {
    await axios.post(API, f.value)
    alert('Thêm sản phẩm thành công!')
  }
  router.push('/admin/products')
}

// 🔵 Nếu đang sửa → load sản phẩm cũ
onMounted(async () => {
  const { data } = await axios.get('http://localhost:3000/brands')
  brands.value = data

  if (route.params.id) {
    isEdit.value = true
    const { data: product } = await axios.get(`${API}/${route.params.id}`)
    f.value = product
    previews.value = Array.isArray(product.image) ? product.image : [product.image]
  }
})
</script>
