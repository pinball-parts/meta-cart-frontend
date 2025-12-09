<template>
  <div>
    <div class="list" v-if="merchants.length">
      <div v-for="m in merchants" :key="m.id" class="item">
        <div>
          <div class="title">{{ m.site_name }}</div>
          <div class="muted">{{ m.site_base_url }}</div>
          <div class="muted">Country: {{ m.country || "N/A" }} • Currency: {{ m.default_currency || "N/A" }}</div>
        </div>
        <div class="inline">
          <button class="ghost small" @click="$emit('edit', m)">Edit</button>
          <button class="ghost small danger" @click="$emit('delete', m)">Delete</button>
        </div>
      </div>
    </div>
    <div class="muted" v-else>No merchants yet.</div>
  </div>
</template>

<script setup>
defineProps({
  merchants: { type: Array, default: () => [] },
});
defineEmits(["edit", "delete"]);
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
  align-items: center;
}
.title {
  font-weight: 600;
}
.inline {
  display: flex;
  gap: 8px;
  align-items: center;
}
.small {
  padding: 6px 10px;
  font-size: 13px;
}
.danger {
  border-color: #f43f5e;
  color: #f43f5e;
}
</style>
