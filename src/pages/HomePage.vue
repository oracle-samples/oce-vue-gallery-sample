<!--
  Copyright (c) 2021 Oracle and/or its affiliates.
  Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
-->

<!-- Component for the Home Page. -->

<template>
  <div>
    <h1 class="heading">Image Gallery</h1>

    <!-- Display spinner whilst data is loading (client side rendering only) -->
    <div v-if="loading">
      <div class="progress-spinner" />
    </div>

    <div v-else class="gallerycontainer">
      <div v-for="(category, i) in categories" v-bind:key="i">
        <Gallery
          :i="i"
          :category="category"/>
      </div>
    </div>

  </div>
</template>

<script>

import Gallery from '../components/Gallery.vue';

export default {
  name: 'HomePage',

  components: {
    Gallery,
  },

  data() {
    return {
      // client side rendering only
      loading: false,
    };
  },

  // computed properties will watch for any changes in the data within it,
  // when it changes it will update itself based on some function
  computed: {
    categories() {
      return this.$store.state.homePageData.categories;
    },
  },

  // Server-side only: called by server renderer automatically
  serverPrefetch() {
    return this.fetchData();
  },

  // Client-side only : if this component doesn't already have its data, load it
  mounted() {
    document.title = 'Image Gallery';

    // if there is no data, client side navigation has occurred,
    // mark loading to true so a spinner is displayed, get the data, when data is obtained set
    // loading to false to hide the spinner, the computed variables will be updated resulting
    // in the UI updating

    if (!this.categories) {
      this.loading = true;
      this.fetchData()
        .then(() => {
          this.loading = false;
        });
    }
  },

  methods: {
    fetchData() {
      // return the Promise from the action
      return this.$store.dispatch('fetchHomePageData');
    },
  },
};
</script>
