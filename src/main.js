import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import "firebase/auth";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import VueLoading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

let app;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.config.productionTip = true;

    app
      .use(store)
      .use(router)
      .use(VueSweetalert2)
      .use(VueLoading)
      .mount("#app");
  }
});
