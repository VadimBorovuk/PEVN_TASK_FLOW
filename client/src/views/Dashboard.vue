<template>
  <div>
    Dashboard
    <button @click="logout">Logout</button>
    <button @click="userStore.fetchAllUsers()"> get all users</button>

    <ul>
      <li v-for="item in userStore.usersData">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "@/stores/user-stote.ts";
import {useRouter} from "vue-router";

const userStore = useUserStore()
const router = useRouter()

const logout = async () => {
  try {
    await userStore.logout()
    router.push({path: '/login'})
  }catch {

  }

}
</script>

<style scoped>

</style>
