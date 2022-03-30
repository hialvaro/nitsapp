<script setup lang="ts">
import type { AwardDocument } from "@/api/awards";
import awardsApi from "@/api/awards";
import profilesApi from "@/api/profiles";
import useUser, { type User } from "@/compositions/useUser";
import type { AppwriteException } from "appwrite";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";

const { user } = useUser();
const route = useRoute();

const award = ref<AwardDocument | null>(null);
const isLoadingAward = ref<boolean>(false);
const isLoadingOwners = ref<boolean>(false);
const errorMsg = ref<string | null>(null);
const statusMsg = ref<string | null>(null);

const awardId: string = getSingleValue(route.params.awardId);

const isOwned = computed<boolean>(() =>
  award.value && user.value ? userOwnsAward(award.value, user.value) : false
);

const userNames = ref<string[]>([]);

watch(award, async () => {
  if (!award.value) {
    userNames.value = [];
    return;
  }

  isLoadingOwners.value = true;

  const profiles = await profilesApi.getUsersByIds(award.value.users);

  userNames.value = award.value.users
    .map((userId) => profiles.find((p) => p.user_id === userId)?.user_name)
    .filter((name): name is string => typeof name === "string");

  isLoadingOwners.value = false;
});

onMounted(async () => {
  isLoadingAward.value = true;

  try {
    award.value = await awardsApi.getAwardById(awardId);
  } catch (error) {
    errorMsg.value = (error as AppwriteException).message;
    setTimeout(() => {
      errorMsg.value = null;
    }, 4000);
  }

  isLoadingAward.value = false;
});

function userOwnsAward(award: AwardDocument, user: User): boolean {
  if (!user || !award.users) return false;
  return award.users.includes(user.$id);
}

function getSingleValue<T>(value: T | T[]): T {
  return Array.isArray(value) ? value[0] : value;
}
</script>

<template>
  <div v-if="isLoadingAward" class="flex justify-center items-center">
    Carregant...
  </div>
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
            v-if="isOwned"
            class="h-10 w-10 rounded-full flex justify-center items-center shadow-lg"
          >
            <img class="h-10 w-auto" src="@/assets/images/tick.svg" :alt="''" />
          </div>
        </div>

        <img
          v-if="isOwned"
          class="h-24 w-auto"
          src="@/assets/images/ice.png"
          :alt="''"
        />
        <img
          v-else
          class="h-24 w-auto"
          src="@/assets/images/question.svg"
          :alt="''"
        />

        <span
          :class="{ 'bg-nits-green': isOwned, 'bg-dark-grey': !isOwned }"
          class="mt-6 py-1 5 px-5 text-xs text-white bg-nits-green rounded-lg shadow-md"
          >{{ award.type }}</span
        >

        <div class="w-full mt-6">
          <h1
            :class="{ 'text-nits-green': isOwned, 'text-dark-grey': !isOwned }"
            class="text-2xl text-center"
          >
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
        <div v-if="isLoadingOwners" class="flex justify-center items-center">
          Carregant...
        </div>
        <div
          v-for="userName in userNames"
          v-else-if="userNames"
          :key="userName"
          class="flex flex-col items-center bg-nits-green shadow-md rounded-md cursor-pointer"
        >
          <p class="mt-2 mb-2 text-center text-xl text-nits-green-500">
            {{ userName }}
          </p>
        </div>
        <div v-else class="flex justify-center items-center">
          No hi ha cap usuari que tingui aquest premi
        </div>
      </div>
    </div>
  </div>
</template>
