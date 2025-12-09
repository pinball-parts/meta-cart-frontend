<template>
  <div>
    <div class="heading">
      <div>
        <h2 style="margin: 0">{{ cart.title }}</h2>
        <p class="muted">{{ cart.description || "No description" }}</p>
      </div>
      <div class="actions">
        <button class="ghost" @click="$emit('edit-cart', cart)">Edit cart</button>
        <span class="pill">Owner: {{ cart.owner }}</span>
      </div>
    </div>

    <section class="section">
      <div class="hero">
        <input
          class="url-hero"
          v-model="pendingUrl"
          placeholder="https://shop.example/product"
          @input="maybeSuggestMerchant"
        />
        <button class="hero-btn" @click="openItemWithUrl" :disabled="!pendingUrl">↑</button>
      </div>
    </section>

    <section class="section">
      <div class="item-header">
        <h3>Items</h3>
        <div class="inline">
          <button class="ghost small" @click="groupMode = 'merchant'" :class="{ active: groupMode === 'merchant' }">
            Group by merchant
          </button>
          <button class="ghost small" @click="groupMode = 'alpha'" :class="{ active: groupMode === 'alpha' }">
            Alphabetical
          </button>
        </div>
      </div>

      <template v-if="groupMode === 'merchant'">
        <div v-if="grouped.length" class="group-list">
          <div v-for="group in grouped" :key="group.key" class="group">
            <div class="group-title">{{ group.label }}</div>
            <div class="list">
              <div v-for="item in group.items" :key="item.id" class="item">
                <div style="flex: 1">
                  <div style="font-weight: 600">{{ item.product_name }}</div>
                  <div class="muted">{{ item.product_description || "No description" }}</div>
                  <div class="muted">
                    <a :href="item.url" target="_blank" rel="noreferrer">Product link</a>
                    <span style="margin-left: 6px">• Qty {{ item.quantity }}</span>
                  </div>
                </div>
                <div style="text-align: right">
                  <div class="muted">Ref: {{ item.reference || "N/A" }}</div>
                  <button class="ghost small" @click="$emit('edit-item', item)">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="muted" v-else>No items yet.</div>
      </template>

      <template v-else>
        <div v-if="sortedAlpha.length" class="list">
          <div v-for="item in sortedAlpha" :key="item.id" class="item">
            <div style="flex: 1">
              <div style="font-weight: 600">{{ item.product_name }}</div>
              <div class="muted">{{ item.product_description || "No description" }}</div>
              <div class="muted">
                <a :href="item.url" target="_blank" rel="noreferrer">Product link</a>
                <span style="margin-left: 6px">• Qty {{ item.quantity }}</span>
              </div>
            </div>
            <div style="text-align: right">
              <div class="pill">{{ merchantName(item.merchant_id) }}</div>
              <div class="muted">Ref: {{ item.reference || "N/A" }}</div>
              <button class="ghost small" @click="$emit('edit-item', item)">Edit</button>
            </div>
          </div>
        </div>
        <div class="muted" v-else>No items yet.</div>
      </template>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
const emit = defineEmits(["add-item", "edit-item", "edit-cart"]);

const props = defineProps({
  cart: { type: Object, required: true },
  items: { type: Array, default: () => [] },
  loading: Boolean,
  merchants: { type: Array, default: () => [] },
});
const groupMode = ref("merchant");
const pendingUrl = ref("");
const suggestedMerchant = ref("");

const merchantLookup = computed(() => {
  const map = {};
  props.merchants.forEach((m) => {
    map[m.id] = m;
  });
  return map;
});

function merchantName(id) {
  const mer = merchantLookup.value[id];
  if (!mer) return "Unknown merchant";
  return mer.site_name;
}

function maybeSuggestMerchant() {
  const match = props.merchants.find((m) => pendingUrl.value && pendingUrl.value.startsWith(m.site_base_url));
  suggestedMerchant.value = match ? match.id : "";
}

function openItemWithUrl() {
  if (!pendingUrl.value) return;
  maybeSuggestMerchant();
  const payload = {
    url: pendingUrl.value,
    merchant_id: suggestedMerchant.value,
  };
  pendingUrl.value = "";
  suggestedMerchant.value = "";
  emit("add-item", payload);
}

const grouped = computed(() => {
  const groups = {};
  props.items.forEach((item) => {
    const key = item.merchant_id || "unknown";
    if (!groups[key]) {
      groups[key] = { key, label: merchantName(item.merchant_id), items: [] };
    }
    groups[key].items.push(item);
  });
  return Object.values(groups);
});

const sortedAlpha = computed(() =>
  [...props.items].sort((a, b) => a.product_name.localeCompare(b.product_name))
);
</script>

<style scoped>
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.section {
  margin-top: 16px;
  border-top: 1px solid var(--border);
  padding-top: 12px;
}
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hero {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}
.url-hero {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 16px;
  outline: none;
}
.hero-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--accent);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}
.hero-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.group-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.group-title {
  font-weight: 700;
  padding: 6px 0;
}
.group + .group {
  border-top: 1px solid var(--border);
  padding-top: 8px;
}
.item {
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 12px;
  justify-content: space-between;
}
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
}
.ghost.small {
  padding: 6px 10px;
  font-size: 13px;
}
.ghost.small.active {
  border-color: var(--accent);
  color: var(--accent);
}
.inline {
  display: flex;
  gap: 8px;
  align-items: center;
}
.url-input {
  min-width: 320px;
}
</style>
