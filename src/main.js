import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// reset.css
import "@/assets/css/reset.css";
// iconfont.css
import "@/assets/fonts/iconfont.css";

// 引入ElementUI
import ElementUI from "element-ui"; // JS
import "element-ui/lib/theme-chalk/index.css"; // CSS

// bus
Vue.prototype.$bus = new Vue();

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

// // 测试
// import req from "@/utils/request";
// console.log(req);

// req.get("reg.php", {
//   acc: "admin",
//   pwd: "123",
// });

// req.post("login.php", {
//   acc: "admin",
//   pwd: "123",
// });
