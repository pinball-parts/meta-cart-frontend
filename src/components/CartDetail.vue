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
      <div class="item-header">
        <h3>Add item</h3>
        <button @click="$emit('add-item')">New item</button>
      </div>
    </section>

    <section class="section">
      <h3>Items</h3>
      <div v-if="items && items.length" class="list">
        <div v-for="item in items" :key="item.id" class="item">
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
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  cart: { type: Object, required: true },
  items: { type: Array, default: () => [] },
  loading: Boolean,
  merchants: { type: Array, default: () => [] },
});

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
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item {
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--panel) 90%, var(--bg));
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
</style>
