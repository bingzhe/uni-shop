import { loginApi, userInfoApi, logoutApi } from "@/api/userApi.js";

import { ACCESS_TOKEN, USER_INFO } from "@/store/mutation-types";

const user = {
  state: {
    token: "",
    roles: [],
    info: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_INFO: (state, info) => {
      state.info = info;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginApi(userInfo)
          .then((response) => {
            let result = response.data.data;
            uni.setStorageSync("token", result.token);
            // uni.setStorageSync('userInfo', result.user)
            commit("SET_TOKEN", result.token);
            // commit('SET_INFO', result.user)
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        userInfoApi()
          .then((response) => {
            let result = response.data.data;
            uni.setStorageSync("userInfo", result);
            commit("SET_INFO", result);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        logoutApi(state.token)
          .then(() => {
            resolve();
          })
          .catch(() => {
            resolve();
          })
          .finally(() => {
            commit("SET_TOKEN", "");
            commit("SET_ROLES", []);
          });
      });
    },
  },
};

export default user;
