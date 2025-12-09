<template>
  <div class="stack">
    <label>
      <span>Site name</span>
      <input v-model="local.site_name" />
    </label>
    <label>
      <span>Site base URL</span>
      <input v-model="local.site_base_url" placeholder="https://shop.example" />
    </label>
    <label>
      <span>Country</span>
      <input v-model="local.country" placeholder="e.g., United States" />
    </label>
    <label>
      <span>Default currency</span>
      <input v-model="local.default_currency" placeholder="USD" maxlength="3" />
    </label>
    <label>
      <span>Description</span>
      <textarea v-model="local.description"></textarea>
    </label>
    <label>
      <span>Product URL pattern</span>
      <input v-model="local.product_url_pattern" placeholder="/products/{id}" />
    </label>
    <label>
      <span>Category URL pattern</span>
      <input v-model="local.category_url_pattern" placeholder="/category/{slug}" />
    </label>
    <button @click="submit" :disabled="loading">{{ modeText }}</button>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";

const props = defineProps({
  loading: Boolean,
  modelValue: {
    type: Object,
    default: () => ({
      site_name: "",
      site_base_url: "",
      country: "",
      default_currency: "",
      description: "",
      product_url_pattern: "",
      category_url_pattern: "",
    }),
  },
});
const emit = defineEmits(["submit"]);

const local = reactive({ ...props.modelValue });

watch(
  () => props.modelValue,
  (val) => Object.assign(local, val || {}),
  { immediate: true }
);

const modeText = computed(() => (props.modelValue?.id ? "Update merchant" : "Create merchant"));

function submit() {
  emit("submit", { ...local });
}
</script>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--muted);
  font-size: 13px;
}
</style>
