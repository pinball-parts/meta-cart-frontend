<template>
  <div class="stack">
    <label>
      <span>Owner</span>
      <input v-model="local.owner" placeholder="who owns this cart" />
    </label>
    <label>
      <span>Title</span>
      <input v-model="local.title" placeholder="Pinball rebuild" />
    </label>
    <label>
      <span>Description</span>
      <textarea v-model="local.description" placeholder="Scope, priorities, notes"></textarea>
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
    default: () => ({ owner: "", title: "", description: "" }),
  },
});
const emit = defineEmits(["submit"]);

const local = reactive({ owner: "", title: "", description: "" });

watch(
  () => props.modelValue,
  (val) => Object.assign(local, val || { owner: "", title: "", description: "" }),
  { immediate: true }
);

const modeText = computed(() => (props.modelValue?.id ? "Update cart" : "Create cart"));

function submit() {
  if (!local.owner || !local.title) return;
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
