<!--
  Copyright (c) 2021 Oracle and/or its affiliates.
  Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
-->

<!--
  This component displays the assets belonging to a category in a grid view.
  Upon clicking an image, it allows display of the images in a slideshow.

  Data passed into this component:
  - categoryId : the id of the category whose items are to be displayed
  - categoryName : the name of the category whose items are to be displayed
-->

<template>
  <div>
    <!-- Display spinner whilst data is loading (client side rendering only) -->
    <div v-if="loading">
      <div class="progress-spinner" />
    </div>

    <div v-else>
      <div>
        <div class="back" v-on:click="handleBack">
          <img :src=backImage alt="Navigate back to Home"/>
          <span>Home</span>
        </div>
        <h1 class="heading">{{categoryName}}</h1>
        <h2 class="subheading">{{totalResults}} photos</h2>
      </div>

      <!-- Display a message if there are no images -->
      <div
        v-if="!loading && (!items || items.length == 0)"
        class="message">
        There are no images in this category.
      </div>

      <div v-else
        class="grid"
        transition-duration="0.3s"
        item-selector=".grid-item">
        <div
          class="grid-item fade"
          v-for="(item, i) in items"
          v-bind:key="i">
            <picture v-if="item.renditionUrls">
              <source
                type="image/webp"
                :srcset="item.renditionUrls.srcset"
                sizes="(min-width: 480px) 200px, 150px" />
              <source
                :srcset="item.renditionUrls.jpgSrcset"
                sizes="(min-width: 480px) 200px, 150px" />
              <img
                :src="item.renditionUrls.small"
                loading="lazy"
                :data-key=i
                v-on:click="handleClick"
                alt="Small Preview"
                :width="item.renditionUrls.width"
                :height="item.renditionUrls.height"/>
            </picture>
        </div>
      </div>

      <!-- the selected image overlay section (only displayed if the "currentImage"
           variable is set to an id > -1. -->
      <div class="page-container" v-if="currentImage > -1" >
        <section class="slideshow-container">
          <div ref="slides" class="mySlides fade">
            <div class="imgdiv">
              <picture>
                <source
                  type="image/webp"
                  :srcset="items[currentImage].renditionUrls.srcset"
                  sizes="90vh" />
                <source
                  :srcset="items[currentImage].renditionUrls.jpgSrcset"
                  sizes="90vh" />
                <img
                  :src="items[currentImage].renditionUrls.large"
                  sizes="90vh"
                  loading="lazy"
                  alt="Large preview"
                  :width="items[currentImage].renditionUrls.width"
                  :height="items[currentImage].renditionUrls.height"/>
              </picture>
              <div class="numbertext">{{currentImage+1}} / {{totalResults}}</div>
            </div>
          </div>
        </section>

        <a :class=prevClassName v-on:click="handlePrevNextClick(false)">&#10094;</a>
        <a :class=nextClassName v-on:click="handlePrevNextClick(true)">&#10095;</a>
        <a class="close" v-on:click="handleCloseClick">X</a>
      </div>
    </div>
  </div>
</template>

<script>
import back from '../assets/back.png';

export default {
  name: 'ImageGridPage',

  data() {
    return {
      isServer: typeof window === 'undefined',
      // data passed in on the URL
      categoryId: String,
      categoryName: String,
      // misc data
      backImage: back,
      // full preview variables
      currentImage: -1, // the index of the image currently being rendered
      prevClassName: 'prev hidden',
      nextClassName: 'next',
      containerId: 0,
      // client side rendering only
      loading: false,
      imgsArr: [],
    };
  },

  created() {
    this.categoryId = this.$route.params.categoryId;
    this.categoryName = this.$route.query.categoryName;
  },

  computed: {
    items() {
      return this.$store.state.imageGridPageData.items;
    },
    totalResults() {
      return this.$store.state.imageGridPageData.totalResults;
    },
  },

  // Server-side only: called by server renderer automatically
  serverPrefetch() {
    return this.fetchData();
  },

  // Client-side only : if this component doesn't already have its data, load it
  mounted() {
    document.title = this.categoryName;

    // add keydown event listener to support using keyboard to navigate through large previews
    document.addEventListener('keydown', this.handleKeypressFunction, false);

    // if there is no data, client side navigation has occurred,
    // mark loading to true so a spinner is displayed, get the data, when data is obtained set
    // loading to false to hide the spinner, the computed variables will be updated resulting
    // in the UI updating
    if (this.$store.state.imageGridPageData.categoryId !== this.categoryId
        || !this.items || !this.totalResults) {
      this.loading = true;
      this.fetchData()
        .then(() => {
          this.loading = false;
        });
    }
  },

  // Unregister the keydown event listener
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeypressFunction, false);
  },

  methods: {
    fetchData() {
      // return the Promise from the action
      return this.$store.dispatch('fetchImageGridPageData', this.categoryId);
    },

    // gets the small rendition URL for the item, used in the grid list
    getSmallPreviewUrl(item) {
      const url = item.renditionUrls.Small;
      return url;
    },

    // Handle click on the grid item. Sets the current image on the state.
    handleClick(event) {
      const imageClicked = event.target.getAttribute('data-key');
      if (!imageClicked) {
        // check for null image. This may be null when you click on empty white space
        return;
      }
      this.currentImage = parseInt(imageClicked, 10);
      this.updateNextPrevButtonVisibility();
    },

    // Handle Keypress events. If the left arrow or right arrow key is pressed, adjust the slideshow
    // accordingly. If esc is pressed, exit slideshow mode.
    handleKeypressFunction(e) {
      if (this.currentImage === -1) return;
      if (e.keyCode === 37) { // left arrow
        this.handlePrevNextClick(false);
      } else if (e.keyCode === 39) { // right arrow
        this.handlePrevNextClick(true);
      } else if (e.keyCode === 27) { // esc key
        this.handleCloseClick(e);
      }
    },

    // Handle clicks on the prev/next buttons. If its on the first item or last item, don't
    // do anything on the prev or next respectively
    handlePrevNextClick(increment) {
      if ((this.currentImage === 0 && !increment)
           || (this.currentImage === this.totalResults - 1 && increment)) {
        // if we are on the first going to previous, or last going to next
        // then do not do anything
        return;
      }
      this.currentImage = increment ? this.currentImage + 1 : this.currentImage - 1;
      this.updateNextPrevButtonVisibility();
    },

    // Updates the visibility of the next and previous icons
    updateNextPrevButtonVisibility() {
      const hidePrev = this.currentImage === 0;
      const hideNext = this.currentImage === this.totalResults - 1;
      this.prevClassName = `prev${hidePrev ? ' hidden' : ''}`;
      this.nextClassName = `next${hideNext ? ' hidden' : ''}`;
    },

    // Handle click on the close button of the slideshow.
    handleCloseClick() {
      this.currentImage = -1;
    },

    // Handle back button click to the main page
    handleBack(e) {
      e.preventDefault();
      window.history.back();
    },
  },
};
</script>
