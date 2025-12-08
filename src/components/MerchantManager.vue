<template>
  <div>
    <h2>Merchants</h2>
    <p class="muted">Manage merchant directory (requires auth later).</p>

    <div class="grid">
      <label>
        <span>Site name</span>
        <input v-model="form.site_name" />
      </label>
      <label>
        <span>Site base URL</span>
        <input v-model="form.site_base_url" placeholder="https://shop.example" />
      </label>
      <label>
        <span>Country</span>
        <input v-model="form.country" placeholder="e.g., United States" />
      </label>
      <label>
        <span>Default currency</span>
        <input v-model="form.default_currency" placeholder="USD" maxlength="3" />
      </label>
      <label class="wide">
        <span>Description</span>
        <textarea v-model="form.description"></textarea>
      </label>
      <label class="wide">
        <span>Product URL pattern</span>
        <input v-model="form.product_url_pattern" placeholder="e.g., /products/{id}" />
      </label>
      <label class="wide">
        <span>Category URL pattern</span>
        <input v-model="form.category_url_pattern" placeholder="e.g., /category/{slug}" />
      </label>
    </div>
    <div class="actions">
      <button @click="submit" :disabled="loading">{{ editing ? "Update" : "Create" }}</button>
      <button class="ghost" @click="reset" :disabled="loading">Reset</button>
      <span class="muted" v-if="message">{{ message.text }}</span>
    </div>

    <div class="list" v-if="merchants.length">
      <div v-for="m in merchants" :key="m.id" class="item">
        <div>
          <div class="title">{{ m.site_name }}</div>
          <div class="muted">{{ m.site_base_url }}</div>
          <div class="muted">Country: {{ m.country || "N/A" }} • Currency: {{ m.default_currency || "N/A" }}</div>
        </div>
        <div class="inline">
          <button class="ghost small" @click="edit(m)">Edit</button>
          <button class="ghost small danger" @click="$emit('delete', m.id)">Delete</button>
        </div>
      </div>
    </div>
    <div class="muted" v-else>No merchants yet.</div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";

const props = defineProps({
  merchants: { type: Array, default: () => [] },
  loading: Boolean,
});
const emit = defineEmits(["create", "update", "delete"]);

const empty = {
  id: "",
  site_name: "",
  site_base_url: "",
  description: "",
  country: "",
  default_currency: "",
  product_url_pattern: "",
  category_url_pattern: "",
};

const form = reactive({ ...empty });
const message = reactive({ text: "" });

const editing = computed(() => Boolean(form.id));

function submit() {
  message.text = "";
  if (!form.site_name || !form.site_base_url) {
    message.text = "Site name and base URL required";
    return;
  }
  if (editing.value) {
    emit("update", { ...form });
  } else {
    emit("create", { ...form });
  }
}

function edit(m) {
  Object.assign(form, m);
}

function reset() {
  Object.assign(form, empty);
}

watch(
  () => props.loading,
  (loading) => {
    if (!loading && !editing.value) {
      message.text = "";
    }
  }
);
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}
.wide {
  grid-column: 1 / -1;
}
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
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
