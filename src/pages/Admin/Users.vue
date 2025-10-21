<template>
  <section class="grid md:grid-cols-4 gap-6">
    <AdminSidebar class="md:col-span-1" />

    <div class="md:col-span-3 card">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-3">
        <h1 class="text-xl font-bold">Quản lý người dùng</h1>

        <div class="flex items-center gap-2">
          <input
            v-model.trim="search"
            type="text"
            placeholder="🔍 Tìm theo tên..."
            class="border px-3 py-1 rounded text-sm w-40 md:w-56"
          />
          <select v-model="filterRole" class="border px-3 py-1 rounded text-sm">
            <option value="">Tất cả</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button
            @click="openForm()"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
            v-if="isAdmin"
          >
            + Thêm
          </button>
        </div>
      </div>

      <!-- Table -->
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left border-b">
            <th class="py-2">Avatar</th>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in filteredUsers"
            :key="u.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="py-2">
              <img
                :src="u.avatar || '/images/placeholder.png'"
                alt="avatar"
                class="w-8 h-8 rounded-full object-cover"
              />
            </td>
            <td>{{ u.username }}</td>
            <td class="select-none">••••••</td>
            <td>{{ u.role }}</td>
            <td class="text-center space-x-2">
              <button
                v-if="isAdmin"
                @click="openForm(u)"
                class="text-blue-600 hover:underline"
              >
                Sửa
              </button>
              <button
                v-if="isAdmin"
                @click="deleteUser(u.id)"
                class="text-red-500 hover:underline"
              >
                Xóa
              </button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="text-center text-gray-500 py-3">
              Không có người dùng nào.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Popup Form -->
      <div
        v-if="showForm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
          <h2 class="text-lg font-semibold mb-4 text-center">
            {{ form.id ? "Cập nhật người dùng" : "Thêm người dùng" }}
          </h2>

          <div class="grid gap-3">
            <!-- Avatar -->
            <div class="text-center">
              <img
                :src="form.avatar || '/images/placeholder.png'"
                class="w-20 h-20 rounded-full mx-auto mb-2 object-cover border"
              />
              <input type="file" @change="onFileChange" accept="image/*" />
            </div>

            <div>
              <label class="block text-sm mb-1">Tên đăng nhập</label>
              <input
                v-model.trim="form.username"
                type="text"
                placeholder="Username"
                class="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label class="block text-sm mb-1">Mật khẩu</label>
              <div class="flex border rounded">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model.trim="form.password"
                  placeholder="Password"
                  class="px-3 py-2 flex-1"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="px-3 text-gray-500"
                >
                  {{ showPassword ? "Ẩn" : "Hiện" }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm mb-1">Quyền</label>
              <select v-model="form.role" class="border rounded px-3 py-2 w-full">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              @click="saveUser"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Lưu
            </button>
            <button
              @click="showForm = false"
              class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar.vue";

const API = "http://localhost:3000/users";
const users = ref([]);
const showForm = ref(false);
const showPassword = ref(false);
const form = ref({ id: null, username: "", password: "", role: "user", avatar: "" });
const search = ref("");
const filterRole = ref("");
const isAdmin = ref(false); // ✅ xác định quyền người đăng nhập

// ✅ Giả lập quyền (sau này lấy từ Pinia user store)
const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
isAdmin.value = currentUser?.role === "admin";

// 🧠 Lấy danh sách người dùng
async function fetchUsers() {
  const { data } = await axios.get(API);
  users.value = data;
}

// 🧩 Lọc + tìm kiếm
const filteredUsers = computed(() => {
  return users.value.filter((u) => {
    const matchName = u.username
      .toLowerCase()
      .includes(search.value.toLowerCase());
    const matchRole = filterRole.value ? u.role === filterRole.value : true;
    return matchName && matchRole;
  });
});

// 🟢 Mở form
function openForm(u = null) {
  form.value = u
    ? { ...u }
    : { id: null, username: "", password: "", role: "user", avatar: "" };
  showForm.value = true;
  showPassword.value = false;
}

// 🖼️ Xử lý ảnh upload (base64 preview)
function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    form.value.avatar = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// 💾 Lưu user
async function saveUser() {
  if (!form.value.username || !form.value.password)
    return alert("❌ Vui lòng nhập đầy đủ thông tin!");

  // Check trùng username
  if (!form.value.id) {
    const exists = users.value.some(
      (u) => u.username.toLowerCase() === form.value.username.toLowerCase()
    );
    if (exists) return alert("⚠️ Username đã tồn tại!");
  }

  try {
    if (form.value.id) {
      await axios.patch(`${API}/${form.value.id}`, form.value);
      alert("✅ Cập nhật thành công!");
    } else {
      await axios.post(API, form.value);
      alert("✅ Thêm người dùng thành công!");
    }
    showForm.value = false;
    fetchUsers();
  } catch (err) {
    console.error(err);
    alert("❌ Lỗi khi lưu người dùng!");
  }
}

// ❌ Xóa
async function deleteUser(id) {
  if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
  await axios.delete(`${API}/${id}`);
  alert("🗑️ Đã xóa người dùng!");
  fetchUsers();
}

onMounted(fetchUsers);
</script>

<style scoped>
.card {
  @apply bg-white p-5 rounded-lg shadow-sm;
}
</style>
