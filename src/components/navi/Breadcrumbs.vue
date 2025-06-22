<template>
    <UBreadcrumb
      active
      :links="breadcrumbLinks"
      divider="/"
      :ui="{
          root: 'flex items-center gap-x-0',
          link: 'flex items-center gap-x-0 text-xs min-w-0 text-primary',
      }"
      active-color="text-secondary"
      variant="text-primary"
      active-variant="text-secondary"
      class="display-block w-fit float-right mt-1 p-2 pr-2 text-xs"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router"; 

const route = useRoute();

const breadcrumbLinks = computed(() => {
  const links = [{ label: "HOME", to: "/" }];
  const pathSegments = route.path.split("/").filter(Boolean); // Trim spaces

  pathSegments.forEach((segment, index) => {
    links.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      to: "/" + pathSegments.slice(0, index + 1).join("/"),
    });
  });

  return links;
});
</script>
