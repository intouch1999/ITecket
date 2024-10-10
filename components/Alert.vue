<template>
    <div v-if="isOpen" class="toast toast-end">
      <div :class="['alert', status === 'success' ? 'alert-success' : 'alert-error']">
        <span>{{ message }}{{ status === 'success' ? 'สำเร็จ' : 'ไม่สำเร็จ' }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    isOpen: Boolean,
    message: String,
    status: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error'].includes(value)
    }
  })
  </script>