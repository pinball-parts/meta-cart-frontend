<template>
  <div class="backdrop" @click.self="$emit('close')">
    <div class="modal">
      <header class="modal-header">
        <slot name="title"></slot>
        <button class="close" @click="$emit('close')">✕</button>
      </header>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(["close"]);
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}
.modal {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: min(640px, 100%);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}
.modal-header {
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
}
.modal-body {
  padding: 16px;
}
.close {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  padding: 6px 10px;
}
</style>
