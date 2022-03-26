<script setup lang="ts">
import store from "../stores/index";
import { computed, ref } from "vue";
import { supabase } from "../supabase";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import { Appwrite } from "appwrite";

const user = ref<boolean>(false);

const appwrite = new Appwrite();

appwrite
  .setEndpoint("https://supa.r3d.red/v1")
  .setProject("623dcfae0a5b8f0027d6");

let promise = appwrite.account.get();
promise.then(
  function (response) {
    user.value = true; // Success
  },
  function (error) {
    user.value = false; // Failure
  }
);

// Get user from store
// Setup ref to router
const router = useRouter();
// Logout function
const logout = async () => {
  let promise = appwrite.account.deleteSession("current");
  try {
    promise.then(
      function (response) {
        console.log(response); // Success
      },
      function (error) {
        console.log(error); // Failure
        router.push({ name: "Home" });
      }
    );
  } catch (error) {
    console.warn(error);
  }
};
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
        <li v-if="user" class="cursor-pointer" @click="logout">Log Out</li>
      </ul>
    </nav>
  </header>
</template>
