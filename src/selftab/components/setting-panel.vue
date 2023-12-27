<template>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>设置</h4>
    </template>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>背景设置</span>
        </div>
      </template>
      <input type="file" @change="handleFileChange" />
      <div>
        <label for="blur">Background Blur: </label>
        <el-slider
          v-model="settings.blur"
          @input="() => updateSettings({ blur: settings.blur })"
        />
      </div>

      <div>
        <label for="brightness">Background Brightness: </label>
        <el-slider
          v-model="settings.brightness"
          @input="() => updateSettings({ brightness: settings.brightness })"
        />
      </div>
    </el-card>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="confirmSettings">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, inject, watch } from "vue";
const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
const drawer = ref(props.modelValue);

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
  drawer.value = false; // 关闭抽屉
};

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      settings.imageUrl = e.target.result;
      updateSettings({ imageUrl: settings.imageUrl });
    };
    reader.readAsDataURL(file); // 读取文件内容
  }
}

const settings = inject("settings");
const updateSettings = inject("updateSettings");
</script>
