<script setup lang="ts">
import Navigation from "./components/Navigation.vue";
import { ref } from "vue";
import { RouterView } from "vue-router";
import { sdk } from "./appwrite";
import store from "./stores/index";

// Create data / vars
const appReady = ref<boolean>(false);
const user = ref<any | null>(null);

// Check to see if user is already logged in
let promise = sdk.account.get();
promise.then(
  function (response) {
    user.value = response;
    store.methods.setUser(user.value);
  },
  function (error) {
    user.value = null;
  }
);

// If user does not exist, need to make app ready
if (!user.value) {
  appReady.value = true;
}

// Runs when there is a auth state change
// if user is logged in, this will fire
/*
supabase.auth.onAuthStateChange((_, session) => {
  store.methods.setUser(session);
  appReady.value = true;
});
*/
</script>

<template>
  <div v-if="appReady" class="min-h-full font:Poppins box-border">
    <Navigation />
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap");
</style>
