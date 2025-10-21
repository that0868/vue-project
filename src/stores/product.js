import { defineStore } from 'pinia'
import axios from 'axios'


const API = 'http://localhost:3000'


export const useProductStore = defineStore('product', {
state: () => ({
list: [],
total: 0,
loading: false,
detail: null,
}),
actions: {
async fetch(params = {}) {
this.loading = true
const { page = 1, limit = 12, q = '', brand = '', stiffness = '', price_min = '', price_max = '' } = params
const qs = new URLSearchParams()
qs.append('_page', page); qs.append('_limit', limit)
if (q) qs.append('name_like', q)
if (brand) qs.append('brand', brand)
if (stiffness) qs.append('stiffness', stiffness)
if (price_min !== '') qs.append('price_gte', Math.max(0, Number(price_min) || 0))
if (price_max !== '') qs.append('price_lte', Math.max(0, Number(price_max) || 0))
const { data, headers } = await axios.get(`${API}/products?${qs.toString()}`)
this.list = data
this.total = Number(headers['x-total-count'] || data.length)
this.loading = false
},
async getById(id) {
const { data } = await axios.get(`${API}/products/${id}`)
this.detail = data
return data
},
// Admin CRUD
async create(payload) { const { data } = await axios.post(`${API}/products`, payload); return data },
async update(id, payload) { const { data } = await axios.put(`${API}/products/${id}`, payload); return data },
async remove(id) { await axios.delete(`${API}/products/${id}`) }
}
})