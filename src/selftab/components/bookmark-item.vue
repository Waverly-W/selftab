<template>
  <div class="bookmark-item" :style="itemStyle">
    <el-space>
      <div class="bookmark-icon">
        <img
          :src="getFaviconUrl(item.url)"
          alt="bookmark"
          height="16"
          width="16"
          @error="handleImgError($event)"
        />
      </div>
      <el-text truncated class="bookmark-title" :style="itemFontStyle">
        {{ item.title }}
      </el-text>
    </el-space>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";

// 定义props
const props = defineProps({
  item: Object,
});

const settings = inject("settings");
const itemFontStyle = computed(() => ({
  fontSize: `${settings.value.itemFontSize}em`,
  color: `${settings.value.itemFontColor}`,
  maxWidth: `${settings.value.maxItemWidth - 50}px`,
}));
const itemStyle = computed(() => ({
  maxWidth: `${settings.value.maxItemWidth}px`,
  minWidth: `${settings.value.minItemWidth}px`,
  backgroundColor: `${settings.value.itemBackgroundColor}`,
  marginTop: `${settings.value.itemTopBottomMargin}px`,
  marginLeft: `${settings.value.itemLeftRightMargin}px`,
  marginBottom: `${settings.value.itemTopBottomMargin}px`,
  marginRight: `${settings.value.itemLeftRightMargin}px`,
}));
function getFaviconUrl(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    return `https://api.iowen.cn/favicon/${hostname}.png`;
  } catch (error) {
    console.error("Invalid URL:", error);
    return "@/assets/icon.png"; // 返回一个空字符串或默认图标的URL
  }
}
function handleImgError(event) {
  event.target.src = "https://fengzi3364.oss-cn-shanghai.aliyuncs.com/img/icon16.png"; // 替换为你的默认图标
}
</script>

<style scoped>
.bookmark-icon {
  background-color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bookmark-icon img {
  width: 14px;
  height: 14px;
}

.bookmark-title {
  color: white;
}
.bookmark-item {
  padding: 6px 10px 6px 10px;
  border-radius: 10px;
  transition: all 0.3s ease; /* 为下划线添加平滑过渡效果 */
  overflow: hidden;

  &:hover {
    background-color: rgba(255, 255, 255, 0.446);
    border-radius: 10px;
    cursor: pointer;
  }
}
:deep(.bookmark-title:hover) {
  text-decoration: underline; /* 鼠标悬停时添加下划线 */
}
</style>
