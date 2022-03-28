<script setup lang="ts">
import type { AwardDocument } from "@/api/awards";
import awardsApi from "@/api/awards";
import profilesApi from "@/api/profiles";
import useUser from "@/compositions/useUser";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const { user } = useUser();
const route = useRoute();

type LocalAward = AwardDocument & { owned: boolean };

const award = ref<AwardDocument | LocalAward | null>(null);
const isLoading = ref<boolean>(false);
const errorMsg = ref<string | null>(null);
const statusMsg = ref<string | null>(null);

const currentId = route.params.awardId;

onMounted(async () => {
  try {
    isLoading.value = true;
    if (user.value) {
      // We check if the user has this award
      award.value = await awardsApi.getAwardById(currentId);
      award.value = {
        ...award.value,
        owned: user.value ? userOwnsAward(award.value, user.value) : false,
      };

      console.log(award.value);

      award.value = award.value;
      let userList = await profilesApi.getAllUsers();
      console.log(userList);
      for (let u in award.value.users) {
        award.value.users[u] =
          userList[
            userList.map((e) => e.user_id).indexOf(award.value.users[u])
          ].user_name;
      }
      isLoading.value = false;
    } else {
      console.log("error");
      //Show award as not owned
      isLoading.value = true;
      award.value = await awardsApi.getAwardById(currentId);
      award.value = {
        ...award.value,
        owned: false,
      };
      let userList = await profilesApi.getAllUsers();
      for (let u in award.value.users) {
        award.value.users[u] =
          userList[
            userList.map((e) => e.user_id).indexOf(award.value.users[u])
          ].user_name;
      }
      isLoading.value = false;
    }
  } catch (error) {
    errorMsg.value = (error as any).message;
    setTimeout(() => {
      errorMsg.value = null;
    }, 4000);
  }
});

function userOwnsAward(award: LocalAward, user: any): boolean {
  if (!user || !award.users) return false;
  return award.users.includes(user.$id);
}
</script>

<template>
  <div v-if="isLoading || !award">Carregant...</div>
  <div v-else class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- App MSG -->
    <div
      v-if="statusMsg || errorMsg"
      class="mb-10 p-4 rounded-md bg-light-grey"
    >
      <p class="text-nits-green">{{ statusMsg }}</p>

      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <div v-if="award">
      <!-- General info -->
      <div
        class="flex flex-col items-center p-8 rounded-md shadow-md bg-light-grey relative"
      >
        <div v-if="user" class="flex absolute left-2 top-2 gap-x-2">
          <div
            v-if="award.owned"
            class="h-10 w-10 rounded-full flex justify-center items-center shadow-lg"
          >
            <img class="h-10 w-auto" src="@/assets/images/tick.svg" alt />
          </div>
        </div>

        <img
          v-if="award.owned"
          class="h-24 w-auto"
          src="@/assets/images/ice.png"
          alt
        />
        <img
          v-else
          class="h-24 w-auto"
          src="@/assets/images/question.svg"
          alt
        />

        <span
          v-if="award.owned"
          class="mt-6 py-1 5 px-5 text-xs text-white bg-nits-green rounded-lg shadow-md"
          >{{ award.type }}</span
        >
        <span
          v-else
          class="mt-6 py-1 5 px-5 text-xs text-white bg-dark-grey rounded-lg shadow-md"
          >{{ award.type }}</span
        >

        <div class="w-full mt-6">
          <h1 v-if="award.owned" class="text-nits-green text-2xl text-center">
            {{ award.title }}
          </h1>

          <h1 v-else class="text-dark-grey text-2xl text-center">
            {{ award.title }}
          </h1>
        </div>

        <div class="w-full mt-6">
          <p class="text-black text-lg text-center">{{ award.description }}</p>
        </div>
      </div>

      <h1 class="text-nits-green text-2xl text-center mt-8 mb-2">
        Qui té aquest premi
      </h1>

      <div
        class="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="(user, index) in award.users"
          :key="index"
          class="flex flex-col items-center bg-nits-green shadow-md rounded-md cursor-pointer"
        >
          <p class="mt-2 mb-2 text-center text-xl text-nits-green-500">
            {{ user }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
