import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "@/stores/user-stote.ts"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { public: true },
    },
    {
      path: '/registration',
      name: 'Registration',
      component: () => import('../views/Registration.vue'),
      meta: { public: true },
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  document.title = `Task Flow`

  const userStore = useUserStore()
  const isPublicRoute = to.matched.some(record => record.meta.public)

  // на публічних сторінках рефреш/перевірка сесії не потрібні —
  // просто дозволяємо перехід, якщо юзер вже точно неавторизований,
  // або якщо authChecked ще не викликався взагалі
  if (isPublicRoute) {
    // якщо сесія вже підтверджена як активна (isAuth = true) —
    // авторизованого юзера не пускаємо назад на login/registration
    if (userStore.isAuth) {
      return next({ name: 'Dashboard' })
    }
    return next()
  }

  // приватна сторінка — перевіряємо сесію один раз за життя вкладки
  if (!userStore.authChecked) {
    await userStore.restoreSession()
  }

  if (!userStore.isAuth) {
    return next({ name: 'Login' })
  }

  next()
})

export default router
