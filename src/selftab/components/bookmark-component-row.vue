<template>
  <div class="bookmark-card" ref="bookmarkListRef">
    <el-col>
      <el-row>
        <div class="card-header" style="color: white">
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
import { ref, onMounted, nextTick } from "vue";
import BookmarkItem from "@/selftab/components/bookmark-item.vue";
import BookmarkFolder from "@/selftab/components/bookmark-folder.vue";

const props = defineProps({
  title: "",
  bookmarksData: {
    type: Object,
    default: () => ref({}),
  },
  cardColor: "#000000",
  textColor: "#ffffff",
});
function locationToUrl(url) {
  window.open(url);
}
const bookmarkListRef = ref(null);

onMounted(async () => {
  await nextTick();
});
</script>

<style scoped lang="scss">
.bookmark-card {
  background-color: rgba(255, 255, 255, 0.127);
  height: auto;
  border-radius: 10px;
  padding: 5px;
  margin: 20px;
  border-color: aliceblue;
  border: 1px;

  .card-header {
    font-size: 1.2em;
    font-weight: bold;
    margin: 5px;
  }
}
</style>
