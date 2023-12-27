<template>
  <div class="bookmark-item">
    <el-space>
      <div class="bookmark-icon" :style="styleObject">
        <img
          :src="getFaviconUrl(item.url)"
          alt="bookmark"
          height="16"
          width="16"
          @error="handleImgError($event)"
        />
      </div>
      <el-text truncated class="bookmark-title" size="small">
        {{ item.title }}
      </el-text>
    </el-space>
  </div>
</template>

<script setup>
import { computed } from "vue";

// 定义props
const props = defineProps({
  item: Object,
  backgroundColor: {
    type: String,
    default: "#FFFFFF",
  },
  borderRadius: {
    type: String,
    default: "4px",
  },
});
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

// 计算样式对象
const styleObject = computed(() => ({
  backgroundColor: props.backgroundColor,
  borderRadius: props.borderRadius,
}));
</script>

<style scoped>
.bookmark-icon {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bookmark-icon img {
  width: 14px;
  height: 14px;
  min-width: 14px; /* 或者适当的尺寸 */
}

.bookmark-title {
  color: white;
  max-width: 450px;
}
.bookmark-item {
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
:deep(.bookmark-title:hover) {
  text-decoration: underline; /* 鼠标悬停时添加下划线 */
}
</style>
