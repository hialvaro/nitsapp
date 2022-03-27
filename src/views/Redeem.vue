<script setup lang="ts">
import useAppwrite from "@/compositions/useAppwrite";
import { ref } from "vue";
import { useRouter } from "vue-router";

const { getUser, getAwardsByCode, updateAward } = useAppwrite();

const router = useRouter();
const code = ref<string>("");
const errorMsg = ref<string | null>(null);
const successMsg = ref<string | null>(null);

const redeem = async () => {
  try {
    const user = await getUser();
    if (!user) return router.push({ name: "Login" });

    const award = (await getAwardsByCode(code.value))[0];

    if (!award) {
      throw new Error("Aquest codi no existeix");
    }

    if (!award.users) award.users = [];

    if (award.users.includes(user.$id as string)) {
      throw new Error("Ja tens aquest premi");
    }

    if (award.howmany <= award.users.length) {
      throw new Error("Aquest premi està esgotat");
    }

    award.users.push(user.$id);

    await updateAward(award);

    successMsg.value = `Has rebut un nou premi: ${award.title}`;
    setTimeout(() => {
      successMsg.value = null;
    }, 6000);
    router.push({ name: "Home" });
  } catch (error) {
    errorMsg.value = `Error: ${error as string}`;
    setTimeout(() => {
      errorMsg.value = null;
    }, 4000);
  }
};
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

    <!-- Login -->
    <form
      class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg"
      @submit.prevent="redeem"
    >
      <h1 class="text-3xl text-nits-green mb-4">Reclama un premi</h1>

      <div class="flex flex-col mb-2">
        <label for="code" class="mb-1 text-sm text-nits-green">Codi</label>
        <input
          id="code"
          v-model="code"
          type="text"
          required
          class="p-2 text-grey-500 focus:outline-none rounded-md"
        />
      </div>

      <button
        class="mt-6 py-2 px-6 rounded-md self-start text-sm text-white bg-nits-green duration-200 border-solid border-2 border-transparent hover:border-nits-green hover:bg-white hover:text-nits-green"
        type="submit"
      >
        Reclama!
      </button>
    </form>
  </div>
</template>
