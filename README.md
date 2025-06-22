![Logo](./src/assets/images/logo.png)

# @annebrown.ca/nuxt3-fleet-pub

![npm version](https://img.shields.io/npm/v/@annebrown.ca/nuxt3-fleet-pub.svg)
![npm downloads](https://img.shields.io/npm/dm/@annebrown.ca/nuxt3-fleet-pub.svg)
![License](https://img.shields.io/npm/l/@annebrown.ca/nuxt3-fleet-pub.svg)

## Description

Open-source, Nuxt V3 Component Library

## Components

`NaviTree` generates a customizable, hierarchical, interactive navi tree, from flat array of navi objects. `NaviTree` uses props for styling and initial expansion with depth control.

`SourceNaviTree` uses `NaviTree` as a helper to generate a navigation tree from a `@Nuxt/Content3` collection.  Collection contents require a `title` and `description` in markdown frontmatter.

`PagesNaviTree`  uses `NaviTree` as a helper to produce a navi tree for a Nuxt3 app's `@/pages` content.  Components under `pages/`, whose page meta include `title` and `description`, are used to build the tree.

`Breadcrumbs` - For Future Releases - Will return a breadcrumb string, based on current route.

## Install

```bash
pnpm add @annebrown.ca/nuxt3-fleet-pub
```

## Usage

`SourceNaviTree` and `PagesNaviTree`:

```vue
<template><div>

    <UApp>
        <NuxtLayout name="pages">

          <div class="flex p-4" >
              <div class="p-2 m-2">

                  <p><b>Collection: /docs</b></p>
                  <SourceNaviTree 
                      sourcePrefix="/docs"
                      :initialExpansionLevel="0"
                  />
                  <p><b>Collection: Second Source</b></p>
                  <SourceNaviTree 
                      sourcePrefix="/otherdocs"
                      :initialExpansionLevel="1"
                  />

                  <p><b>All Pages</b></p>
                  <PagesNaviTree
                      baseRoutePrefix="/"
                      :initialExpansionLevel="2"
                  />

                  <p><b>@/pages/admin</b></p>
                  <PagesNaviTree
                      baseRoutePrefix="/admin"
                      :initialExpansionLevel="999"
                  />
              </div>
              <div class="grow">
                  <NuxtPage />
              </div>
          </div>

        </NuxtLayout>
    </UApp>
    
</div></template>

<script setup lang="ts">
import { SourceNaviTree, PagesNaviTree } from '@annebrown.ca/nuxt3-fleet-pub'; 
</script>
```

`Breadcrumbs` usage:

For future releases.

```vue
<script setup lang="ts">
import { Breadcrumbs } from '@annebrown.ca/nuxt3-fleet-pub';
</script>

<template><div>
    <UApp>
        <Breadcrumbs />
    <UApp>
</div></template>
```

## License

[MIT](./LICENSE)

