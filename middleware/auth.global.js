
  export default defineNuxtRouteMiddleware((to, from) => {
    const authCookie = useCookie('user_auth')

    if (to.path === '/login' && authCookie.value) {
      return navigateTo('/')
    }

    if (!authCookie.value) {
      if (to.path !== '/login') {
        return navigateTo('/login')
      }
    } else {

      if (to.path.startsWith('/admins') && authCookie.value.role !== 1) {
        return navigateTo('/')
      }
    }
  })