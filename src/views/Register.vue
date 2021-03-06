<script setup lang="ts">
import useUser from "@/compositions/useUser";
import type { AppwriteException } from "appwrite";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const { register } = useUser();

const router = useRouter();
const email = ref<string>("");
const name = ref<string>("");
const password = ref<string>("");
const confirmPass = ref<string>("");
const errorMsg = ref<string | null>(null);
const successMsg = ref<string | null>(null);

async function handleRegister(): Promise<void> {
  if (password.value !== confirmPass.value) {
    errorMsg.value = "Error: Les contrassenyes no coincideixen.";
    setTimeout(() => {
      errorMsg.value = null;
    }, 4000);

    return;
  }

  try {
    await register(email.value, password.value, name.value);

    successMsg.value = "Compte creat correctament.";
    router.push({ name: "Login", params: { successMsg: successMsg.value } });
  } catch (error) {
    console.error(error);
    errorMsg.value = (error as AppwriteException).message;
    setTimeout(() => {
      errorMsg.value = null;
    }, 4000);
  }
}
</script>

<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- Error Handling -->
    <div v-if="errorMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <div v-if="successMsg" class="mb-10 p-4 rounded-md bg-light-grey shadow-lg">
      <p class="text-green-500">{{ successMsg }}</p>
    </div>

    <!-- Register -->
    <form
      class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg"
      @submit.prevent="handleRegister"
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
        <label for="name" class="mb-1 text-sm text-nits-green">Nom</label>
        <input
          id="name"
          v-model="name"
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
