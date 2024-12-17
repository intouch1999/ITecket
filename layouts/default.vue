<template>
  <div class=" mx-auto border-b-2 border-red-300 shadow-md ">
    <div class="navbar bg-primary text-primary-content w-full ">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabindex="0" class="  menu menu-lg w-52 dropdown-content bg-primary text-white-content rounded-box z-20 mt-3 p-2 shadow">
            <li v-for="nav_path in rolepage" :key="nav_path.path">
              <NuxtLink :to="nav_path.path" :class="{ 'bg-primary ': isActive(nav_path.path) }">{{ nav_path.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <NuxtLink :to="'/'" class="btn btn-ghost text-xl">ITicket</NuxtLink>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul v-for="nav_path in rolepage" :key="nav_path.path">
          <li>
            <NuxtLink :to="nav_path.path"
              class=" rounded-lg hover:bg-secondary hover:text-white transition-colors duration-300 mx-1 p-2"
              :class="{ 'bg-secondary rounded-lg p-2': isActive(nav_path.path) }">{{ nav_path.name }}</NuxtLink>
          </li>
        </ul>
      </div>
      <div class="navbar-end">
        <button @click="logout" class="mr-2 btn btn-primary">Logout</button>
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
  { name: 'แจ้งปัญหา', path: '/tasks' },
  { name: 'แอดมิน' , path: '/admins'}
]

const route = useRoute()
const authCookie = useCookie('user_auth')
console.log(authCookie.value)

const isActive = (routePath) => {
  return route.path === routePath
}

const rolepage = computed(() => {
  if (authCookie.value.role === 1) {
    return navPaths
  } else {
    return navPaths.filter(item => item.name !== 'แอดมิน')
  } 
})

const logout = async () => {
  authCookie.value = null
  await navigateTo('/login')
}
</script>
