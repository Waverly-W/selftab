<template>
  <div id="searchbar" ref="searchbarRef">
    <div class="custom-select" @click="toggleDropdown">
      <div class="select-selected">
        <i
          :class="['icon', 'iconfont', `icon-${searchEngines[selectedEngine].icon}`]"
          style="font-size: 22px; margin-right: 10px"
        />
        <el-icon sizestyle="right: 20px;">
          <ArrowDownBold />
        </el-icon>
      </div>
      <div class="select-items" v-show="dropdownOpen">
        <div
          v-for="(_, engine) in searchEngines"
          :key="engine"
          @click="(event) => selectEngine(event, engine)"
        >
          {{ engine }}
        </div>
      </div>
    </div>

    <input
      type="text"
      placeholder="Search"
      @focus="dropdownOpen = false"
      @input="searchAction($event)"
      @keyup.down="navigate(1)"
      @keyup.up="navigate(-1)"
      @keyup.enter="confirmSelection"
      ref="searchInputRef"
    />

    <button @click="searchInEngine">
      <el-icon>
        <Search />
      </el-icon>
    </button>

    <teleport to="body">
      <div v-if="searchQuery" class="popup" :style="{ top: popupTop, left: popupLeft }">
        <div
          v-for="(item, index) in searchResult"
          :key="index"
          :href="item.url"
          :class="{ selected: index === selectedIndex }"
          @click="goToBookmark(item.url)"
        >
          {{ item.title }}
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { Search, ArrowDownBold, ChromeFilled } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, onUnmounted, watch } from "vue";

const searchResult = ref([]);
const searchQuery = ref("");
const selectedEngine = ref("Bing");
const dropdownOpen = ref(false);
const selectedIndex = ref(-1); // 新增：跟踪选中的条目索引
const searchEngines = reactive({
  Google: { url: "https://www.google.com/search?q=", icon: "google" },
  Bing: { url: "https://www.bing.com/search?q=", icon: "bing" },
  DuckDuckGo: { url: "https://duckduckgo.com/?q=", icon: "duckduckgo" },
});
const searchbarRef = ref(null);
const searchInputRef = ref(null);
const popupTop = ref("0px");
const popupLeft = ref("0px");
const popupWidth = ref("0px");
const props = defineProps({
  bookmarks: Array,
});

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function selectEngine(event, engine) {
  event.stopPropagation();
  selectedEngine.value = engine;
  dropdownOpen.value = false;
  localStorage.setItem("defaultSearchEngine", engine);
}

const onClickOutside = (event) => {
  if (!searchbarRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

function searchAction(event: any) {
  searchQuery.value = event.target.value.toLowerCase();
  searchResult.value = props.bookmarks.filter((item: any) =>
    item.title.toLowerCase().includes(searchQuery.value)
  );
}

function navigate(step: number) {
  const resultCount = searchResult.value.length;
  if (resultCount > 0) {
    selectedIndex.value = (selectedIndex.value + step + resultCount) % resultCount;
  }
}

function goToBookmark(url: string) {
  window.open(url, "_blank");
}

function confirmSelection() {
  if (selectedIndex.value >= 0 && searchResult.value[selectedIndex.value]) {
    window.open(searchResult.value[selectedIndex.value].url, "_blank");
  } else if (searchQuery.value) {
    const engineUrl = searchEngines[selectedEngine.value].url;
    window.open(`${engineUrl}${encodeURIComponent(searchQuery.value)}`, "_blank");
  }
}
const loadSettings = () => {
  // 加载默认搜索引擎
  const savedEngine = localStorage.getItem("defaultSearchEngine");
  if (savedEngine) {
    selectedEngine.value = savedEngine;
  }
};

onMounted(() => {
  const rect = searchbarRef.value.getBoundingClientRect();
  popupTop.value = `${rect.bottom + window.scrollY}px`;
  popupLeft.value = `${rect.left + window.scrollX}px`;
  updatePopupPosition();
  document.addEventListener("click", onClickOutside);
  loadSettings();
});

onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});

function searchInEngine() {
  const engineUrl = searchEngines[selectedEngine.value].url;
  window.open(`${engineUrl}${encodeURIComponent(searchQuery.value)}`, "_blank");
}

function updatePopupPosition() {
  if (searchbarRef.value) {
    const rect = searchbarRef.value.getBoundingClientRect();
    const rectInput = searchInputRef.value.getBoundingClientRect();
    popupTop.value = `${rect.bottom + window.scrollY}px`;
    popupLeft.value = `${rect.left + window.scrollX + 140}px`;
    popupWidth.value = `${rectInput.width}px`; // 新增：设置弹出框宽度
  }
}

watch(searchQuery, () => {
  if (!searchQuery.value) {
    searchResult.value = [];
    selectedIndex.value = -1; // 清空选中状态
  }
  updatePopupPosition();
});
</script>

<style>
#searchbar {
  position: relative;
  width: 40%;
  min-width: 500px;
  display: flex;
  align-items: center;
  background-color: white;
  /* 搜索框背景色 */
  border-radius: 22px;
  /* 圆角值根据实际效果调整 */
  padding: 5px;
}

.custom-select {
  font-size: 0.8em;
  margin: 5px;
  position: relative;
  width: 8px0px;
  cursor: pointer;

  .select-selected {
    display: block;
    justify-content: space-between;
    padding-left: 20px;
    background-color: transparent;
    color: black;
    border-radius: 10px;
    margin: 0 auto;
  }

  .select-items {
    position: absolute;
    background-color: white;
    padding: 10px;
    top: 36px;
    left: 0;
    right: 0;
    z-index: 99;
    border-radius: 10px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    width: 150%;
  }
}

.select-items div {
  padding: 10px;
  color: black;
}

.select-items div:last-child {
  border-bottom: none;
}

.select-items div:hover {
  border-radius: 10px;
  background-color: #e0e0e0;
}

#searchbar input {
  border: none;
  background-color: transparent;
  color: black;
  margin-right: 8px;
  /* 保持一定间距 */
}

#searchbar input {
  height: 30px;
  flex-grow: 1;
  outline: none;
  /* 去除获焦时的边框 */
}

#searchbar button {
  margin-right: 20px;
  border: none;
  background-color: transparent;
  /* 圆形按钮 */
  padding: 10px;
  /* 按钮大小 */
  cursor: pointer;
  /* 鼠标悬停时的指针样式 */
  outline: none;
  /* 去除获焦时的边框 */
}

#searchbar button:hover {
  color: #e0e0e0;
  /* 鼠标悬停时的背景色 */
}

.popup {
  position: absolute;
  width: var(--popup-width);
  /* 使用 CSS 变量设置宽度 */
  top: 100%;
  /* 使弹出框位于 searchbar 的底部 */
  left: 140px;
  /* 与 searchbar 的左边对齐 */
  margin-top: 5px;
  /* 与 searchbar 有一定间距 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  background-color: #ffffff;
  /* 与 searchbar 背景色一致 */
  overflow: hidden;
  /* 隐藏超出弹出框的部分 */
}

.popup div {
  display: flex;
  margin: 10px;
  padding: 6px;
  color: black;
  /* 链接文本颜色 */
  text-decoration: none;
  /* 去除下划线 */
  background-color: #ffffff;
  /* 链接背景色 */
}

.popup div.selected,
.popup div:hover {
  cursor: pointer;
  border-radius: 10px;
  margin: 10px;
  background-color: #e0e0e0;
  /* 选中或悬停的背景色 */
}
</style>
