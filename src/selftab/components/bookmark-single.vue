<template>
  <div
    class="bookmark-single"
    :style="{ backgroundColor: randomBackgroundColor, width: width }"
  >
    <el-text
      v-if="url"
      class="bookmark-text"
      truncated
      style="mix-blend-mode: difference; color: white"
      @click="locationToUrl(url)"
    >
      {{ title }}
    </el-text>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  title: "",
  url: "",
  cardColor: "#000000",
  textColor: "#ffffff",
  width: "",
});

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
function locationToUrl(url) {
  window.open(url);
}
</script>

<style scoped lang="scss">
.bookmark-single {
  height: auto;
  margin: 10px;
  padding: 5px 10px;
  border-radius: 10px;
}

.bookmark-text {
  padding: 4px;
  &:hover {
    background-color: #484848c1;
    border-radius: 4px;

    cursor: pointer;
  }
}

:deep(.bookmark-text:hover) {
  text-decoration: underline; /* 鼠标悬停时添加下划线 */
}

/* Add additional styling as needed */
</style>
