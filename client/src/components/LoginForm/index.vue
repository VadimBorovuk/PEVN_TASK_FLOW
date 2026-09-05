<template>
  <div>
    <form @submit.prevent="login">
      <input type="text" v-model="userStore.formLogin.email" placeholder="Enter email">
      <input type="password" v-model="userStore.formLogin.password" placeholder="Enter password">

      <button type="submit">Login</button>
      <RouterLink to="/registration">registration</RouterLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "@/stores/user-stote.ts";
import {RouterLink, useRouter} from "vue-router";

const userStore = useUserStore()
const router = useRouter()

const login = async () => {
  try {
    await userStore.login()
    router.push({path: '/'})
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped>

</style>
