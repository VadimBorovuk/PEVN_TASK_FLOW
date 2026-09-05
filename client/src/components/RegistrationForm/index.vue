<template>
  <div>
    <form @submit.prevent="registration">
      <input type="text" v-model="userStore.formRegistration.name" placeholder="Enter your name">
      <input type="text" v-model="userStore.formRegistration.email" placeholder="Enter email">
      <input type="password" v-model="userStore.formRegistration.password" placeholder="Enter password">

      <button type="submit">Registration</button>
      <RouterLink to="/login">login</RouterLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "@/stores/user-stote.ts";
import {RouterLink} from "vue-router";

const userStore = useUserStore()

const registration = async () => {
  try {
    await userStore.registration()
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped>

</style>
