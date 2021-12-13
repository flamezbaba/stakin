<template>
  <div
    class="
      min-h-screen
      flex flex-col
      items-center
      overflow-auto
      bg-gray-900
      py-12
    "
  >
    <!-- Main content -->
    <section
      class="
        rounded-t-lg rounded-br-lg
        bg-white
        p-8
        pb-10
        sm:p-10 sm:pb-12
        w-11/15
        max-w-md
      "
    >
      <header class="mb-6 sm:mb-8 flex flex-col items-center">
        <h1
          class="
            text-xl
            md:text-2xl
            text-primary
            font-bold font-display
            text-center
          "
        >
          Delegations Platform
        </h1>
        <p class="text-sm font-body text-gray-700 text-center">Login</p>
      </header>
      <div class="flex flex-col mb-4 relative">
        <label
          class="
            text-xs
            leading-loose
            mb-1
            text-gray-700
            font-bold font-display
          "
          >Email</label
        ><input
          class="
            py-3
            pr-2
            md:py-4 md:pr-4
            rounded-xs
            bg-gray-200
            text-gray-900
            outline-none
            pl-3
            md:pl-4
          "
          v-model="email"
          type="text"
        />
      </div>

      <div class="flex flex-col mb-4 relative">
        <label
          class="
            text-xs
            leading-loose
            mb-1
            text-gray-700
            font-bold font-display
          "
          >Password</label
        ><input
          class="
            py-3
            pr-2
            md:py-4 md:pr-4
            rounded-xs
            bg-gray-200
            text-gray-900
            outline-none
            pl-3
            md:pl-4
          "
          v-model="password"
          type="password"
        />

        <router-link :to="{ name: 'Register' }">Register Here</router-link>
      </div>

      <div class="flex flex-col mb-1 relative">
        <button class="bg-red-400 p-3 text-white" @click="login">Login</button>
      </div>
    </section>
    <!-- /.content -->
  </div>
</template>
  
  <script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      email: null,
      password: null,
    };
  },
  created() {
    this.logOut();
  },
  methods: {
    async logOut() {
      try {
        await firebase.auth().signOut();
        console.log("logout done");
        // signed out
      } catch (e) {
        // an error
        console.log("cant logout");
      }
    },
    async login() {
      if (this.email == null || this.email == "") {
        this.$swal({
          icon: "error",
          text: `Email is empty`,
        });
        return;
      }

      if (this.password == null || this.password == "") {
        this.$swal({
          icon: "error",
          text: `Password is empty`,
        });
        return;
      }

      let loader = this.$loading.show();

      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);

        this.$router.push({ name: "Dashboard" });
        loader.hide();
      } catch (error) {
        loader.hide();
        this.$swal({
          icon: "error",
          text: `Login Failed`,
        });
        console.log(error.message);
      }
    },
  },
};
</script>
    