<template>
  <div>
    <h2 style="margin-top: 0">Carts</h2>
    <div class="list" v-if="carts.length">
      <div
        v-for="cart in carts"
        :key="cart.id"
        class="item"
        :class="{ active: cart.id === selectedId }"
        @click="$emit('select', cart)"
      >
        <div>
          <div class="title">{{ cart.title }}</div>
          <div class="muted">{{ cart.description || "No description" }}</div>
        </div>
        <span class="pill">{{ cart.owner }}</span>
      </div>
    </div>
    <div class="muted" v-else>No carts yet.</div>
  </div>
</template>

<script setup>
defineProps({
  carts: { type: Array, default: () => [] },
  selectedId: String,
});
</script>

<style scoped>
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
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  transition: border-color 0.1s ease, background 0.1s ease;
}
.item:hover,
.item.active {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--panel) 70%, var(--bg));
}
.title {
  font-weight: 600;
}
</style>
