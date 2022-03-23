<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- Login -->
    <form
      @submit.prevent="login"
      class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg"
    >
      <h1 class="text-3xl text-nits-green mb-4">Inicia sessió</h1>

      <div class="flex flex-col mb-2">
        <label for="email" class="mb-1 text-sm text-nits-green">Correu</label>
        <input
          type="email"
          required
          class="p-2 text-grey-500 focus:outline-none rounded-md"
          id="email"
          v-model="email"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label for="password" class="mb-1 text-sm text-nits-green"
          >Contrassenya</label
        >
        <input
          type="password"
          required
          class="p-2 text-grey-500 focus:outline-none rounded-md"
          id="password"
          v-model="password"
        />
      </div>

      <button
        class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-nits-green duration-200 border-solid border-2 border-transparent hover:border-nits-green hover:bg-white hover:text-nits-green"
        type="submit"
      >
        Entra
      </button>

      <router-link class="text-sm mt-6 text-center" :to="{ name: 'Register' }">
        No tens compte?
        <span class="text-nits-green">Registra't</span>
      </router-link>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { supabase } from "../supabase";

// Create data / vars
const router = useRouter();
const email = ref(null);
const password = ref(null);
const errorMsg = ref(null);

// Login function
const login = async () => {
  try {
    const { error } = await supabase.auth.signIn({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;
    router.push({ name: "Home" });
  } catch (error) {
    errorMsg.value = `Error: ${error.message}`;
    setTimeout(() => {
      errorMsg.value = null;
    }, 4000);
  }
};
</script>
