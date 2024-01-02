<template>
  <div class="sub-bookmark-card">
    <div class="popover-container">
      <div
        class="bookmark-item"
        @click="togglePopover"
        :style="itemStyle"
        ref="popoverTriggerRef"
      >
        <el-space>
          <el-icon :size="14">
            <template v-if="!isPopoverVisible"
              ><Folder :style="itemFontStyle"
            /></template>
            <template v-else><FolderOpened :style="itemFontStyle" /></template>
          </el-icon>
          <el-text :style="itemFontStyle">{{ title }}</el-text>
        </el-space>
      </div>
    </div>

    <div
      v-if="isPopoverVisible"
      class="popover-content"
      ref="popoverContentRef"
      :style="subFolderStyle"
    >
      <div v-for="(item, index) in bookmarksData" :key="index">
        <BookmarkItem v-if="item.url" :item="item" @click="locationToUrl(item.url)" />
        <bookmark-folder v-else :bookmarks-data="item.children" :title="item.title" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, computed } from "vue";
import { Folder, FolderOpened } from "@element-plus/icons-vue";
import BookmarkItem from "@/selftab/components/bookmark-item.vue";

const props = defineProps({
  title: "",
  bookmarksData: {
    type: Object,
    default: () => ref({}),
  },
});
const settings = inject("settings");
// const folderStyle = computed(() => ({
//   backgroundColor: `${settings.value.itemBackgroundColor}`,
// }));
const itemStyle = computed(() => ({
  maxWidth: `${settings.value.maxItemWidth}px`,
  minWidth: `${settings.value.minItemWidth}px`,
  backgroundColor: `${settings.value.itemBackgroundColor}`,
  marginTop: `${settings.value.itemTopBottomMargin}px`,
  marginLeft: `${settings.value.itemLeftRightMargin}px`,
  marginBottom: `${settings.value.itemTopBottomMargin}px`,
  marginRight: `${settings.value.itemLeftRightMargin}px`,
}));

const itemFontStyle = computed(() => ({
  fontSize: `${settings.value.itemFontSize}em`,
  color: `${settings.value.itemFontColor}`,
}));
const subFolderStyle = computed(() => ({
  backgroundColor: `${settings.value.subFolderBackgroundColor}`,
}));

const isPopoverVisible = ref(false);
const popoverTriggerRef = ref(null);
const popoverContentRef = ref(null);
function togglePopover() {
  isPopoverVisible.value = !isPopoverVisible.value;
}

function locationToUrl(url) {
  window.open(url);
}

function handleClickOutside(event) {
  if (
    popoverTriggerRef.value &&
    !popoverTriggerRef.value.contains(event.target) &&
    popoverContentRef.value &&
    !popoverContentRef.value.contains(event.target)
  ) {
    isPopoverVisible.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss">
$hover-color: rgba(255, 255, 255, 0.446);

.sub-bookmark-card {
  position: relative;
}

.popover-container {
  position: relative;
}

.popover-content {
  position: absolute;
  z-index: 100;
  background-color: darkgray;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 10px;
  border-radius: 4px;
  top: 100%;
  left: 0;
}

.bookmark-item {
  padding: 6px 10px;
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    background-color: $hover-color;
  }
}
</style>
