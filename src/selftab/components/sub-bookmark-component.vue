<template>
  <div class="sub-bookmark-card">
    <div @click="togglePopover" class="popover-trigger">
      <span class="icon-arrow-right"></span>
      <el-space>
        <el-icon v-if="isFold" size="14px" style="color: white"><Folder /></el-icon>
        <el-icon v-else size="14px" style="color: white"><FolderOpened /></el-icon>
        <el-text style="color: white">{{ title }}</el-text>
      </el-space>
    </div>
  </div>
  <div v-if="isPopoverVisible" class="popover-content">
    <div v-for="(item, index) in bookmarksData" :key="index">
      <div v-if="item.url">
        <BookmarkItem :item="item" @click="locationToUrl(item.url)"></BookmarkItem>
      </div>
      <div v-else>
        <sub-bookmark-component
          :bookmarks-data="item.children"
          :title="item.title"
        ></sub-bookmark-component>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Folder, FolderOpened } from "@element-plus/icons-vue";
import BookmarkItem from "@/selftab/components/bookmark-item.vue";

const props = defineProps({
  title: "",
  bookmarksData: {
    type: Object,
    default: () => ref({}),
  },
});
const isFold = ref(true);
const isPopoverVisible = ref(false);

function togglePopover() {
  isPopoverVisible.value = !isPopoverVisible.value;
}
function changeFold() {
  isFold.value = !isFold.value;
}
function locationToUrl(url) {
  window.open(url);
}
</script>

<style lang="scss">
.sub-bookmark-card {
  margin: 0;
  padding: 0;
  position: relative;
  .sub-bookmark-list {
    padding: 0;
    color: white;
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
}

:deep(.sub-bookmark-text:hover) {
  text-decoration: underline; /* 鼠标悬停时添加下划线 */
}
.popover-content {
  position: absolute;
  z-index: 100; /* 确保在最上层 */
  background-color: #ffffff21;
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
