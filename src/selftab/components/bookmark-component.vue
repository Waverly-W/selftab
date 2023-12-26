<template>
  <div
    class="bookmark-card"
    :style="{
      backgroundColor: randomBackgroundColor,
      width: width,
    }"
    ref="bookmarkListRef"
  >
    <div class="card-header" style="mix-blend-mode: difference; color: white">
      <el-row justify="space-between">
        <a>|&nbsp;&nbsp;{{ title }}</a>
        <el-button v-if="isContentOverflowing" @click="toggleExpand">
          <div v-if="isExpanded">
            收起<el-icon><CaretTop /></el-icon>
          </div>
          <div v-else>
            展开<el-icon><CaretBottom /></el-icon>
          </div>
        </el-button>
      </el-row>
    </div>

    <div class="bookmark-list" :style="bookmarkListStyle">
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
    </div>
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
  width: "220px",
  maxHeight: {
    default: localStorage.getItem("folderMaxHeight") || "400px",
  },
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
const toggle = (item) => {
  if (item.children) {
    item.isExpanded = !item.isExpanded;
  }
};

const hasChildren = (item) => {
  return item.children && item.children.length > 0;
};

function locationToUrl(url) {
  window.open(url);
}

const isContentOverflowing = computed(() => {
  if (!bookmarkListRef.value) return false;
  return bookmarkListRef.value.scrollHeight > parseInt(props.maxHeight);
});

// 根据是否折叠和内容是否超过maxHeight来动态设置样式
const bookmarkListStyle = computed(() => {
  return {
    maxHeight: isExpanded.value || !isContentOverflowing.value ? "none" : props.maxHeight,
    overflowY: "auto",
  };
});

// 点击展开/折叠时触发
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

watch(
  () => props.maxHeight,
  () => {
    if (bookmarkListRef.value.scrollHeight <= parseInt(props.maxHeight)) {
      isExpanded.value = false; // 如果内容不超过新的最大高度，则不展开
    }
  }
);

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
  .card-header button {
    font-size: 10px;
    background: transparent;
    color: white;
    border: none;
    height: 21.47px;
  }

  .bookmark-list {
    padding: 0;
    color: white;

    overflow-y: auto;

    .bookmark-item {
      height: auto;
      padding: 2px 2px;
      width: auto;
      transition: all 0.3s ease; /* 为下划线添加平滑过渡效果 */

      &:hover {
        background-color: #484848c1;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}

:deep(.bookmark-text:hover) {
  text-decoration: underline; /* 鼠标悬停时添加下划线 */
}
</style>
