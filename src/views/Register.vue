<template>
  <div class=" min-h-screen
      flex flex-col
      items-center
      overflow-auto
      bg-gray-900
      py-12">
    <!-- Main content -->
    <section
      class="
        rounded-t-lg rounded-br-lg
        bg-white
        p-8
        pb-10
        sm:p-10 sm:pb-12
        w-5/20
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
        <p class="text-sm font-body text-gray-700 text-center">
          Register Account
        </p>
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
        ><input class="my-input" type="text" v-model="email" />
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
        ><input class="my-input" type="password" v-model="password" />
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
          >Repeat Password</label
        ><input class="my-input" type="password" v-model="rpassword" />
      </div>

      <div class="flex flex-col mb-1 relative">
        <button class="my-red-btn" @click="register_user">Register</button>
      </div>

      <router-link class="mt-5" :to="{ name: 'Login' }"
        >Click Here To Login</router-link
      >
    </section>
    <!-- /.content -->
  </div>
</template>
  
<script>
import firebase from "firebase/app";
import "firebase/auth";
import db from "../firebase/firebaseinit";

export default {
  name: "Register",
  components: {},
  data() {
    return {
      email: null,
      password: null,
      rpassword: null,
    };
  },
  mounted() {
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
    async register_user() {
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

      if (this.rpassword == null || this.rpassword == "") {
        this.$swal({
          icon: "error",
          text: `Repeat Password is empty`,
        });
        return;
      }

      if (this.password != this.rpassword) {
        this.$swal({
          icon: "error",
          text: `Password Mismatch`,
        });
        return;
      }

      let loader = this.$loading.show();

      // check if email exist
      try {
        var dbref = db.collection("users");
        const snapshot = await dbref
          .where("email", "==", this.email)
          .get();

        if (snapshot.size > 0) {
          loader.hide();
          this.$swal({
            icon: "error",
            text: `Email Address (${this.email}) already used`,
          });
          return;
        }
      } catch (err) {
        loader.hide();
        this.$swal({
          icon: "error",
          text: `Server Error`,
        });
        return;
      }

      try {
        const firebaseAuth = await firebase.auth();
        const result = await firebaseAuth.createUserWithEmailAndPassword(
          this.email,
          this.password
        );
        const dataBase = await db.collection("users").doc(result.user.uid);
        dataBase.set({
          email: this.email,
          password: this.password,
        });

        await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);

        
        await this.$store.dispatch("UPDATE_USER_ID");
        loader.hide();
        this.$router.push({ name: "Dashboard" });
      } catch (err) {
        loader.hide();
        console.log(err.message);
         this.$swal({
          icon: "error",
          text: `Registration Failed`,
        });
      }
    },
  },
};
</script>
  