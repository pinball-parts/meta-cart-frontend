<template>
  <div :data-theme="theme">
    <header class="header">
      <div class="brand">Meta Cart</div>
      <div class="controls">
        <label class="toggle">
          <input type="checkbox" v-model="isLight" />
          <span>Light mode</span>
        </label>
      </div>
    </header>
    <main class="layout">
      <section class="card sidebar">
        <div class="sidebar-header">
          <h2 style="margin: 0">Carts</h2>
          <button @click="openCartModal()">New cart</button>
        </div>
        <cart-list :carts="carts" :selected-id="selectedCart?.cart?.id" @select="selectCart" />
      </section>
      <section class="card content">
        <cart-detail
          v-if="selectedCart"
          :cart="selectedCart.cart"
          :items="selectedCart.items"
          :loading="busy"
          :merchants="merchants"
          @add-item="openItemModal"
          @edit-cart="openCartModal(selectedCart.cart)"
          @edit-item="openItemModal"
        />
        <div v-else class="muted">Pick a cart to see details.</div>
      </section>
    </main>

    <div class="merchant-fab">
      <button class="ghost" @click="openMerchantModal">Manage merchants</button>
    </div>

    <modal v-if="showCartModal" @close="closeCartModal">
      <template #title>{{ cartFormMode === "edit" ? "Edit cart" : "New cart" }}</template>
      <cart-form
        :model-value="cartFormData"
        :loading="busy"
        @submit="submitCart"
      />
    </modal>

    <modal v-if="showItemModal" @close="closeItemModal">
      <template #title>{{ itemFormMode === "edit" ? "Edit item" : "Add item" }}</template>
      <item-form
        :model-value="itemFormData"
        :loading="busy"
        :merchants="merchants"
        @submit="submitItem"
      />
    </modal>

    <modal v-if="showMerchantModal" @close="closeMerchantModal">
      <template #title>Merchants</template>
      <merchant-manager
        :merchants="merchants"
        :loading="busy"
        @create="createMerchant"
        @update="updateMerchant"
        @delete="deleteMerchant"
      />
    </modal>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import CartForm from "./components/CartForm.vue";
import CartList from "./components/CartList.vue";
import CartDetail from "./components/CartDetail.vue";
import ItemForm from "./components/ItemForm.vue";
import MerchantManager from "./components/MerchantManager.vue";
import Modal from "./components/Modal.vue";
import { api } from "./api";

const carts = ref([]);
const selectedCart = ref(null);
const busy = ref(false);
const isLight = ref(false);
const theme = ref("dark");
const showCartModal = ref(false);
const showItemModal = ref(false);
const showMerchantModal = ref(false);
const cartFormMode = ref("create");
const cartFormData = ref({});
const itemFormMode = ref("create");
const itemFormData = ref({});
const merchants = ref([]);

watch(isLight, (val) => {
  theme.value = val ? "light" : "dark";
});

async function loadCarts() {
  busy.value = true;
  try {
    const [cartData, merchantData] = await Promise.all([api.listCarts(), api.listMerchants()]);
    carts.value = cartData;
    merchants.value = merchantData;
  } finally {
    busy.value = false;
  }
}

async function selectCart(cart) {
  busy.value = true;
  try {
    const detail = await api.getCart(cart.id);
    selectedCart.value = detail;
  } finally {
    busy.value = false;
  }
}

function openCartModal(cart = null) {
  cartFormMode.value = cart ? "edit" : "create";
  cartFormData.value = cart ? { ...cart } : { owner: "", title: "", description: "" };
  showCartModal.value = true;
}

function closeCartModal() {
  showCartModal.value = false;
}

async function submitCart(payload) {
  busy.value = true;
  try {
    if (cartFormMode.value === "edit" && payload.id) {
      const updated = await api.updateCart(payload.id, payload);
      // update local collections
      carts.value = carts.value.map((c) => (c.id === updated.id ? updated : c));
      if (selectedCart.value?.cart?.id === updated.id) {
        selectedCart.value = { ...selectedCart.value, cart: updated };
      }
    } else {
      const cart = await api.createCart(payload);
      carts.value = [cart, ...carts.value];
      await selectCart(cart);
    }
    closeCartModal();
  } finally {
    busy.value = false;
  }
}

function openItemModal(item = null) {
  if (!selectedCart.value) return;
  itemFormMode.value = item ? "edit" : "create";
  itemFormData.value = item
    ? { ...item }
    : {
        merchant_id: merchants.value[0]?.id || "",
        url: "",
        product_name: "",
        product_description: "",
        reference: "",
        quantity: 1,
      };
  showItemModal.value = true;
}

function closeItemModal() {
  showItemModal.value = false;
}

async function submitItem(payload) {
  if (!selectedCart.value) return;
  busy.value = true;
  try {
    if (itemFormMode.value === "edit" && payload.id) {
      const updated = await api.updateItem(selectedCart.value.cart.id, payload.id, payload);
      selectedCart.value.items = (selectedCart.value.items || []).map((it) =>
        it.id === updated.id ? updated : it
      );
    } else {
      const item = await api.addItem(selectedCart.value.cart.id, payload);
      selectedCart.value.items = [item, ...(selectedCart.value.items || [])];
    }
    closeItemModal();
  } finally {
    busy.value = false;
  }
}

function openMerchantModal() {
  showMerchantModal.value = true;
}
function closeMerchantModal() {
  showMerchantModal.value = false;
}

async function createMerchant(payload) {
  busy.value = true;
  try {
    const mer = await api.createMerchant(payload);
    merchants.value = [...merchants.value, mer];
  } finally {
    busy.value = false;
  }
}

async function updateMerchant(payload) {
  busy.value = true;
  try {
    const mer = await api.updateMerchant(payload.id, payload);
    merchants.value = merchants.value.map((m) => (m.id === mer.id ? mer : m));
  } finally {
    busy.value = false;
  }
}

async function deleteMerchant(id) {
  busy.value = true;
  try {
    await api.deleteMerchant(id);
    merchants.value = merchants.value.filter((m) => m.id !== id);
  } finally {
    busy.value = false;
  }
}

onMounted(loadCarts);
</script>

<style scoped>
.header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  font-weight: 700;
  letter-spacing: 0.5px;
}
.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
}
.layout {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 20px;
}
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
.divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 16px 0;
}
.sidebar {
  min-height: 520px;
}
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.merchant-fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
