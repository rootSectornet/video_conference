<script>
import appConfig from "@/app.config";
require('vue-image-lightbox/dist/vue-image-lightbox.min.css')
export default {
  name: "app",
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === "function" ? title(this.$store) : title;
      return title ? `${title} | ${appConfig.title}` : appConfig.title;
    }
  }
};
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>
