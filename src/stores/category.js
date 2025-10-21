import { defineStore } from 'pinia'
import axios from 'axios'
const API = 'http://localhost:3000'


export const useCategoryStore = defineStore('category', {
state: () => ({ list: [] }),
actions: {
async fetch() { const { data } = await axios.get(`${API}/categories`); this.list = data },
async create(payload) { const { data } = await axios.post(`${API}/categories`, payload); return data },
async update(id, payload) { const { data } = await axios.put(`${API}/categories/${id}`, payload); return data },
async remove(id) { await axios.delete(`${API}/categories/${id}`) }
}
})