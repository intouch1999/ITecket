<template>
    <NuxtLayout>
    <NuxtPage />
    </NuxtLayout>
</template>

<script setup>
useSeoMeta({
  title: 'ITicket',
  ogTitle: 'ITicket',
  description: 'IT Ticket system for IT support',
  ogDescription: 'IT Ticket system for IT support',
})

useHead({
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/img/photo.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/photo.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/img/photo.png' },
    ],
    meta: [
      { name: 'theme-color', content: '#000000' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'ITicket' },
    ],
  })
</script>