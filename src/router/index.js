import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Shop from '@/pages/Shop.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import Cart from '@/pages/Cart.vue'
import Checkout from '@/pages/Checkout.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Profile from '@/pages/Profile.vue'
import Dashboard from '@/pages/Admin/Dashboard.vue'
import Products from '@/pages/Admin/Products.vue'
import ProductForm from '@/pages/Admin/ProductForm.vue'
import Users from '@/pages/Admin/Users.vue'
import { useUserStore } from '@/stores/user'

const routes = [
  { path: '/', name: 'home', component: Home, meta: { title: 'Badminton Shop — Home', desc: 'Shop vợt cầu lông chính hãng, giá tốt.' } },
  { path: '/shop', name: 'shop', component: Shop, meta: { title: 'Shop Vợt Cầu Lông', desc: 'Lọc theo brand, độ cứng, khoảng giá, phân trang.' } },
  { path: '/product/:id', name: 'product', component: ProductDetail, meta: { title: 'Chi tiết sản phẩm', desc: 'Thông tin vợt, hình ảnh, mô tả chi tiết.' } },
  { path: '/cart', name: 'cart', component: Cart, meta: { title: 'Giỏ hàng', desc: 'Quản lý sản phẩm trong giỏ.' } },
  { path: '/checkout', name: 'checkout', component: Checkout, meta: { title: 'Thanh toán', desc: 'COD hoặc VNPAY (giả lập).' } },
  { path: '/login', name: 'login', component: Login, meta: { title: 'Đăng nhập', desc: 'Đăng nhập tài khoản.' } },
  { path: '/register', name: 'register', component: Register, meta: { title: 'Đăng ký', desc: 'Tạo tài khoản mới.' } },
  { path: '/profile', name: 'profile', component: Profile, meta: { title: 'Theo dõi đơn hàng', desc: 'Thông tin và lịch sử đơn hàng.' }, metaReqAuth: true },

  // Admin
  { path: '/admin', name: 'admin', component: Dashboard, meta: { title: 'Admin Dashboard', desc: 'Tổng quan hệ thống.' }, metaAdmin: true },

  // Products CRUD
  { path: '/admin/products', name: 'admin-products', component: Products, meta: { title: 'Quản lý sản phẩm', desc: 'CRUD sản phẩm.' }, metaAdmin: true },
  { path: '/admin/products/new', name: 'admin-product-new', component: ProductForm, meta: { title: 'Thêm sản phẩm', desc: 'Form thêm sản phẩm.' }, metaAdmin: true },
  { path: '/admin/products/:id', name: 'admin-product-edit', component: ProductForm, meta: { title: 'Sửa sản phẩm', desc: 'Form sửa sản phẩm.' }, metaAdmin: true },

  // Brands CRUD
  { path: '/admin/brands', name: 'admin-brands', component: () => import('@/pages/Admin/Brands.vue'), meta: { title: 'Quản lý thương hiệu', desc: 'CRUD thương hiệu.' }, metaAdmin: true },
  { path: '/admin/brands/new', name: 'admin-brand-new', component: () => import('@/pages/Admin/BrandForm.vue'), meta: { title: 'Thêm thương hiệu', desc: 'Form thêm thương hiệu.' }, metaAdmin: true },
  { path: '/admin/brands/:id', name: 'admin-brand-edit', component: () => import('@/pages/Admin/BrandForm.vue'), meta: { title: 'Sửa thương hiệu', desc: 'Form sửa thương hiệu.' }, metaAdmin: true },

  // Users
  { path: '/admin/users', name: 'admin-users', component: Users, meta: { title: 'Người dùng', desc: 'Quản lý người dùng.' }, metaAdmin: true },

  // Orders
  { path: '/admin/orders', name: 'admin-orders', component: () => import('@/pages/Admin/Orders.vue'), meta: { title: 'Đơn hàng', desc: 'Theo dõi và cập nhật trạng thái đơn hàng.', requiresAuth: true, role: 'admin' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.afterEach((to) => {
  document.title = to.meta?.title || 'Badminton Shop'
  const desc = document.querySelector('meta[name="description"]') || (() => {
    const m = document.createElement('meta')
    m.name = 'description'
    document.head.appendChild(m)
    return m
  })()
  desc.setAttribute('content', to.meta?.desc || 'Shop vợt cầu lông chính hãng')
})

router.beforeEach((to) => {
  const user = useUserStore()
  if (to.metaAdmin && user.role !== 'admin') return { name: 'login', query: { redirect: to.fullPath } }
  if (to.metaReqAuth && !user.isLoggedIn) return { name: 'login', query: { redirect: to.fullPath } }
  return true
})

export default router
