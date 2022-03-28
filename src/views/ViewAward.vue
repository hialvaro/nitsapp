<script setup lang="ts">
import type { AwardDocument } from "@/api/awards";
import awardsApi from "@/api/awards";
import useUser, { type User } from "@/compositions/useUser";
import type { Award } from "@/types";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { aw_users } from "@/appwrite";
const route = useRoute();

type LocalAward = AwardDocument;

const { user } = useUser();

const award = ref<AwardDocument[] | LocalAward | null>(null);
const isLoading = ref<boolean>(false);
const errorMsg = ref<string | null>(null);
const statusMsg = ref<string | null>(null);

const currentId = route.params.awardId;

const getData = async () => {
  try {
    isLoading.value = true;
    award.value = await awardsApi.getAwardsById(currentId);
    award.value = award.value[0];

    if (user.value) {
      // We check if the user has this award
      award.value = (await awardsApi.getAwardsById(currentId))?.map<LocalAward>(
        (awrd) => ({
          ...awrd,
          owned: user.value ? userOwnsAward(awrd, user.value) : false,
        })
      );

      award.value = award.value[0];
      let userList = (await aw_users.list()).users;
      for (let u in award.value.users) {
        award.value.users[u] =
          userList[
            userList.map((e) => e.$id).indexOf(award.value.users[u])
          ].name;
      }
      isLoading.value = false;
    } else {
      //Show award as not owned
      isLoading.value = true;
      award.value = (await awardsApi.getAwardsById(currentId))?.map<LocalAward>(
        (awrd) => ({
          ...awrd,
          owned: false,
        })
      );
      isLoading.value = false;
    }
  } catch (error) {
    errorMsg.value = (error as any).message;
    setTimeout(() => {
      errorMsg.value = null;
    }, 4000);
  }

  function userOwnsAward(award: Award, user: any): boolean {
    if (!user || !award.users) return false;
    return award.users.includes(user.$id);
  }

  return {
    award,
    user,
  };
};

getData();
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
