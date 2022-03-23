<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!-- App MSG -->
    <div
      v-if="statusMsg || errorMsg"
      class="mb-10 p-4 rounded-md bg-light-grey"
    >
      <p class="text-nits-green">{{ statusMsg }}</p>

      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <div v-if="dataLoaded">
      <!-- General info -->
      <div
        class="flex flex-col items-center p-8 rounded-md shadow-md bg-light-grey relative"
      >
        <div v-if="user" class="flex absolute left-2 top-2 gap-x-2">
          <div
            v-if="data.owned"
            class="h-10 w-10 rounded-full flex justify-center items-center shadow-lg"
          >
            <img class="h-10 w-auto" src="@/assets/images/tick.svg" alt />
          </div>
        </div>

        <img
          v-if="data.owned"
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
          v-if="data.owned"
          class="mt-6 py-1 5 px-5 text-xs text-white bg-nits-green rounded-lg shadow-md"
          >{{ data.type }}</span
        >
        <span
          v-else
          class="mt-6 py-1 5 px-5 text-xs text-white bg-dark-grey rounded-lg shadow-md"
          >{{ data.type }}</span
        >

        <div class="w-full mt-6">
          <h1 v-if="data.owned" class="text-nits-green text-2xl text-center">
            {{ data.title }}
          </h1>

          <h1 v-else class="text-dark-grey text-2xl text-center">
            {{ data.title }}
          </h1>
        </div>

        <div class="w-full mt-6">
          <p class="text-black text-lg text-center">{{ data.description }}</p>
        </div>
      </div>

      <h1 class="text-nits-green text-2xl text-center mt-8 mb-2">
        Qui té aquest premi
      </h1>

      <div
        class="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          class="flex flex-col items-center bg-nits-green shadow-md rounded-md cursor-pointer"
          v-for="(user, index) in data.users"
          :key="index"
        >
          <p class="mt-2 mb-2 text-center text-xl text-nits-green-500">
            {{ user }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { supabase } from "../supabase";
import { useRoute } from "vue-router";

import store from "../stores/index";

// Create data / vars
const data = ref(null);
const dataLoaded = ref(null);
const errorMsg = ref(null);
const statusMsg = ref(null);
const route = useRoute();
const user = computed(() => store.state.user);

// Get current Id of route
const currentId = route.params.awardId;

const getData = async () => {
  try {
    const { data: awards, error } = await supabase
      .from("awards")
      .select("*")
      .eq("id", currentId);
    data.value = awards[0];

    if (error) throw error;

    if (user.value) {
      // We check if the user has this award
      let profile = [];
      for (let usr in data.value.users) {
        profile = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.value.users[usr]);

        // If the user has the award, userHasAward will be true.
        if (data.value.users[usr] === user.value.id) {
          data.value.owned = true;
        }
        data.value.users[usr] = profile.data[0].username;
      }
    } else {
      let profile = [];
      for (let usr in data.value.users) {
        profile = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.value.users[usr]);
        data.value.users[usr] = profile.data[0].username;
      }
      data.value.owned = false;
    }

    dataLoaded.value = true;
  } catch (error) {
    errorMsg.value = error.message;
    setTimeout(() => {
      errorMsg.value = false;
    }, 4000);
  }
};

getData();

// Get workout data

// Delete workout

// Edit mode

// Add exercise

// Delete exercise

// Update Workout
</script>
