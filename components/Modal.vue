<template>
    <dialog :open="isOpen" id="my_modal_5" class="modal modal-bottom sm:modal-middle bg-black bg-opacity-50" @click.self="closeModal" @keydown.esc="closeModal" ref="modal">
      <div class="modal-box">
        <div class="rounde border-b-2 border-gray-200 py-2 mb-4">
            <slot name="title"></slot>
        </div>
        <slot name="content"></slot>
        <div class="modal-action">
          <form method="dialog ">
            <div class="flex flex-row justify-end gap-4">
            <slot name="action"></slot>
            <button @click="closeModal" class="btn btn-ghost">ยกเลิก</button>
            </div>
        </form>
        </div>
      </div>
    </dialog>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  // รับค่า props isOpen จากภายนอก
  const props = defineProps({
    isOpen: Boolean
  });
  
  // กำหนด emit สำหรับ close event
  const emit = defineEmits(['close']);
  
  // ฟังก์ชันสำหรับปิดโมดัล
  const closeModal = () => {
    emit('close');
  };
  
  // จัดการโฟกัสเมื่อโมดัลเปิด
  const modal = ref(null);
  onMounted(() => {
    if (props.isOpen && modal.value) {
      modal.value.focus();
    }
  });
  
  // เมื่อโมดัลถูกปิด
  onBeforeUnmount(() => {
    closeModal();
  });
  </script>
  
  <style scoped>
  .modal-fade-enter-active, .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .modal-fade-enter, .modal-fade-leave-to {
    opacity: 0;
  }
  </style>
  