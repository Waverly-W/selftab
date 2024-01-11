<template>
  <div class="bookmark-card" ref="bookmarkListRef" :style="cardStyle">
    <el-col>
      <el-row>
        <div class="card-header" :style="titleFontStyle">
          <a>|&nbsp;&nbsp;{{ title }}</a>
        </div>
      </el-row>
      <el-row wrap alignment="center">
        <div v-for="(item, index) in bookmarksData" :key="index">
          <div v-if="item.url">
            <BookmarkItem :item="item" @click="locationToUrl(item.url)"></BookmarkItem>
          </div>
          <BookmarkFolder
            v-else
            :bookmarks-data="item.children"
            :title="item.title"
          ></BookmarkFolder>
        </div>
      </el-row>
    </el-col>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, inject } from "vue";
import BookmarkItem from "@/selftab/components/bookmark-item.vue";
import BookmarkFolder from "@/selftab/components/bookmark-folder.vue";

const props = defineProps({
  title: "",
  bookmarksData: {
    type: Object,
    default: () => ref({}),
  },
});
const settings = inject("settings");

function locationToUrl(url) {
  if (settings.value.openNewUrlInNewTab) {
    window.open(url);
  } else {
    window.location.href = url;
  }
}

const bookmarkListRef = ref(null);
const titleFontStyle = computed(() => ({
  fontSize: `${settings.value.titleFontSize}em`,
  color: `${settings.value.titleColor}`,
}));
const cardStyle = computed(() => ({
  backgroundColor: `${settings.value.folderBackgroundColor}`,
  margin: `${settings.value.folderMargin}px`,
}));

onMounted(async () => {
  await nextTick();
});
</script>

<style scoped lang="scss">
.bookmark-card {
  height: auto;
  border-radius: 10px;
  padding: 5px;
  border: 1px;

  .card-header {
    font-size: 1.2em;
    font-weight: bold;
    margin: 5px;
  }
}
</style>
