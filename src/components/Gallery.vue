<!--
  Copyright (c) 2021 Oracle and/or its affiliates.
  Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
-->

<!--
  This component renders the gallery for each category and also displays the
  name of the category and the number of items belonging to the category.
  This component is called from the HomePage component. It fetches at max 4
  items for each category and then for each item, it retrieves the thumbnail.
  Once all the thumbnails are retrieved, it calls the GalleryItem component
  for each thumbnail to render it.

  Data passed into this component:
   - category : the category of the items to display
-->
<template>
  <section>

    <router-link
      :to="{ name: 'ImageGrid',
      params: {categoryId: category.id},
      query: {categoryName: category.name} }">

      <!-- Images for the category -->
      <div class="gallery">
        <div class="item fade" v-for="(item, i) in category.items" v-bind:key="i">
          <picture v-if="item.renditionUrls">
            <source
              type="image/webp"
              :srcset="item.renditionUrls.srcset"
              :sizes="i == 0 ? '230px' : '75px'" />
            <source
              :srcset="item.renditionUrls.jpgSrcset"
              :sizes="i == 0 ? '230px' : '75px'" />
            <img
              :src="item.renditionUrls.small"
              class="cover"
              loading="lazy"
              :alt="item.name"
              width="item.renditionUrls.width" height="item.renditionUrls.height"/>
          </picture>
        </div>
      </div>

      <!-- Category Name and total number of items in that category -->
      <div class="caption">
        <h2>{{category.name}}</h2>
        <h3>{{category.totalResults}} photos</h3>
      </div>

    </router-link>

  </section>
</template>

<script>

export default {
  name: 'Gallery',

  components: {
  },

  props: {
    i: Number,
    category: Object,
  },
};

</script>
