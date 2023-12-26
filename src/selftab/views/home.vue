<template>
  <backgroundImage />
  <el-row justify="end" class="icon-row">
    <el-icon @click="openSettingPanel" class="icon-style">
      <Setting />
    </el-icon>
    <el-icon @click="refreshBookmarks" class="icon-style">
      <Refresh />
    </el-icon>
  </el-row>

  <el-row :gutter="20">
    <el-col :span="20" :offset="2">
      <el-row class="search-bar" justify="center">
        <search-bar :bookmarks="bookmarksList"></search-bar>
      </el-row>
      <el-col>
        <bookmark-component-row
          :title="'收藏夹栏'"
          :bookmarks-data="bookmarksBySingle"
        ></bookmark-component-row>
      </el-col>
      <el-col>
        <div v-for="(item, index) in bookmarksByFolder" :key="index">
          <bookmark-component-row
            v-if="item.children"
            :title="item.title"
            :bookmarks-data="item.children"
          ></bookmark-component-row>
        </div>
      </el-col>
    </el-col>
  </el-row>

  <SettingPanel
    :modelValue="drawer"
    @update:modelValue="drawer = $event"
    :maxHeight="maxHeight"
    @update:maxHeight="handleMaxHeightUpdate"
  />
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted } from "vue";
import { mockBookmarksData } from "@/assets/mockBookmarksData.js";
import BookmarkComponentRow from "@/selftab/components/bookmark-component-row.vue";
import BookmarkSingle from "@/selftab/components/bookmark-single.vue";
import SearchBar from "@/selftab/components/search-bar.vue";
import SettingPanel from "@/selftab/components/setting-panel.vue";
import { Setting, Refresh } from "@element-plus/icons-vue";
import backgroundImage from "@/selftab/components/background-image.vue";

const bookmarksAll = ref({});
const bookmarksByFolder = ref({});
const bookmarksBySingle = ref({});
const isChromeExtension = typeof chrome !== "undefined" && chrome.bookmarks;
const bookmarksList = ref([]);
const drawer = ref(false);
const maxHeight = ref(300);

//分割书签数据
const splitBookmarks = (bookmarksData) => {
  const folder = [];
  const single = [];
  bookmarksData.forEach((bookmark) => {
    if (bookmark.children && bookmark.children.length > 0) {
      folder.push(bookmark);
    } else {
      single.push(bookmark);
    }
  });
  bookmarksByFolder.value = folder;
  bookmarksBySingle.value = single;
};

// 查找所有书签
const findBookmarks = (bookmarks) => {
  const bookmarksListLocal = localStorage.getItem("bookmarksList");
  if (bookmarksListLocal) {
    bookmarksList.value = JSON.parse(bookmarksListLocal);
  } else {
    bookmarks.forEach((bookmark) => {
      if (!bookmark.url && bookmark.children.length > 0) {
        findBookmarks(bookmark.children);
      } else {
        bookmarksList.value.push(bookmark);
      }
    });
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarksList.value));
  }
};

// 打开设置面板
const openSettingPanel = () => {
  drawer.value = true;
};

// 更新最大高度
const handleMaxHeightUpdate = (newMaxHeight) => {
  maxHeight.value = newMaxHeight;
};

// 布局计算
const bookmarkCardMinWidth = 240;
const bookmarkCardMaxWidth = 260;
const columnGap = 4;
const layout = reactive({
  containerWidth: 0,
  columnCount: 0,
  cardWidth: 0,
});

const bookmarkContainerRef = ref(null);

const calculateLayout = () => {
  if (bookmarkContainerRef.value) {
    const containerWidth = bookmarkContainerRef.value.offsetWidth;
    let columnCount = Math.floor(containerWidth / (bookmarkCardMinWidth + columnGap));
    columnCount = Math.max(columnCount, 1);
    let cardWidth = containerWidth / columnCount - columnGap;
    cardWidth = Math.min(cardWidth, bookmarkCardMaxWidth);
    layout.containerWidth = containerWidth;
    layout.columnCount = columnCount;
    layout.cardWidth = cardWidth;
  }
};

const saveBookmarksToStorage = () => {
  const bookmarksData = {
    bookmarksByFolder: bookmarksByFolder.value,
    bookmarksBySingle: bookmarksBySingle.value,
    bookmarksList: bookmarksList.value,
  };
  chrome.storage.local.set({ bookmarksData });
};

const loadBookmarksFromStorage = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["bookmarksData"], (result) => {
      if (result.bookmarksData) {
        bookmarksByFolder.value = result.bookmarksData.bookmarksByFolder;
        bookmarksBySingle.value = result.bookmarksData.bookmarksBySingle;
        bookmarksList.value = result.bookmarksData.bookmarksList;
        resolve(true); // 数据从缓存加载
      } else {
        resolve(false); // 无缓存数据
      }
    });
  });
};

const refreshBookmarks = async () => {
  isChromeExtension ? loadBookmarksFromChrome() : loadBookmarksFromJSON();
};

const loadBookmarksFromChrome = () => {
  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    bookmarksAll.value = bookmarkTreeNodes[0].children[0].children;
    splitBookmarks(bookmarksAll.value);
    findBookmarks(bookmarksAll.value);
    saveBookmarksToStorage();
  });
};

const loadBookmarksFromJSON = () => {
  bookmarksAll.value = mockBookmarksData;
  splitBookmarks(bookmarksAll.value);
  findBookmarks(bookmarksAll.value);
};

onMounted(() => {
  if (isChromeExtension) {
    loadBookmarksFromStorage().then((isLoadedFromStorage) => {
      if (!isLoadedFromStorage) {
        loadBookmarksFromChrome();
      }
    });
  } else {
    loadBookmarksFromJSON();
  }
  calculateLayout();
  window.addEventListener("resize", calculateLayout);
});

onUnmounted(() => {
  window.removeEventListener("resize", calculateLayout);
});
</script>

<style scoped lang="scss">
$white-color: #fff;
$icon-margin-right: 20px;
$icon-margin-top: 10px;

.icon-style {
  color: $white-color;
  margin-right: $icon-margin-right;
  margin-top: $icon-margin-top;
}

.box-wrapper {
  width: 100%;
}

.single-bookmark {
  padding: 5px;
}

.box-item {
  box-sizing: border-box;
  break-inside: avoid;
  padding: 5px;
}

.box-item > div {
  height: 100%;
  background: #4286f5;
  box-sizing: border-box;
}

.search-bar {
  align-items: center;
  align-content: center;
  height: 100px;
}

.setting-icon {
  margin: 20px;
  color: white;
  &:hover {
    color: #000000;
    background-color: #f1f1f1;
  }
}
</style>
