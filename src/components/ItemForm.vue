<template>
  <div class="grid">
    <label>
      <span>Merchant</span>
      <select v-model="local.merchant_id">
        <option disabled value="">Select merchant</option>
        <option v-for="m in merchants" :key="m.id" :value="m.id">
          {{ m.site_name }} ({{ m.site_base_url }})
        </option>
      </select>
    </label>
    <label>
      <span>Reference</span>
      <input v-model="local.reference" placeholder="SKU or vendor ref" />
    </label>
    <label class="wide">
      <span>Product name</span>
      <input v-model="local.product_name" placeholder="Flipper assembly" />
    </label>
    <label class="wide">
      <span>Product description</span>
      <textarea v-model="local.product_description" placeholder="Notes or fitment"></textarea>
    </label>
    <label class="wide">
      <span>URL</span>
      <input v-model="local.url" placeholder="https://shop.example/item" />
    </label>
    <label>
      <span>Quantity</span>
      <input type="number" min="1" v-model.number="local.quantity" />
    </label>
    <div class="actions">
      <button @click="submit" :disabled="loading">{{ modeText }}</button>
      <span class="muted" v-if="message">{{ message.text }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";

  const props = defineProps({
    loading: Boolean,
    modelValue: {
      type: Object,
      default: () => ({
        merchant_id: "",
        url: "",
        product_name: "",
        product_description: "",
        reference: "",
        quantity: 1,
      }),
    },
    merchants: {
      type: Array,
      default: () => [],
    },
  });
  const emit = defineEmits(["submit"]);

const local = reactive({
  merchant_id: "",
  url: "",
  product_name: "",
  product_description: "",
  reference: "",
  quantity: 1,
});
const message = reactive({ text: "" });

watch(
  () => props.modelValue,
  (val) => {
    Object.assign(local, val || {});
    if (!local.quantity) local.quantity = 1;
  },
  { immediate: true }
);

const modeText = computed(() => (props.modelValue?.id ? "Update item" : "Add item"));

function submit() {
  message.text = "";
  if (!local.product_name || !local.url || !local.merchant_id) {
    message.text = "Merchant, product name and URL are required";
    return;
  }
  emit("submit", { ...local });
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}
.wide {
  grid-column: 1 / -1;
}
label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--muted);
  font-size: 13px;
}
.actions {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
