<template>
    <section class="grid md:grid-cols-4 gap-6">
        <AdminSidebar class="md:col-span-1" />

        <div class="md:col-span-3 grid gap-4">
            <!-- Thống kê tổng quan -->
            <div class="grid md:grid-cols-3 gap-4">
                <div class="card">
                    <div class="text-sm text-gray-500">Tổng sản phẩm</div>
                    <div class="text-2xl font-bold">{{ stats.products }}</div>
                </div>
                <div class="card">
                    <div class="text-sm text-gray-500">Doanh thu</div>
                    <div class="text-2xl font-bold">
                        {{ stats.revenue.toLocaleString('vi-VN') }}₫
                    </div>
                </div>
                <div class="card">
                    <div class="text-sm text-gray-500">Đơn hàng</div>
                    <div class="text-2xl font-bold">{{ stats.orders }}</div>
                </div>
            </div>

            <!-- Biểu đồ 1: Đơn hàng theo trạng thái -->
            <div class="card">
                <div class="font-semibold mb-2">Thống kê đơn hàng theo trạng thái</div>
                <div class="relative w-full h-[300px]">
                    <canvas ref="orderChartRef" class="w-full h-full"></canvas>
                </div>
            </div>

            <!-- Biểu đồ 2: Sản phẩm theo thương hiệu -->
            <div class="card">
                <div class="font-semibold mb-2">Thống kê sản phẩm theo thương hiệu</div>
                <div class="relative w-full h-[300px]">
                    <canvas ref="brandChartRef" class="w-full h-full"></canvas>
                </div>
            </div>

            <!-- Biểu đồ 3: Doanh thu theo tháng -->
            <div class="card">
                <div class="font-semibold mb-2">Thống kê doanh thu theo tháng</div>
                <div class="relative w-full h-[300px]">
                    <canvas ref="revenueChartRef" class="w-full h-full"></canvas>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import axios from 'axios'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

//  Khai báo biến chính
const API = 'http://localhost:3000'
const stats = reactive({ products: 0, revenue: 0, orders: 0 })

//  Biểu đồ refs và instance
const orderChartRef = ref(null)
const brandChartRef = ref(null)
const revenueChartRef = ref(null)
let orderChartInstance = null
let brandChartInstance = null
let revenueChartInstance = null

//  Lấy dữ liệu từ API
const fetchData = async () => {
    try {
        const [productsRes, ordersRes] = await Promise.all([
            axios.get(`${API}/products`),
            axios.get(`${API}/orders`)
        ])

        const products = productsRes.data
        const orders = ordersRes.data

        // Tổng sản phẩm
        stats.products = products.length

        // Tổng đơn hàng
        stats.orders = orders.length

        // Doanh thu chỉ tính đơn "completed"
        stats.revenue = orders
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + Number(o.total || 0), 0)

        // Vẽ biểu đồ
        renderOrderChart(orders)
        renderBrandChart(products)
        renderRevenueChart(orders)
    } catch (err) {
        console.error(' Lỗi tải dữ liệu Dashboard:', err)
    }
}

//
//  Biểu đồ 1: Đơn hàng theo trạng thái
//
function renderOrderChart(orders) {
    const ctx = orderChartRef.value.getContext('2d')
    const grouped = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1
        return acc
    }, {})
    const labels = Object.keys(grouped)
    const data = Object.values(grouped)

    if (orderChartInstance) orderChartInstance.destroy()

    orderChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Số lượng đơn hàng',
                data,
                backgroundColor: ['#facc15', '#3b82f6', '#8b5cf6', '#22c55e', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            plugins: { legend: { display: false } }
        }
    })
}

//
//  Biểu đồ 2: Sản phẩm theo thương hiệu
//
function renderBrandChart(products) {
    const ctx = brandChartRef.value.getContext('2d')
    const grouped = products.reduce((acc, p) => {
        const brand = p.brand || 'Khác'
        acc[brand] = (acc[brand] || 0) + 1
        return acc
    }, {})
    const labels = Object.keys(grouped)
    const data = Object.values(grouped)

    if (brandChartInstance) brandChartInstance.destroy()

    brandChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                label: 'Số lượng sản phẩm',
                data,
                backgroundColor: [
                    '#facc15', // vàng - Yonex
                    '#3b82f6', // xanh - Li-Ning
                    '#8b5cf6', // tím - Victor
                    '#22c55e', // xanh lá - Mizuno
                    '#ef4444', // đỏ - khác
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            plugins: { legend: { display: false } }
        }
    })
}

//
// Biểu đồ 3: Doanh thu theo tháng
//
function renderRevenueChart(orders) {
    const ctx = revenueChartRef.value.getContext('2d')

    const grouped = orders.reduce((acc, o) => {
        if (o.status !== 'completed') return acc
        const month = new Date(o.createdAt).toLocaleString('vi-VN', { month: 'short', year: 'numeric' })
        acc[month] = (acc[month] || 0) + Number(o.total || 0)
        return acc
    }, {})

    const labels = Object.keys(grouped)
    const data = Object.values(grouped)

    if (revenueChartInstance) revenueChartInstance.destroy()

    revenueChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Doanh thu (₫)',
                data,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34,197,94,0.3)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => v.toLocaleString('vi-VN') + '₫' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.parsed.y.toLocaleString('vi-VN')}₫`
                    }
                }
            }
        }
    })
}

onMounted(fetchData)
</script>
