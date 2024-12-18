<template>
  <div class="fixed z-50 w-full mx-auto ">
    <div class="navbar bg-accent text-primary-content w-full">
      <div class="navbar-start">
        <div class="dropdown">
          <label class="btn btn-circle  swap swap-rotate lg:hidden">
            <!-- this hidden checkbox controls the state -->
            <input  @click="openNav = !openNav" type="checkbox" />

            <!-- hamburger icon -->
            <svg
              class="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path
                d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"
              />
            </svg>

            <!-- close icon -->
            <svg
              class="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <polygon
                points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
              />
            </svg>
          </label>
        </div>
        <NuxtLink :to="'/'" class="btn btn-ghost text-xl">ITicket</NuxtLink>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul v-for="nav_path in rolepage" :key="nav_path.path">
          <li>
            <NuxtLink
              :to="nav_path.path"
              class="rounded-lg hover:bg-secondary hover:text-white transition-colors duration-300 mx-1 p-2"
              :class="{
                'bg-secondary rounded-lg p-2': isActive(nav_path.path),
              }"
              >{{ nav_path.name }}</NuxtLink
            >
          </li>
        </ul>
      </div>
      <div class="navbar-end">
        <button @click="logout" class="mr-2 btn btn-ghost">Logout</button>
      </div>
    </div>
    <p class="w-full bg-black"></p>
    <div v-show="openNav" class="w-full flex flex-col lg:hidden bg-white rounded-2xl">
      <NuxtLink
        :to="nav_path.path"
        class="w-full p-2"
        :class="{
          'bg-secondary text-primary-content': isActive(nav_path.path),
        }"
        v-for="nav_path in rolepage"
        :key="nav_path.path"
      >
        <p>{{ nav_path.name }}</p>
      </NuxtLink>
    </div>
  </div>
  <div>
    <slot />
  </div>
</template>

<script setup>
const navPaths = [
  { name: "หน้าแรก", path: "/" },
  { name: "แจ้งปัญหา", path: "/tasks" },
  { name: "แอดมิน", path: "/admins" },
];

const openNav = ref(false);

const route = useRoute();
const authCookie = useCookie("user_auth");
console.log(authCookie.value);

const isActive = (routePath) => {
  return route.path === routePath;
};

const rolepage = computed(() => {
  if (authCookie.value.role === 1) {
    return navPaths;
  } else {
    return navPaths.filter((item) => item.name !== "แอดมิน");
  }
});

const logout = async () => {
  authCookie.value = null;
  await navigateTo("/login");
};
</script>
