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
          v-if="$store.state.walletAddress"
        >
          Disconnect Wallet
        </button>
        <button
          class="my-round-btn bg-blue-900 text-sm text-white items-end"
          @click="connect_wallet"
          v-else
        >
          Connect Wallet
        </button>
      </div>
    </div>
    <div
      class="
        flex flex-col
        h-278
        bg-gradient-to-r
        from-purple-600
        via-purple-700
        to-purple-900
      "
    >
      <div class="m-16 sm:m-10 items-center justify-start">
        <template v-if="$store.state.walletAddress">
          <p class="text-white">Polygon (Matic)</p>
          <p class="text-white text-3xl sm:text-2xl">
            {{
              $store.state.walletBalance
                ? parseFloat($store.state.walletBalance).toFixed(4)
                : ""
            }}

            {{ $store.state.networkCurrency ?? "" }}
          </p>
          <p class="text-white break-words text-lg sm:text-sm">
            {{ $store.state.walletAddress ?? "" }}
          </p>
        </template>
        <template v-else>
          <p class="text-white text-4xl sm:text-3xl">Connect To a Wallet</p>
        </template>
        <p>
          <router-link :to="{name: 'Dashboard'}" class="underline text-gray-100">
            Switch Network
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
          <div class="p-5 sm:border-b md:border-r lg:border-r">
            <p class="text-sm text-gray-700 uppercase">Stakin (1% Commision)</p>
            <p class="font-bold text-xl">
              {{
                Number(parseFloat(valTotalStack).toFixed(2)).toLocaleString()
              }}
              MATIC
            </p>
            <p class="text-sm text-gray-700">
              $
              {{
                Number(parseFloat(valTotalStackUsd).toFixed(3)).toLocaleString()
              }}
            </p>
          </div>
          <div class="p-5 sm:border-b md:border-r lg:border-r">
            <p class="text-sm text-gray-700 uppercase">Your Stake</p>
            <p class="font-bold text-xl">
              {{
                Number(parseFloat(yourStack).toFixed(2)).toLocaleString()
              }}
              MATIC
            </p>
            <p class="text-sm text-gray-700">
              $
              {{ Number(parseFloat(yourStackUsd).toFixed(3)).toLocaleString() }}
            </p>
          </div>
          <div class="p-5">
            <p class="text-sm text-gray-700 uppercase">Reward</p>
            <p class="font-bold text-xl">
              {{
                Number(parseFloat(yourReward).toFixed(2)).toLocaleString()
              }}
              MATIC
            </p>
            <p class="text-sm text-gray-700">
              $
              {{
                Number(parseFloat(yourRewardUsd).toFixed(3)).toLocaleString()
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
    
    <script>
import Web3 from "web3";
var web3 = new Web3();
import myUtils from "@/utils/my.js";

export default {
  name: "Polygon",
  components: {},
  data() {
    return {
      valTotalStack: 0,
      yourStack: 0,
      yourReward: 0,
      valTotalStackUsd: 0,
      yourStackUsd: 0,
      yourRewardUsd: 0,
    };
  },
  mounted() {
    this.init_load();
  },
  created() {},
  methods: {
    async init_load() {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", async (accounts) => {
          if (accounts.length > 0) {
            await this.$store.dispatch("CONNECT_WALLET");
          } else {
            await this.$store.dispatch("DISCONNECT_WALLET");
          }
        });
      } else {
        await this.$store.dispatch("DISCONNECT_WALLET");
      }

      const Web3HttpProvider = require("web3-providers-http");
      var web3obj = new Web3(new Web3HttpProvider("https://node1.web3api.com"));

      let loader = this.$loading.show();
      try {
        var myContractInstance = new web3obj.eth.Contract(
          myUtils.polygonContractAbi(),
          myUtils.polygonContractAddr()
        );

        // var walletAddress = this.$store.state.walletAddress;
        var walletAddress = "0x0640576050ce656d3e2eb6bbb104344a7431e352";

        // get info from smart contract
        var valTotalStack = await myContractInstance.methods
          .totalSupply()
          .call();
        var yourStack = await myContractInstance.methods
          .getTotalStake(walletAddress)
          .call();
        var yourReward = await myContractInstance.methods
          .getLiquidRewards(walletAddress)
          .call();

        // make conversions
        this.valTotalStack = web3.utils.fromWei(valTotalStack, "ether");
        this.yourStack = web3.utils.fromWei(yourStack[0], "ether");
        this.yourReward = web3.utils.fromWei(yourReward, "ether");

        // get USD Value
        this.valTotalStackUsd = await myUtils.convertMaticUsd(
          this.valTotalStack
        );
        this.yourStackUsd = await myUtils.convertMaticUsd(this.yourStack);
        this.yourRewardUsd = await myUtils.convertMaticUsd(this.yourReward);
      } catch (err) {
        console.log(err.message);
      }

      loader.hide();
    },
    async connect_wallet() {
      let loader = this.$loading.show();

      try {
        await this.$store.dispatch("CONNECT_WALLET");
        loader.hide();
      } catch (err) {
        loader.hide();
        this.$swal({
          icon: "error",
          text: err,
        });
      }
    },
    async disconnect_wallet() {
      let loader = this.$loading.show();

      try {
        await this.$store.dispatch("DISCONNECT_WALLET");
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
      