<template>
  <el-drawer v-model="drawer" :show-close="false" :with-header="false">
    <el-row type="flex" justify="space-between" align="middle" style="height: 30px">
      <h3>设置</h3>
      <el-button @click="toDefaultSettings" size="small">恢复默认</el-button>
    </el-row>

    <el-divider />
    <div class="setting-items">
      <h4>背景设置</h4>
      <div>
        <label for="blur">背景图片: </label>
        <input
          type="file"
          @change="handleFileChange"
          :style="{ margin: '10px 0px 10px 0px' }"
        />
      </div>

      <div>
        <label for="blur">背景模糊: </label>
        <el-slider
          v-model="settings.blur"
          @input="() => updateSettings({ blur: settings.blur })"
        />
      </div>

      <div>
        <label for="brightness">背景明暗: </label>
        <el-slider
          v-model="settings.brightness"
          @input="() => updateSettings({ brightness: settings.brightness })"
        />
      </div>
    </div>
    <el-divider />
    <div>
      <h4>文件夹设置</h4>
      <div>
        <label for="fontsize">文件夹背景颜色: </label>
        <el-color-picker
          v-model="settings.folderBackgroundColor"
          show-alpha
          :predefine="predefineColors"
          @change="
            () =>
              updateSettings({ folderBackgroundColor: settings.folderBackgroundColor })
          "
        />
      </div>

      <div>
        <label for="fontsize">文件夹边距: </label>
        <el-slider
          v-model="settings.folderMargin"
          @input="() => updateSettings({ folderMargin: settings.folderMargin })"
          :step="2"
          :min="10"
          :max="50"
        />
      </div>

      <div>
        <label for="fontsize">子文件夹背景颜色: </label>
        <el-color-picker
          v-model="settings.subFolderBackgroundColor"
          show-alpha
          :predefine="predefineColors"
          @change="
            () =>
              updateSettings({
                subFolderBackgroundColor: settings.subFolderBackgroundColor,
              })
          "
        />
      </div>
      <div>
        <div>
          <label for="fontsize">标题颜色: </label>
          <el-color-picker
            v-model="settings.titleColor"
            show-alpha
            :predefine="predefineColors"
            @change="() => updateSettings({ titleColor: settings.titleColor })"
          />
        </div>
        <label for="fontsize">标题字体大小: </label>
        <el-slider
          v-model="settings.titleFontSize"
          @input="() => updateSettings({ titleFontSize: settings.titleFontSize })"
          :step="0.05"
          :min="1"
          :max="2.5"
        />
      </div>
    </div>
    <el-divider />
    <div>
      <h4>书签设置</h4>
      <div>
        <label for="fontsize">书签背景颜色: </label>
        <el-color-picker
          v-model="settings.itemBackgroundColor"
          show-alpha
          :predefine="predefineColors"
          @change="
            () => updateSettings({ itemBackgroundColor: settings.itemBackgroundColor })
          "
        />
      </div>

      <div>
        <label for="fontsize">书签字体颜色: </label>
        <el-color-picker
          v-model="settings.itemFontColor"
          show-alpha
          :predefine="predefineColors"
          @change="() => updateSettings({ itemFontColor: settings.itemFontColor })"
        />
      </div>

      <div>
        <label for="fontsize">书签图标背景颜色: </label>
        <el-color-picker
          v-model="settings.itemIconBackgroundColor"
          show-alpha
          :predefine="predefineColors"
          @change="() => updateSettings({ itemIconBackgroundColor: settings.itemIconBackgroundColor })"
        />
      </div>

      <div>
        <label for="fontsize">书签字体大小: </label>
        <el-slider
          v-model="settings.itemFontSize"
          @input="() => updateSettings({ itemFontSize: settings.itemFontSize })"
          :step="0.05"
          :min="0.7"
          :max="2"
        />
      </div>

      <div>
        <label for="fontsize">书签最大宽度: </label>
        <el-slider
          v-model="settings.maxItemWidth"
          @input="() => updateSettings({ maxItemWidth: settings.maxItemWidth })"
          :step="50"
          :min="200"
          :max="1000"
        />
      </div>

      <div>
        <label for="fontsize">书签最小宽度: </label>
        <el-slider
          v-model="settings.minItemWidth"
          @input="() => updateSettings({ minItemWidth: settings.minItemWidth })"
          :step="50"
          :min="50"
          :max="settings.maxItemWidth"
        />
      </div>

      <div>
        <label for="fontsize">书签左右边距: </label>
        <el-slider
          v-model="settings.itemLeftRightMargin"
          @input="
            () => updateSettings({ itemLeftRightMargin: settings.itemLeftRightMargin })
          "
          :step="1"
          :min="1"
          :max="20"
        />
      </div>

      <div>
        <label for="fontsize">书签上下边距: </label>
        <el-slider
          v-model="settings.itemTopBottomMargin"
          @input="
            () => updateSettings({ itemTopBottomMargin: settings.itemTopBottomMargin })
          "
          :step="1"
          :min="1"
          :max="20"
        />
      </div>
    </div>
    <div>
      <h4>其他设置</h4>
      <div>
        <label for="fontsize">是否在新标签页中打开链接: </label>
        <el-switch 
        v-model="settings.openNewUrlInNewTab"
        @change="
            () =>
              updateSettings({ openNewUrlInNewTab: settings.openNewUrlInNewTab })
          "
         />
      </div>
      </div>
  </el-drawer>
</template>

<script setup>
import { ref, inject, watch } from "vue";
const props = defineProps({
  modelValue: Boolean,
});
const settings = inject("settings");
const updateSettings = inject("updateSettings");
const toDefaultSettings = inject("toDefaultSettings");
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

const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);
</script>

<style scoped>
.setting-items {
  margin: 10px;
}
</style>
