<template>
  <div>
    <header class="header">
      <div class="brand">Meta Cart</div>
      <nav class="nav">
        <button class="ghost" :class="{ active: currentView === 'carts' }" @click="toCarts">Carts</button>
        <button class="ghost" :class="{ active: currentView === 'merchants' }" @click="currentView = 'merchants'">
          Merchants
        </button>
      </nav>
      <div class="controls">
        <label class="toggle">
          <input type="checkbox" v-model="isLight" />
          <span>Light mode</span>
        </label>
      </div>
    </header>

    <main v-if="currentView === 'carts'" class="layout single">
      <section class="card content">
        <cart-list
          :carts="carts"
          :selected-id="selectedCart?.cart?.id"
          @select="selectCart"
          @edit="openCartModal"
          @delete="deleteCart"
        />
      </section>
    </main>

    <main v-else-if="currentView === 'items'" class="layout single">
      <section class="card content">
        <cart-detail
          v-if="selectedCart"
          :cart="selectedCart.cart"
          :items="selectedCart.items"
          :loading="busy"
          :merchants="merchants"
          @add-item="openItemModal"
          @edit-item="openItemModal"
        />
        <div v-else class="muted">No cart selected.</div>
      </section>
    </main>

<main v-else class="layout single">
  <section class="card content">
    <h2>Merchants</h2>
    <merchant-list :merchants="merchants" @edit="openMerchantModal" @delete="deleteMerchant" />
  </section>
</main>

    <button class="fab" v-if="currentView === 'carts'" @click="openCartModal()">+</button>
    <button class="fab" v-else-if="currentView === 'merchants'" @click="openMerchantModal()">+</button>
    <button class="fab" v-else-if="currentView === 'items'" @click="openItemModal()">+</button>

    <modal v-if="showCartModal" @close="closeCartModal">
      <template #title>{{ cartFormData.id ? "Edit cart" : "New cart" }}</template>
      <cart-form :model-value="cartFormData" :loading="busy" @submit="submitCart" />
    </modal>

    <modal v-if="ui.showMerchantModal" @close="closeMerchantModal">
      <template #title>{{ ui.merchantDraft.id ? "Edit merchant" : "New merchant" }}</template>
      <merchant-form :model-value="ui.merchantDraft" :loading="busy" @submit="submitMerchant" />
    </modal>

    <modal v-if="ui.showItemModal" @close="closeItemModal">
      <template #title>{{ ui.itemDraft.id ? "Edit item" : "Add item" }}</template>
      <item-form
        :model-value="ui.itemDraft"
        :loading="busy"
        :merchants="merchants"
        @submit="submitItem"
        @create-merchant="openMerchantModalFromItem"
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
import MerchantForm from "./components/MerchantForm.vue";
import MerchantList from "./components/MerchantList.vue";
import Modal from "./components/Modal.vue";
import { api } from "./api";
import { useUiStore } from "./stores/ui";

const carts = ref([]);
const selectedCart = ref(null);
const busy = ref(false);
const isLight = ref(false);
const theme = ref("dark");
const currentView = ref("carts");
const showCartModal = ref(false);
const cartFormData = ref({ owner: "", title: "", description: "" });
const merchants = ref([]);
const ui = useUiStore();

watch(isLight, (val) => {
  theme.value = val ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme.value);
});

async function loadAll() {
  busy.value = true;
  try {
    const [cartData, merchantData] = await Promise.all([api.listCarts(), api.listMerchants()]);
    carts.value = cartData;
    merchants.value = merchantData;
  } finally {
    busy.value = false;
  }
}

function toCarts() {
  currentView.value = "carts";
  selectedCart.value = null;
}

async function selectCart(cart) {
  busy.value = true;
  try {
    const detail = await api.getCart(cart.id);
    selectedCart.value = detail;
    currentView.value = "items";
  } finally {
    busy.value = false;
  }
}

function openCartModal(cart = null) {
  cartFormData.value = cart ? { ...cart } : { owner: "", title: "", description: "" };
  showCartModal.value = true;
}
function closeCartModal() {
  showCartModal.value = false;
}

async function submitCart(payload) {
  busy.value = true;
  try {
    if (payload.id) {
      const updated = await api.updateCart(payload.id, payload);
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

async function deleteCart(cart) {
  busy.value = true;
  try {
    await api.deleteCart(cart.id);
    carts.value = carts.value.filter((c) => c.id !== cart.id);
    if (selectedCart.value?.cart?.id === cart.id) {
      selectedCart.value = null;
      currentView.value = "carts";
    }
  } finally {
    busy.value = false;
  }
}

function openMerchantModal(merchant = null) {
  ui.openMerchantModal(
    merchant || {
      site_name: "",
      site_base_url: "",
      country: "",
      default_currency: "",
      description: "",
      product_url_pattern: "",
      category_url_pattern: "",
    }
  );
}
function closeMerchantModal() {
  ui.closeMerchantModal();
}

async function submitMerchant(payload) {
  busy.value = true;
  try {
    if (payload.id) {
      const mer = await api.updateMerchant(payload.id, payload);
      merchants.value = merchants.value.map((m) => (m.id === mer.id ? mer : m));
    } else {
      const mer = await api.createMerchant(payload);
      merchants.value = [...merchants.value, mer];
      ui.onMerchantCreated(mer.id);
    }
    if (!ui.returnToItemAfterMerchant) {
      closeMerchantModal();
    }
  } finally {
    busy.value = false;
  }
}

async function deleteMerchant(merchant) {
  busy.value = true;
  try {
    await api.deleteMerchant(merchant.id);
    merchants.value = merchants.value.filter((m) => m.id !== merchant.id);
  } finally {
    busy.value = false;
  }
}

function openItemModal(item = null) {
  if (!selectedCart.value) return;
  const draft = item
    ? { ...item }
    : {
        merchant_id: merchants.value[0]?.id || "",
        url: "",
        product_name: "",
        product_description: "",
        reference: "",
        quantity: 1,
      };
  ui.openItemModal(draft, merchants.value[0]?.id || "");
}
function closeItemModal() {
  ui.closeItemModal();
}

function openMerchantModalFromItem(draft) {
  ui.openMerchantFromItem(draft || ui.itemDraft);
}

async function submitItem(payload) {
  if (!selectedCart.value) return;
  busy.value = true;
  try {
    if (payload.id) {
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

onMounted(loadAll);
onMounted(() => {
  document.documentElement.setAttribute("data-theme", theme.value);
});
</script>

<style scoped>
.header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
.nav {
  display: flex;
  gap: 8px;
}
.nav .active {
  border-color: var(--accent);
  color: var(--accent);
}
.layout.single {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}
.card {
  min-height: 60vh;
}
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--accent), #38bdf8);
  color: #0b1120;
  font-size: 28px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
</style>
