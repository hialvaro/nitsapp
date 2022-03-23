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
    <form @submit.prevent="redeem" class="p-8 flex flex-col bg-light-grey rounded-md shadow-lg">
      <h1 class="text-3xl text-nits-green mb-4">Reclama un premi</h1>

      <div class="flex flex-col mb-2">
        <label for="code" class="mb-1 text-sm text-nits-green">Codi</label>
        <input type="text" 
               required 
               class="p-2 text-grey-500 focus:outline-none rounded-md" 
               id="code" 
               v-model="code"
        />
      </div>

      <button class="mt-6 py-2 px-6 rounded-md self-start text-sm
      text-white bg-nits-green duration-200 border-solid
      border-2 border-transparent hover:border-nits-green hover:bg-white
      hover:text-nits-green" type="submit">Reclama!</button>
    </form>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { supabase } from "../supabase/init";
import { useRouter } from "vue-router";
import store from '../store/index'

export default {
  name: "Redeem",
  setup() {
    // Create data / vars
    const router = useRouter();
    const code = ref(null);
    const errorMsg = ref(null);
    const successMsg = ref(null);
    const user = computed(() => store.state.user);

    if(!user.value) router.push({name: 'Home'});

    // Login function
    const redeem = async () => {
      try{
        const {data: award, error} = await supabase.from('awards').select('*').eq('code', code.value);
        
        // Check if code is linked to an award
        if(award.length == 0){
          errorMsg.value = `Error: El codi que has entrat no existeix`;
          setTimeout(() => {errorMsg.value = null}, 6000);
        }
        else {
          // Check if the award can still be given
          console.log(award[0]);
          if(!award[0].users) award[0].users = [];
          if(award[0].howmany > award[0].users.length){
            // Add user to award owners list
            if(award[0].users.includes(user.value.id)) {
              errorMsg.value = `Error: Ja tens aquest premi.`;
              setTimeout(() => {errorMsg.value = null}, 6000);
            }
            else{
              award[0].users.push(user.value.id);

              // Update the database
              const { error } = await supabase
              .from('awards')
              .update({ users:  award[0].users})
              .eq('id', award[0].id)

              if(error) throw error;

              // Inform the user
              successMsg.value = `Has rebut un nou premi: ${award[0].title}`;
              setTimeout(() => {successMsg.value = null}, 6000);
              router.push({name: 'Home'});
            }
          }
          else{
            errorMsg.value = `Massa tard! Aquest premi s'ha exhaurit.`;
            setTimeout(() => {errorMsg.value = null}, 6000);
          }
        }
        if (error) throw error;
      }
      catch (error){
        errorMsg.value = `Error: ${error.message}`;
        setTimeout(() => {errorMsg.value = null}, 4000);
      }
    };

    return {errorMsg, successMsg, code, redeem};
  },
};
</script>
