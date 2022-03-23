import type { Session, User } from "@supabase/supabase-js";
import { reactive } from "vue";

const state = reactive<{ user: User | null }>({
  user: null,
});

const methods = {
  setUser(session: Session | null) {
    state.user = session ? session.user : null;
  },
};

export default {
  state,
  methods,
};
