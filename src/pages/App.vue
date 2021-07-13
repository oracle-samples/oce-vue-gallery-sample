<!--
  Copyright (c) 2021 Oracle and/or its affiliates.
  Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
-->

<!-- Main starting page for the Vue application
     The router will replace the "router-view" component with the required component
     The div with the id of "app" is needed for client side hydration.
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
};
</script>
