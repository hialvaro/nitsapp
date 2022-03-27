<script setup lang="ts">
import type { AwardDocument } from "@/api/awards";
import useAppwrite, { type User } from "@/compositions/useAppwrite";
import type { Award } from "@/types";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

type LocalAward = AwardDocument & { owned: boolean };

const { getUser, getAllAwards } = useAppwrite();

const awards = ref<LocalAward[]>([]);
const isLoading = ref<boolean>(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    const user = await getUser();

    awards.value = (await getAllAwards())
      ?.map<LocalAward>((award) => ({
        ...award,
        owned: user ? userOwnsAward(award, user) : false,
      }))
      .sort((x, y) => (x.owned === y.owned ? 0 : x.owned ? -1 : 1));
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
});

function userOwnsAward(award: Award, user: User): boolean {
  if (!user || !award.users) return false;
  return award.users.includes(user.$id);
}
</script>

<template>
  <div v-if="isLoading || !awards">Carregant...</div>
  <div v-else class="container mt-10 px-4">
    <!-- No data -->
    <div v-if="awards.length === 0" class="w-full flex flex-col items-center">
      <h1 class="text-2xl">Sembla que això està buit...</h1>
      <!--<router-link class="mt-6 py-2 px-6 rounded-sm self-start text-sm
      text-white bg-nits-green duration-200 border-solid
      border-2 border-transparent hover:border-nits-green hover:bg-white
      hover:text-nits-green" :to={name: 'Create'}>Create</router-link>-->
    </div>

    <!-- Data -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10"
    >
      <router-link
        v-for="award in awards"
        :key="award.id"
        :class="{ 'border-4 border-nits-light-green rounded-md': award.owned }"
        class="flex flex-col items-center bg-light-grey p-8 shadow-md cursor-pointer"
        :to="{ name: 'View-Award', params: { awardId: award.$id } }"
      >
        <!-- Img -->
        <img
          v-if="award.owned"
          src="@/assets/images/infinity.svg"
          class="h-24 w-auto"
        />
        <img v-else src="@/assets/images/question.svg" class="h-24 w-auto" />

        <p
          :class="[
            { 'bg-nits-blue text-white': award.type === 'rar' },
            { 'bg-nits-green': award.type === 'comú' },
            { 'bg-nits-violet': award.type === 'èpic' },
            { 'bg-nits-gold': award.type === 'llegendàri' },
          ]"
          class="p-2 mt-6 py-1 text-xs text-white shadow-md rounded lg"
        >
          {{ award.type }}
        </p>

        <h1
          v-if="award.owned"
          class="mt-8 mb-2 text-center text-xl text-nits-green"
        >
          {{ award.title }}
        </h1>

        <h1 v-else class="mt-8 mb-2 text-center text-xl text-dark-grey">
          {{ award.title }}
        </h1>

        <h1
          v-if="award.howmany <= 30"
          class="p-2 mt-6 py-1 text-xs text-nits-green bg-grey shadow-md rounded lg"
        >
          {{ award.users?.length ?? 0 }} / {{ award.howmany }}
        </h1>

        <h1
          v-if="award.howmany === 999"
          class="p-2 mt-6 py-1 text-xs text-nits-green bg-grey shadow-md rounded lg"
        >
          <img src="@/assets/images/infinity.svg" class="h-4 w-auto" />
        </h1>
      </router-link>
    </div>
  </div>
</template>
