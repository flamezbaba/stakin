<template>
  <div
    class="
      flex flex-col
      min-h-screen
      bg-gray-900
      gap-8
      py-10
      px-20
      items-center
      justify-center
    "
  >
    <header>
      <p class="text-2xl sm:text-sm text-gray-200">Select Your Network</p>
    </header>
    <router-link
      :to="{ name: 'Polygon' }"
      class="
        flex
        w-96
        h-36
        sm:w-56 sm:h-20
        rounded-lg
        ring-4 ring-offset-2 ring-purple-600
        bg-purple-600
        hover:bg-purple-800
        items-center
        justify-center
        text-white
      "
    >
      <p class="text-l sm:text-sm">PolyGon (Matic)</p>
    </router-link>
    <router-link
      :to="{ name: 'Solana' }"
      class="
        flex
        w-96
        h-36
        sm:w-56 sm:h-20
        rounded-lg
        ring-4 ring-offset-2 ring-green-400
        bg-green-400
        hover:bg-green-600
        items-center
        justify-center
        text-white
      "
    >
      <p class="text-l sm:text-sm">Solana</p>
    </router-link>
    <p>
      <router-link :to="{ name: 'Login' }" class="underline text-gray-100">
        Log Out
      </router-link>
    </p>
  </div>
</template>
    
    <script>
export default {
  name: "Dashboard",
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>
      