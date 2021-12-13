import { createRouter, createWebHistory } from 'vue-router'

import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import Polygon from "@/views/Polygon.vue";
import Solana from "@/views/Solana.vue";

import firebase from "firebase/app";
import "firebase/auth";

function authGuard(to, from, next){
  if(firebase.auth().currentUser){
    next();
  }
  else{
    console.log("Not Logged In");
    next('/');
  }
}

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, beforeEnter: authGuard },
  { path: '/polygon', name: 'Polygon', component: Polygon, beforeEnter: authGuard },
  { path: '/solana', name: 'Solana', component: Solana, beforeEnter: authGuard },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: Login },
  { path: '/:pathMatch(.*)', name: 'bad-not-found', component: Login },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  mode: 'history',
  routes
})

export default router
