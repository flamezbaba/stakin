<template>
  <div class="flex flex-col">
    <div class="flex flex-row sm:gap-4 bg-white shadow-sm py-3">
      <div class="flex-1 ml-5">
        <p class="text-lg sm:text-sm font-medium sm:font-thin">
          Stakin Delegations
        </p>
      </div>
      <div class="mx-5">
        <button
          class="my-round-btn bg-red-600 text-sm text-white items-end"
          @click="disconnect_wallet"
          v-if="walletAddress"
        >
          Disconnect SolFare
        </button>
        <button
          class="my-round-btn bg-blue-900 text-sm text-white items-end"
          @click="connect_wallet"
          v-else
        >
          Connect SolFare Wallet
        </button>
      </div>
    </div>
    <div
      class="
        flex flex-col
        h-278
        bg-gradient-to-r
        from-green-400
        via-green-500
        to-green-700
      "
    >
      <div class="m-16 sm:m-10 items-center justify-start">
        <template v-if="walletAddress">
          <p class="text-white">Solana (SOL)</p>
          <p class="text-white break-words text-lg sm:text-sm">
            {{ walletAddress ?? "" }}
          </p>
        </template>
        <template v-else>
          <p class="text-white text-4xl sm:text-3xl">Connect To a Wallet</p>
        </template>
        <p>
          <router-link
            :to="{ name: 'Dashboard' }"
            class="underline text-gray-100"
          >
            Switch Network
          </router-link>
        </p><p>
          <router-link
            :to="{ name: 'Login' }"
            class="underline text-gray-100"
          >
            Log Out
          </router-link>
        </p>

      </div>
    </div>
    <div class="flex flex-col h-auto items-center mx-20 sm:mx-5">
      <div class="bg-white w-full -m-16 rounded-xl shadow-xl">
        <header
          class="
            flex
            justify-between
            items-center
            mb-2
            pt-4
            pb-5
            px-3
            md:px-4
            border-b
          "
        >
          <h2
            class="uppercase font-display text-xss font-semibold text-gray-800"
          >
            Staking Overview
          </h2>
        </header>
        <div class="grid grid-flow-row grid-cols-3 sm:grid-cols-1">
          <div class="p-5">
            <p class="text-sm text-gray-700 uppercase">Your Stake</p>
            <p class="font-bold text-xl">
              {{ Number(parseFloat(yourStack).toFixed(6)).toLocaleString() }}
              SOL
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
    
    <script>
import axios from "axios";
import Wallet from "@project-serum/sol-wallet-adapter";
let providerUrl = "https://solflare.com/provider";
let wallet = new Wallet(providerUrl);

export default {
  name: "Polygon",
  components: {},
  data() {
    return {
      yourStack: 0,
      walletAddress: null,
    };
  },
  mounted() {
    this.init_load();
  },
  created() {},
  methods: {
    async init_load() {
      // check if solflare is installed
      if (window.solflare && window.solflare.isSolflare) {
        if (window.solflare.publicKey) {
          this.walletAddress = window.solflare.publicKey.toString();
          await this.get_stake();
        } else {
          this.$swal({
            icon: "error",
            text: "Connect to Solfare Wallet",
          });
        }
      } else {
        // use wallet method
        if (wallet.publicKey) {
          this.walletAddress = wallet.publicKey.toBase58();
          await this.get_stake();
        } else {
          this.$swal({
            icon: "error",
            text: "Connect to Solana Wallet",
          });
        }
      }
    },
    async connect_wallet() {
      try {
        if (window.solflare && window.solflare.isSolflare) {
          var rr = await window.solflare.connect();
          if (rr) {
            this.walletAddress = window.solflare.publicKey.toString();
            await this.get_stake();
          } else {
            this.walletAddress = null;
          }
        } else {
          await wallet.connect();
          this.walletAddress = wallet.publicKey.toString();
          await this.get_stake();
        }
      } catch (err) {
        this.$swal({
          icon: "error",
          text: err,
        });
      }
    },
    async disconnect_wallet() {
      try {
        if (window.solflare && window.solflare.isSolflare) {
          await window.solflare.disconnect();
        }

        this.walletAddress = null;
        this.yourStack = 0;
      } catch (err) {
        this.$swal({
          icon: "error",
          text: err,
        });
      }
    },
    async get_stake() {
      let loader = this.$loading.show();

      try {
        if (this.walletAddress) {
          this.walletAddress = "DrFkftQ9PMW2Tk7axt9evVynY8XSAoFJxPeHiSoffZ9S";
          var response = await axios.get(
            `https://public-api.solscan.io/account/${this.walletAddress}`
          );
          if (response.data.stakeInfo) {
            var theStake = response.data.stakeInfo.delegated.delegatedStake;
            this.yourStack = parseFloat(theStake / 1000000000);
          }
        }
        loader.hide();
      } catch (err) {
        loader.hide();
        this.$swal({
          icon: "error",
          text: err,
        });
      }
    },
  },
};
</script>
      