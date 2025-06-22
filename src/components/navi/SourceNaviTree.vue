<template>
  <div class="px-2" :class="{ 'is-source-active': isThisTreeActive }"> 
    <nav>
      <NaviTree
        :links="navigationLinks"
        ulClasses="p-0"
        liClasses="m-0 p-0"
        ulChildrenClasses="p-0"
        :depth="0"
        :initialExpansionLevel="props.initialExpansionLevel"
        :sourceTreeId="sourcePrefix" 

      />
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'; // Ensure 'computed' is imported
import NaviTree from './NaviTree.vue'; 
import { useRoute } from 'vue-router'; // Import useRoute


interface NavigationLink {
  label: string;
  to?: string;
  children?: NavigationLink[];
  collapsible?: boolean;
}

const props = defineProps<{
  sourcePrefix?: string;
  initialExpansionLevel?: number;
}>();

const navigationLinks = ref<NavigationLink[]>([]);
const route = useRoute(); // Initialize useRoute

// --- NEW: Computed property to determine if this entire tree is active ---
const isThisTreeActive = computed(() => {
  if (!props.sourcePrefix) return false;
  // Check if the current route path starts with this tree's source prefix.
  // This indicates that the current page belongs to this content collection.
  return route.path.startsWith(props.sourcePrefix);
});
// --- END NEW ---

const buildNavigationTree = (items: any[], basePrefix: string): NavigationLink[] => {
  const tree: NavigationLink[] = [];
  const pathToNodeMap = new Map<string, NavigationLink>();

  const normalizedBasePrefix = basePrefix.endsWith('/') ? basePrefix.slice(0, -1) : basePrefix;

  const getOrCreateNode = (path: string, defaultLabel: string, isCollapsible: boolean, isDirectory: boolean): NavigationLink => {
      if (!pathToNodeMap.has(path)) {
          const newNode: NavigationLink = {
              label: defaultLabel,
              to: path,
              children: [],
              collapsible: isCollapsible
          };
          pathToNodeMap.set(path, newNode);
      }
      return pathToNodeMap.get(path)!;
  };

  items.forEach(item => {
    if (!item.path || !item.path.startsWith(normalizedBasePrefix)) {
        return;
    }

    const itemPath = item.path;
    const itemDir = item.dir; 
    const itemTitle = item.title || item.label || (item.file ? item.file.split('.')[0] : itemDir.split('/').pop()) || 'Untitled'; 
    const isDirectoryIndex = item.file === 'index.md'; 

    if (isDirectoryIndex) {
      const dirNode = getOrCreateNode(itemDir, itemTitle, true, true);
      dirNode.to = itemPath;
    } else {
      const fileNode = getOrCreateNode(itemPath, itemTitle, false, false);
      fileNode.collapsible = false;
    }
  });

  pathToNodeMap.forEach(node => {
      const parentPath = node.to ? node.to.substring(0, node.to.lastIndexOf('/')) : null;

      if (parentPath && pathToNodeMap.has(parentPath)) {
          const parentNode = pathToNodeMap.get(parentPath)!;

          if (!parentNode.children) {
              parentNode.children = [];
          }

          if (!parentNode.children.some(child => child.to === node.to)) {
              parentNode.children.push(node);
          }
          parentNode.collapsible = true;
      } else {
          if (node.to && node.to.startsWith(normalizedBasePrefix) && !tree.some(root => root.to === node.to)) {
              const isDirectChildOfBase = parentPath === normalizedBasePrefix;
              if (isDirectChildOfBase || node.to === normalizedBasePrefix) {
                tree.push(node);
              }
          }
      }
  });

  const finalTree = tree.filter(rootNode => {
      const parentPath = rootNode.to ? rootNode.to.substring(0, rootNode.to.lastIndexOf('/')) : null;
      return rootNode.to === normalizedBasePrefix || !parentPath || !pathToNodeMap.has(parentPath);
  });

  const sortNodes = (nodes: NavigationLink[]) => {
    nodes.sort((a, b) => {
      const isADir = a.children && a.children.length > 0;
      const isBDir = b.children && b.children.length > 0;
      if (isADir && !isBDir) return -1;
      if (!isADir && isBDir) return 1;
      return (a.label || '').localeCompare(b.label || '');
    });
    nodes.forEach(node => {
      if (node.children) {
        sortNodes(node.children);
      }
    });
  };
  sortNodes(finalTree);

  return finalTree;
};

const fetchAndBuildNavigation = async () => {
  if (!props.sourcePrefix) {
    navigationLinks.value = [];
    return;
  }

  try {
    const collectionName = props.sourcePrefix.replace(/^\//, '');

    const rawContent = await queryCollection(collectionName).all();
    const content = Array.isArray(rawContent) ? rawContent : [];
    const allItems = [...content];

    allItems.sort((a: any, b: any) => {
      const idA = a.id || '';
      const idB = b.id || '';
      return idA.localeCompare(idB);
    });

    let builtTree = buildNavigationTree(allItems, props.sourcePrefix);

    // Create a dummy root node for the collection itself if the basePrefix is not already in the tree
    // This allows NaviTree to correctly handle the "no apex node" display
    const normalizedBasePrefix = props.sourcePrefix.endsWith('/') ? props.sourcePrefix.slice(0, -1) : props.sourcePrefix;
    const apexExistsInTree = builtTree.some(node => node.to === normalizedBasePrefix);

    if (!apexExistsInTree) {
      const collectionRoot: NavigationLink = {
        label: props.sourcePrefix.split('/').pop() || 'Collection', // Label for the hidden apex
        to: props.sourcePrefix, // Link to the root of the collection
        children: builtTree, // The fetched hierarchy becomes children of this dummy root
      };
      navigationLinks.value = [collectionRoot];
    } else {
      navigationLinks.value = builtTree;
    }


  } catch (error) {
    navigationLinks.value = [{ label: 'Error loading content navigation', collapsible: false }];
  }
};

onMounted(fetchAndBuildNavigation);
watch(() => props.sourcePrefix, fetchAndBuildNavigation);
</script>