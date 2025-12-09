import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export const api = {
  async listCarts() {
    const { data } = await axios.get(`${apiBase}/carts`);
    return data;
  },
  async createCart(payload) {
    const { data } = await axios.post(`${apiBase}/carts`, payload);
    return data;
  },
  async getCart(id) {
    const { data } = await axios.get(`${apiBase}/carts/${id}`);
    return data;
  },
  async updateCart(id, payload) {
    const { data } = await axios.put(`${apiBase}/carts/${id}`, payload);
    return data;
  },
  async deleteCart(id) {
    await axios.delete(`${apiBase}/carts/${id}`);
  },
  async addItem(cartId, payload) {
    const { data } = await axios.post(`${apiBase}/carts/${cartId}/items`, payload);
    return data;
  },
  async updateItem(cartId, itemId, payload) {
    const { data } = await axios.put(`${apiBase}/carts/${cartId}/items/${itemId}`, payload);
    return data;
  },
  async listMerchants() {
    const { data } = await axios.get(`${apiBase}/merchants`);
    return data;
  },
  async createMerchant(payload) {
    const { data } = await axios.post(`${apiBase}/merchants`, payload);
    return data;
  },
  async updateMerchant(id, payload) {
    const { data } = await axios.put(`${apiBase}/merchants/${id}`, payload);
    return data;
  },
  async deleteMerchant(id) {
    await axios.delete(`${apiBase}/merchants/${id}`);
  },
};
