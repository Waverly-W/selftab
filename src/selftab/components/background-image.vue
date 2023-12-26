<template>
  <div id="building">
    <div class="filter" ref="filter"></div>
  </div>
</template>

<style scoped lang="scss">
#building {
  background: url("https://fengzi3364.oss-cn-shanghai.aliyuncs.com/img/img.png");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: cover; /* cover确保图片覆盖整个元素 */
  background-position: center; /* 图片居中显示 */
  top: 0;
  left: 0;
}

.filter {
  width: 100%; //大小设置为100%
  height: 100%; //大小设置为100%
  backdrop-filter: blur(5px);
}
</style>
