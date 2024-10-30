<template>
    <transition name="fade">
      <div
        v-if="isOpen"
        @click.self="closeModal"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      >
      <button
            @click="closeModal"
            class="absolute top-0 right-0 text-white text-3xl px-4 py-2"
          >
            &times;
          </button>
        <div class=" relative">

          <transition name="zoom">
            <img
              v-if="isOpen"
              class="rounded-xl max-h-screen"
              :src="imgSrc"
              alt="Modal Image"
              loading="lazy"
              ismap=""
              decoding="auto"
              
            />
          </transition>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  const props = defineProps({
    imgSrc: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
  });
  
  const emit = defineEmits(['close']);
  
  const closeModal = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  
  .zoom-enter-active,
  .zoom-leave-active {
    transition: transform 0.5s;
  }
  .zoom-enter,
  .zoom-leave-to {
    transform: scale(0.8);
  }
  
  .modal-container {
    max-width: 90%;
    max-height: 90%;
  }
  
  @media (min-width: 768px) {
    .modal-container {
      max-width: 70%;
      max-height: 70%;
    }
  }
  </style>
  