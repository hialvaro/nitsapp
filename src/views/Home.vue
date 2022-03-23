<template>
  <div v-if="dataLoaded" class="container mt-10 px-4">
    <!-- No data -->
    <div v-if="data.length === 0" class="w-full flex flex-col items-center">
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
        :class="{ 'border-4 border-nits-light-green rounded-md': award.owned }"
        class="flex flex-col items-center bg-light-grey p-8 shadow-md cursor-pointer"
        :to="{ name: 'View-Award', params: { awardId: award.id } }"
        v-for="award in data"
        :key="award.id"
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
          {{ award.users.length }} / {{ award.howmany }}
        </h1>

        <h1
          v-if="award.howmany == 999"
          class="p-2 mt-6 py-1 text-xs text-nits-green bg-grey shadow-md rounded lg"
        >
          <img src="@/assets/images/infinity.svg" class="h-4 w-auto" />
        </h1>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { supabase } from "../supabase";
import { RouterLink } from "vue-router";

import store from "../stores/index";

// Create data / vars
const data = ref([]);
const dataLoaded = ref(false);
const user = computed(() => store.state.user);

onMounted(async () => {
  try {
    const { data: awards, error } = await supabase.from("awards").select("*");

    if (error) throw error;

    // Check which awards does the user have
    for (let awrd in awards) {
      let awardOwners = awards[awrd].users;
      if (!awards[awrd].users) awards[awrd].users = [];
      for (let usr in awardOwners) {
        if (user.value && user.value.id === awardOwners[usr]) {
          awards[awrd].owned = true;
        }
      }
    }

    // Sort by owned awards first
    awards.sort(function (x, y) {
      // true values first
      return x.owned === y.owned ? 0 : x.owned ? -1 : 1;
    });
    data.value = awards;
    dataLoaded.value = true;
  } catch (error) {
    console.warn(error.message);
  }
});
</script>
