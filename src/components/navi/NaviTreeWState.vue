<!-- /@src/components/navi/NaviTree.vue -->
<template>
    <ul :class="[ulClasses, shouldIndentUl ? '!ml-4' : '']">
        <li 
            v-for="linkItem in displayedLinks" 
            :key="linkItem.to || linkItem.label" 
            :class="liClasses"
        >
            <div class="flex items-center space-x-2 mt-0 py-0">

                <span
                    v-if="linkItem.children && linkItem.children.length > 0"
                    @click="toggleCollapse(linkItem)"
                    class="flex-shrink-0 w-4 h-4 flex items-center justify-center cursor-pointer mr-1"
                >
                    <span
                        class="text-ui-text text-sm font-medium transition-transform duration-200"
                        :class="{ 'rotate-90': !isCollapsed(linkItem) }"
                    >
                        <!-- Expand/Collapse Icon -->
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" height="20" 
                            viewBox="0 0 24 24"
                        >
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5l7 7l-7 7"/>
                        </svg>
                    </span>

                </span>&nbsp;
                
                <a
                    :href="linkItem.to"
                    class="block text-sm font-medium py-0"
                    :class="{
                    'ml-6': isLeafNode(linkItem),
                    'flex-grow': linkItem.children && linkItem.children.length > 0,
                    'is-active': isActiveLink(linkItem)
                    }"
                >
                    {{ linkItem.label }}
                </a>
            </div>

            <nav 
                v-if="linkItem.children && linkItem.children.length > 0 && !isCollapsed(linkItem)"
                class="mt-0"
            >
                <NaviTree
                    :links="linkItem.children"
                    :ulClasses="props.ulChildrenClasses"
                    :liClasses="liClasses"
                    :depth="currentDepth + 1"
                    :initialExpansionLevel="initialExpansionLevel"
                    :ulChildrenClasses="props.ulChildrenClasses"
                    :sourceTreeId="props.sourceTreeId"
                />
            </nav>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, reactive } from 'vue'; // ADDED 'reactive'
import { useRoute } from 'vue-router';

interface NavigationLink {
    label: string;
    to?: string;
    children?: NavigationLink[];
    collapsible?: boolean;
}

const props = defineProps<{
    links: NavigationLink[];
    ulClasses?: string;
    liClasses?: string;
    ulChildrenClasses?: string;
    depth?: number;
    initialExpansionLevel?: number;
    sourceTreeId: string; 
}>();

const currentDepth = computed(() => props.depth ?? 0);
const route = useRoute();

const displayedLinks = computed(() => {
    if (currentDepth.value === 0 && props.links.length === 1 && props.links[0].children) {
        return props.links[0].children;
    }
    return props.links;
});

const shouldIndentUl = computed(() => {
    return currentDepth.value > 0;
});

// REMOVED: const collapsedState = ref<{ [key: string]: boolean }>({});
// ADDED: Use global state instead of local ref
const treeCollapsedState = useNaviTreeState(props.sourceTreeId);

const isLeafNode = (link: NavigationLink): boolean => {
    return !link.children || link.children.length === 0;
};

const initializeCollapseState = (linksToProcess: NavigationLink[], level: number) => {
    linksToProcess.forEach(link => {
        if (link.children && link.children.length > 0 && link.to) {
            // Check and set state in the reactive object from the global store
            if (!(link.to in treeCollapsedState)) {
                const shouldBeExpanded = props.initialExpansionLevel !== undefined && level < props.initialExpansionLevel;
                treeCollapsedState[link.to] = !shouldBeExpanded;
            }
            initializeCollapseState(link.children, level + 1); // Recurse for children
        }
    });
};

onMounted(() => {
  // Only initialize if this is the top-level call for this tree (depth 0)
  // and the state for this treeId is currently empty in the global store.
  // This prevents re-initialization and wiping existing state on subsequent route changes.
    if (currentDepth.value === 0 && Object.keys(treeCollapsedState).length === 0) {
        initializeCollapseState(displayedLinks.value, currentDepth.value);
    } else if (currentDepth.value > 0) {
        // For recursive calls (nested NaviTree), ensure their state is initialized if not already
        // This handles deep links opening correctly
        initializeCollapseState(displayedLinks.value, currentDepth.value);
    }
});

watch(
  () => props.links,
  newLinks => {
    // If the underlying 'links' data changes, we might need to re-initialize or adjust state.
    // Check if any of the new links don't have a state entry; if so, re-initialize this tree's state.
    const needsReinitialization = newLinks.some(link => link.to && !(link.to in treeCollapsedState));
    if (needsReinitialization) {
        // Clear current state for this specific tree, then reinitialize
        for (const key in treeCollapsedState) {
            delete treeCollapsedState[key];
        }
        initializeCollapseState(displayedLinks.value, currentDepth.value);
    }
  },
  { deep: true } // Deep watch to detect changes within nested link structures
);

watch(
  () => props.initialExpansionLevel,
  () => {
    // If initialExpansionLevel changes, clear and re-initialize state for this tree
    for (const key in treeCollapsedState) {
        delete treeCollapsedState[key];
    }
    initializeCollapseState(displayedLinks.value, currentDepth.value);
  }
);

const isCollapsed = (link: NavigationLink): boolean => {
    if (!link.to || !link.children || link.children.length === 0) return false;
    return !!treeCollapsedState[link.to]; // Read from the global reactive object
};

const toggleCollapse = (link: NavigationLink) => {
  if (link.to) {
    treeCollapsedState[link.to] = !treeCollapsedState[link.to]; // Write to the global reactive object
  }
};

const isActiveLink = (link: NavigationLink): boolean => {
  if (!link.to) return false;
  const currentPath = route.path;

  if (currentPath === link.to) {
    return true;
  }

  if (link.to !== '/' && currentPath.startsWith(`${link.to}/`)) {
    return true;
  }

  return false;
};
</script>