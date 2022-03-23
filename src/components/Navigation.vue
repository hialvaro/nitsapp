<template>
  <header class="bg-nits-green text-white">
    <nav
      class="container py-5 px-4 flex flex-col gap-4 items-center sm:flex-row"
    >
      <div class="flex items-center gap-x-4">
        <img class="w-14" src="../assets/images/bugs.svg" alt />
        <h1 class="text-lg">NitsApp</h1>
      </div>

      <ul class="flex flex-1 justify-end gap-x-10">
        <router-link class="cursor-pointer" :to="{ name: 'Home' }"
          >Premis</router-link
        >
        <router-link v-if="user" class="cursor-pointer" :to="{ name: 'Redeem' }"
          >Reclama</router-link
        >
        <!--<router-link v-if="user" class="cursor-pointer" :to="{name:''}">Users</router-link>-->
        <router-link v-if="!user" class="cursor-pointer" :to="{ name: 'Login' }"
          >Login</router-link
        >
        <router-link
          v-if="!user"
          class="cursor-pointer"
          :to="{ name: 'Register' }"
          >Registra't</router-link
        >
        <li v-if="user" @click="logout" class="cursor-pointer">Log Out</li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import store from "../stores/index";
import { computed } from "vue";
import { supabase } from "../supabase";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";

// Get user from store
const user = computed(() => store.state.user);
// Setup ref to router
const router = useRouter();
// Logout function
const logout = async () => {
  await supabase.auth.signOut();
  router.push({ name: "Home" });
};
</script>
