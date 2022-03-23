<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { supabase } from "../supabase";

// Create data / vars
const router = useRouter();
const email = ref(null);
const username = ref(null);
const password = ref(null);
const confirmPass = ref(null);
const errorMsg = ref(null);

// Register function
const register = async () => {
  if (password.value === confirmPass.value) {
    try {
      const { user, err } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      });

      const updates = {
        id: user.id,
        username: username.value,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (err) throw err;
      if (error) throw error;
      router.push({ name: "Login" });
    } catch (error) {
      errorMsg.value = error.message;
      setTimeout(() => {
        errorMsg.value = null;
      }, 4000);
    }
    return;
  }
  errorMsg.value = "Error: Les contrassenyes no coincideixen.";
  setTimeout(() => {
    errorMsg.value = null;
  }, 4000);
};
</script>

<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!-- Register -->
    <form
      class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg"
      @submit.prevent="register"
    >
      <h1 class="text-3xl text-nits-green mb-4">Registra't</h1>

      <div class="flex flex-col mb-2">
        <label for="email" class="mb-1 text-sm text-nits-green">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="p-2 text-grey-500 focus:outline-none rounded-md"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label for="username" class="mb-1 text-sm text-nits-green"
          >Usuari</label
        >
        <input
          id="username"
          v-model="username"
          type="text"
          required
          class="p-2 text-grey-500 focus:outline-none rounded-md"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label for="password" class="mb-1 text-sm text-nits-green"
          >Contrassenya</label
        >
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="p-2 text-grey-500 focus:outline-none rounded-md"
        />
      </div>

      <div class="flex flex-col mb-2">
        <label for="confirmPass" class="mb-1 text-sm text-nits-green"
          >Confirma la contrassenya</label
        >
        <input
          id="confirmPass"
          v-model="confirmPass"
          type="password"
          required
          class="p-2 text-grey-500 focus:outline-none rounded-md"
        />
      </div>

      <button
        class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-nits-green duration-200 border-solid border-2 border-transparent hover:border-nits-green hover:bg-white hover:text-nits-green"
        type="submit"
      >
        Registra'm
      </button>

      <router-link class="text-sm mt-6 text-center" :to="{ name: 'Login' }">
        Ja tens un compte?
        <span class="text-nits-green">Inicia sessió</span>
      </router-link>
    </form>
  </div>
</template>
