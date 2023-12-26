import { createApp } from "vue";

import "@/common/styles/frame.styl";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import Selftab from "@/selftab/index.vue";
import router from "./router";
import "@/assets/fonts/iconfont/iconfont.css";

const app = createApp(Selftab);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(router);
app.mount("#app");
