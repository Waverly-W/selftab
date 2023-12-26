<template>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>设置</h4>
    </template>
    <div class="slider-demo-block">
      <span class="demonstration">书签组件最大高度</span>
      <el-slider
        v-model="localMaxHeight"
        :min="200"
        :max="800"
        :step="10"
        :show-tooltip="true"
        :format-tooltip="formatTooltip"
      />
    </div>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="confirmSettings">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  modelValue: Boolean,
  maxHeight: Number,
});

const emit = defineEmits(["update:modelValue", "update:maxHeight"]);

const drawer = ref(props.modelValue);
const localMaxHeight = ref(props.maxHeight || 300); // 默认值为300
const formatTooltip = (val) => `${val}px`;
// 监听内部drawer变化，通知父组件
watch(drawer, (newVal) => {
  emit("update:modelValue", newVal);
});
// 监听外部modelValue变化，更新内部drawer
watch(
  () => props.modelValue,
  (newVal) => {
    drawer.value = newVal;
  }
);

// 点击确认按钮时更新maxHeight
const confirmSettings = () => {
    emit("update:maxHeight", localMaxHeight.value);
  localStorage.setItem('folderMaxHeight', localMaxHeight.value);
  drawer.value = false; // 关闭抽屉
};

// 监听抽屉关闭事件，在关闭时重置本地maxHeight
watch(drawer, (newVal) => {
  if (!newVal) {
    localMaxHeight.value = props.maxHeight; // 重置为从父组件接收的值
  }
});
</script>
