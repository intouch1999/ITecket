<template>
  <div class="flex justify-center items-center h-screen bg-purple-300">
    <div v-if="pageLoading" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="text-white text-center">
        <Loading />
        <p class="mt-2">กำลังโหลดข้อมูล...</p>
      </div>
    </div>
    <div v-else class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-2xl font-bold mb-4">เข้าสู่ระบบ</h1>
      <form @submit.prevent="login" class="space-y-4">
        <label
          class="group input input-bordered focus-within:input-info transition-colors duration-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
            class="h-4 w-4 opacity-70 text-gray-500 group-focus-within:text-blue-500 transition-colors duration-300">
            <path
              d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input v-model="logIN.username" type="text" class="grow" name="username" placeholder="User: admin or user" />
        </label>

        <label
          class="group input input-bordered focus-within:input-info transition-colors duration-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
            class="h-4 w-4 opacity-70 text-gray-500 group-focus-within:text-blue-500 transition-colors duration-300">
            <path fill-rule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clip-rule="evenodd" />
          </svg>
          <input v-model="logIN.password" type="password" class="grow" name="password" placeholder="Pass: 1234" />
        </label>
        <div class="flex justify-end">
          <button @keyup.enter="login" class="btn btn-primary">เข้าสู่ระบบ</button>
        </div>
      </form>
    </div>
  </div>
  <div class="toast toast-end">
  <div v-if="status === 'success'" class="alert alert-success border-white">
    <span>เข้าสู่ระบบสำเร็จ</span>
  </div>
  <div v-else-if="status === 'error'" class="alert alert-error border-white">
    <span>ไอดีผู้ใช้หรือรหัสผ่านไม่ถูกต้อง</span>
  </div>
  <div v-else></div>
</div>
</template>

<script setup>
const supabase = useSupabase();

//gobal state states.js
const pageLoading = usePageLoading()

const logIN = ref({
  username: "",
  password: ""
})
const status = ref(null)


const login = async () => {
  try{
    const tolowerCase = {
      username: logIN.value.username.toLowerCase(),
      password: logIN.value.password.toLowerCase()
    }

    const { data , error } = await supabase
    .from("users")
    .select("name , password , role")
    .eq("name", tolowerCase.username)
    .eq("password", tolowerCase.password)
    .single()

    const authCookie = useCookie('user_auth', {
      maxAge: 60*60*24,
      path: '/' // cookie available across the site
    })

    authCookie.value = JSON.stringify({
      username: data.name,
      id: data.id,
      role: data.role
    })

    if (error) {
      status.value = 'error'
      throw new Error(error.message)
    } 

    status.value = 'success'
    await new Promise(resolve => setTimeout(resolve, 3000))
    status.value = null

    await navigateTo('/')
  } catch (error) {
    status.value = 'error'
    await new Promise(resolve => setTimeout(resolve, 3000))
    status.value = null
    throw new Error(error.message)
  }
}

definePageMeta({
  layout: "blank",
});
</script>
