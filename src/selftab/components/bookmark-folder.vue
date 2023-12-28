<template>
  <div class="sub-bookmark-card">
    <div class="popover-container">
      <div class="popover-trigger" ref="popoverTriggerRef" @click="togglePopover">
        <el-space class="bookmark-folder-title" :style="folderStyle">
          <el-icon v-if="!isPopoverVisible" size="14px" style="color: white"
            ><Folder
          /></el-icon>
          <el-icon v-else size="14px" style="color: white"><FolderOpened /></el-icon>
          <el-text style="color: white" :style="itemStyle">{{ title }}</el-text>
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
        <div v-if="item.url">
          <BookmarkItem :item="item" @click="locationToUrl(item.url)"></BookmarkItem>
        </div>
        <div v-else>
          <bookmark-folder
            :bookmarks-data="item.children"
            :title="item.title"
          ></bookmark-folder>
        </div>
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
const folderStyle = computed(() => ({
  backgroundColor: `${settings.value.itemBackgroundColor}`,
}));
const itemStyle = computed(() => ({
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
.sub-bookmark-card {
  margin: 0;
  padding: 0;
  position: relative;
}
.popover-container {
  position: relative; /* 新增 */
}
.bookmark-folder-title {
  background-color: #c7c7c72c;
  margin: 4px;
  padding: 6px 10px 6px 10px;
  border-radius: 10px;
  transition: all 0.3s ease; /* 为下划线添加平滑过渡效果 */
  max-width: 500px;
  overflow: hidden;

  &:hover {
    background-color: rgba(255, 255, 255, 0.446);
    border-radius: 10px;
    cursor: pointer;
  }
}
.popover-content {
  position: absolute;
  z-index: 100; /* 确保在最上层 */
  background-color:darkgray;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 10px;
  border-radius: 4px;
  top: 100%; /* 确保弹出框在触发器下方 */
  left: 0; /* 根据需要调整 */
  width: 300px; /* 根据需要调整 */
  /* 其他样式 */
}
.popover-trigger {
  cursor: pointer;
  /* 添加所需的样式 */
}

.sub-bookmark-item {
  background-color: #c7c7c72c;
  margin: 4px;
  padding: 6px 10px 6px 10px;
  border-radius: 10px;
  transition: all 0.3s ease; /* 为下划线添加平滑过渡效果 */
  max-width: 500px;
  overflow: hidden;

  &:hover {
    background-color: rgba(255, 255, 255, 0.446);
    border-radius: 10px;
    cursor: pointer;
  }
}
</style>
