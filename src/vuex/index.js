/* eslint-disable no-param-reassign */
/**
 * Copyright (c) 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

/**
 * The VUEX store containing all the data this application uses.
 */
import Vuex from 'vuex';

import { getHomePageData, getImageGridPageData } from '../scripts/services';

export default Vuex.createStore({
  // wrap state in a function so that it does not leak into other server runs
  state() {
    return {
      homePageData: {},
      imageGridPageData: {},
    };
  },

  actions: {
    // get the data for the home page
    fetchHomePageData({ commit }) {
      return getHomePageData()
        .then((data) => {
          commit('setHomePageData', data);
        });
    },

    // get the data for the Image Grid Page
    fetchImageGridPageData({ commit }, categoryId) {
      return getImageGridPageData(categoryId)
        .then((data) => {
          commit('setImageGridPageData', data);
        });
    },
  },

  // mutations have to be synchronous.
  mutations: {
    setHomePageData(state, data) {
      state.homePageData = data;
    },

    setImageGridPageData(state, data) {
      state.imageGridPageData = data;
    },
  },

});
