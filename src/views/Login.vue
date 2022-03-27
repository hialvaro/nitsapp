<script setup lang="ts">
import useAppwrite from "@/compositions/useAppwrite";
import type { AppwriteException } from "appwrite";
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";

const { login } = useAppwrite();

const router = useRouter();
const email = ref<string>("");
const password = ref<string>("");
const errorMsg = ref<string | null>(null);

async function handleLogin(): Promise<void> {
  try {
    await login(email.value, password.value);
    router.push({ name: "Home" });
  } catch (error) {
    displayError(`Error: ${(error as AppwriteException).message}`);
  }
}

function displayError(message: string): void {
  errorMsg.value = message;

  setTimeout(() => {
    errorMsg.value = null;
  }, 4000);
}
</script>

<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <div
      v-if="$route.params.successMsg"
      class="mb-10 p-4 rounded-md bg-light-grey shadow-lg"
    >
      <p class="text-green-500">{{ $route.params.successMsg }}</p>
    </div>

    <!-- Login -->
    <form
      class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg"
      @submit.prevent="handleLogin"
    >
      <h1 class="text-3xl text-nits-green mb-4">Inicia sessió</h1>

      <div class="flex flex-col mb-2">
        <label for="email" class="mb-1 text-sm text-nits-green">Correu</label>
        <input
          id="email"
          v-model="email"
          type="email"
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

      <button
        class="mt-6 py-2 px-6 rounded-sm self-start text-sm text-white bg-nits-green duration-200 border-solid border-2 border-transparent hover:border-nits-green hover:bg-white hover:text-nits-green"
        type="submit"
      >
        Entra
      </button>

      <RouterLink class="text-sm mt-6 text-center" :to="{ name: 'Register' }">
        No tens compte?
        <span class="text-nits-green">Registra't</span>
      </RouterLink>
    </form>
  </div>
</template>
