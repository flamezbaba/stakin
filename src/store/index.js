import { createStore } from "vuex";
import firebase from "firebase/app";
import "firebase/auth";
import createPersistedState from "vuex-persistedstate";
import Web3 from "web3";
import myUtils from "@/utils/my.js";

export default createStore({
  state: {
    userId: null,
    walletAddress: null,
    walletBalance: null,
    networkId: null,
    networkName: null,
    currentWalletProvider: null,
    networkCurrency: null
  },
  getters: {},
  mutations: {
    setUserID: (state, _id) => {
      state.userId = _id;
    },
    setWalletAddress: (state, payload) => {
      state.walletAddress = payload;
    },
    setWalletBalance: (state, payload) => {
      state.walletBalance = payload;
    },
    setNetworkID: (state, payload) => {
      state.networkId = payload;
    },
    setNetworkName: (state, payload) => {
      state.networkName = payload;
    },
    setCurrentProvider: (state, payload) => {
      state.currentWalletProvider = payload;
    },
    setNetworkCurrency: (state, payload) => {
      state.networkCurrency = payload;
    },
  },
  actions: {
    async UPDATE_USER_ID({ commit }) {
      commit("setUserID", firebase.auth().currentUser.uid);
    },
    async GET_CURRENT_WALLET({ commit }) {
      var web3js = window.web3;
      if (typeof web3js !== "undefined") {
        var web3 = new Web3(window.ethereum);
        try {  
          const { ethereum } = window;
          var a = await ethereum.enable();
          var addr = web3.utils.toChecksumAddress(a[0]);
          commit("UPDATE_WALLET_ADDRESS",addr);

          web3.eth.getBalance(addr).then((r) => {
            commit("UPDATE_WALLET_BALANCE",web3.utils.fromWei(r, "ether"));
          });

          commit("UPDATE_NETWORK_ID", await web3.eth.net.getId());
          commit("UPDATE_NETWORK_NAME", myUtils.network(await web3.eth.net.getId()));
          commit("UPDATE_CURRENT_PROVIDER", myUtils.getCurrentProvider());
          
        } catch (error) {
          commit("UPDATE_WALLET_ADDRESS", null);
          commit("UPDATE_WALLET_BALANCE", null);
          commit("UPDATE_NETWORK_ID", null);
          commit("UPDATE_NETWORK_NAME", null);
          commit("UPDATE_CURRENT_PROVIDER", null);
        }
      } else {
        commit("UPDATE_WALLET_ADDRESS", null);
        commit("UPDATE_WALLET_BALANCE", null);
        commit("UPDATE_NETWORK_ID", null);
        commit("UPDATE_NETWORK_NAME", null);
        commit("UPDATE_CURRENT_PROVIDER", null);
      }
    },
    async CONNECT_WALLET({ commit }) {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);

        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          var addr = web3.utils.toChecksumAddress(accounts[0]);          
          commit("setWalletAddress", addr);

          // get balance
          web3.eth.getBalance(addr).then((r) => {
            commit("setWalletBalance",web3.utils.fromWei(r, "ether"));
          });

          var nid =  await web3.eth.net.getId();

          commit("setNetworkID", nid);
          commit("setNetworkName", myUtils.network(nid));
          commit("setCurrentProvider", myUtils.getCurrentProvider());
          commit("setNetworkCurrency", myUtils.currency(nid));

        } catch (error) {
          if (error.code === 4001) {
            throw "Please connect a wallet.";
          } else {
            throw error.message;
          }
        }
      } else {
        throw "Unable to connect a wallet";
      }
    },
    async DISCONNECT_WALLET({ commit }) {
      commit("setWalletAddress", null);
      commit("setWalletBalance", null);
      commit("setNetworkID", null);
      commit("setNetworkName", null);
      commit("setCurrentProvider", null);
      commit("setNetworkCurrency", null);
    },
    async LOGOUT({ commit }) {
      commit("UPDATE_USER_ID", null);
      await this.DISCONNECT_WALLET();
    },
  },
  plugins: [createPersistedState()],
});
