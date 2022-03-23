import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ViewAward from "../views/ViewAward.vue";
import Redeem from "../views/Redeem.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/award/:awardId",
      name: "View-Award",
      component: ViewAward,
    },
    {
      path: "/redeem",
      name: "Redeem",
      component: Redeem,
    },
  ],
});

export default router;
