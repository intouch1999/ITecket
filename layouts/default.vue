<template>
  <div class=" mx-auto mb-4 border-b-2 border-gray-200 shadow-md ">
    <div class="navbar bg-primary text-primary-content w-full ">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabindex="0" class=" menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li v-for="nav_path in navPaths" :key="nav_path.path">
              <NuxtLink :to="nav_path.path" :class="{ 'bg-secondary ': isActive(nav_path.path) }">{{ nav_path.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <a class="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul v-for="nav_path in navPaths" :key="nav_path.path">
          <li>
            <NuxtLink :to="nav_path.path"
              class=" rounded-lg hover:bg-secondary hover:text-white transition-colors duration-300 mx-1 p-2"
              :class="{ 'bg-secondary rounded-lg p-2': isActive(nav_path.path) }">{{ nav_path.name }}</NuxtLink>
          </li>
        </ul>
      </div>
      <div class="navbar-end">
      </div>
    </div>
    <p class="w-full bg-black"></p>
  </div>
  <div>
    <slot />
  </div>
</template>

<script setup>
const navPaths = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'แจ้งปัญหา', path: '/task' },
]

const route = useRoute()

const isActive = (routePath) => {
  return route.path === routePath
}

</script>
