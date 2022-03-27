<script setup lang="ts">
import useUser from "@/compositions/useUser";
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const { getUser, logout } = useUser();

const isLoggedIn = ref<boolean>(false);

onMounted(async () => {
  const user = await getUser();

  isLoggedIn.value = Boolean(user);
});

const router = useRouter();

async function handleLogout(): Promise<void> {
  try {
    await logout();
  } catch (error) {
    console.error(error);

    router.push({ name: "Home" });
  }
}
</script>

<template>
  <header class="bg-nits-green text-white">
    <nav
      class="container py-5 px-4 flex flex-col gap-4 items-center sm:flex-row"
    >
      <div class="flex items-center gap-x-4">
        <img class="w-14" src="../assets/images/bugs.svg" :alt="''" />
        <h1 class="text-lg">NitsApp</h1>
      </div>

      <ul class="flex flex-1 justify-end gap-x-10">
        <router-link class="cursor-pointer" :to="{ name: 'Home' }"
          >Premis</router-link
        >
        <router-link
          v-if="isLoggedIn"
          class="cursor-pointer"
          :to="{ name: 'Redeem' }"
          >Reclama</router-link
        >
        <!--<router-link v-if="isLoggedIn" class="cursor-pointer" :to="{name:''}">Users</router-link>-->
        <router-link
          v-if="!isLoggedIn"
          class="cursor-pointer"
          :to="{ name: 'Login' }"
          >Login</router-link
        >
        <router-link
          v-if="!isLoggedIn"
          class="cursor-pointer"
          :to="{ name: 'Register' }"
          >Registra't</router-link
        >
        <li v-if="isLoggedIn" class="cursor-pointer" @click="handleLogout">
          Log Out
        </li>
      </ul>
    </nav>
  </header>
</template>
