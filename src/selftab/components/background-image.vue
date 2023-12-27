<template>
  <div id="building" :style="backgroundStyle"></div>
</template>

<script setup>
import { computed, inject } from "vue";

const settings = inject("settings");

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${settings.value.imageUrl})`,
  filter: `blur(${settings.value.blur}px) brightness(${settings.value.brightness}%)`,
}));
</script>

<style scoped lang="scss">
#building {
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: cover; /* cover确保图片覆盖整个元素 */
  background-position: center; /* 图片居中显示 */
  top: 0;
  left: 0;
  transform: scale(1.1); //解决代码
}
</style>
