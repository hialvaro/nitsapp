<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
// Appwrite
import { Appwrite, Query } from "appwrite";
import { Server } from "../utils/config";

// Create data / vars
const router = useRouter();
const code = ref<string>("");
const errorMsg = ref<string | null>(null);
const successMsg = ref<string | null>(null);

//if (!user.value) router.push({ name: "Home" });

let appwrite = new Appwrite();
appwrite
  .setEndpoint(Server.endpoint as string)
  .setProject(Server.project as string);

let promise = appwrite.account.get();
promise.then(
  function () {
    return;
  },
  function (error) {
    console.log(error);
    router.push({ name: "Home" });
  }
);

// Login function
const redeem = async () => {
  try {
    const user = await appwrite.account.get();
    // Query the document via code index
    const tempAward = await appwrite.database.listDocuments(
      "623dd13a121effab1eaf",
      [Query.equal("code", code.value)]
    );

    let award = tempAward.documents[0];

    if (!award) {
      errorMsg.value = "Aquest codi no existeix!";
      throw errorMsg.value;
    } else if (award.users.includes(user.$id as string)) {
      errorMsg.value = "Ja tens aquest premi!";
      throw errorMsg.value;
    } else if (award.howmany <= award.users.length) {
      errorMsg.value = "Aquest premi està esgotat!";
      throw errorMsg.value;
    } else {
      // Add the user to award owners
      award.users.push(user.$id);
      // Update the database
      let promise = appwrite.database.updateDocument(
        award.$collection,
        award.$id,
        award
      );
      promise.then(
        function (response) {
          // Inform the user
          console.log(response);
          successMsg.value = `Has rebut un nou premi: ${award.title}`;
          setTimeout(() => {
            successMsg.value = null;
          }, 6000);
          router.push({ name: "Home" });
        },
        function (error) {
          throw error.message;
        }
      );
    }
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
