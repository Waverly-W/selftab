<template>
  <div
    class="bookmark-card"
    :style="{
      backgroundColor: randomBackgroundColor,
    }"
    ref="bookmarkListRef"
  >
    <el-space wrap alignment="center">
      <div class="card-header" style="mix-blend-mode: difference; color: white">
        <a>|&nbsp;&nbsp;{{ title }}</a>
      </div>
      <div v-for="(item, index) in bookmarksData" :key="index" class="bookmark-item">
        <el-text
          v-if="item.url"
          class="bookmark-text"
          truncated
          style="mix-blend-mode: difference; color: white"
          @click="locationToUrl(item.url)"
        >
          <el-icon size="14px">
            <Link />
          </el-icon>
          {{ item.title }}
        </el-text>
        <sub-bookmark-component
          v-else
          :bookmarks-data="item.children"
          :title="item.title"
          :width="width - '20px'"
        ></sub-bookmark-component>
      </div>
    </el-space>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { CaretBottom, CaretTop, Link } from "@element-plus/icons-vue";
import SubBookmarkComponent from "@/selftab/components/sub-bookmark-component.vue";

const props = defineProps({
  title: "",
  bookmarksData: {
    type: Object,
    default: () => ref({}),
  },
  cardColor: "#000000",
  textColor: "#ffffff",
});

const isExpanded = ref(false);
const bookmarkListRef = ref(null);

const colorArray = ["#414b4b", "#383c51", "#3f534b", "#505e60", "#3a3a3a", "#443a3a"];
// Function to get a random color from the array
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colorArray.length);
  return colorArray[randomIndex];
};

const randomBackgroundColor = ref(getRandomColor());

function locationToUrl(url) {
  window.open(url);
}

// 点击展开/折叠时触发
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

onMounted(async () => {
  await nextTick();
});
</script>

<style scoped lang="scss">
.bookmark-card {
  height: auto;
  border-radius: 10px;
  padding: 5px;
  margin: 10px;

  .card-header {
    font-size: 1.2em;
    font-weight: bold;
    margin: 5px;
  }

  .bookmark-item {
    background-color: #484848c1;
    margin: 5px;
    padding: 8px 10px 4px 10px;
    border-radius: 10px;
    transition: all 0.3s ease; /* 为下划线添加平滑过渡效果 */
    max-width: 500px;

    &:hover {
      background-color: #c7c7c72c;
      border-radius: 10px;
      cursor: pointer;
    }
  }
}

:deep(.bookmark-text:hover) {
  text-decoration: underline; /* 鼠标悬停时添加下划线 */
}
</style>
