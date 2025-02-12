import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import naive from "naive-ui";
import { createDiscreteApi } from "naive-ui";
import { router } from "./common/router";
import { createPinia } from "pinia";
import axios from "axios";
import { AdminStore } from "./stores/AdminStore";

axios.defaults.baseURL = "http://localhost:8080"; //做接口的时候就不用写前面这一大堆了 例如category/list会自动补全
//如果服务端地址发生变化 也就只用改这一个
const { message, notification, dialog } = createDiscreteApi([
  "message",
  "dialog",
  "notification",
]);

/**
 * axios
 * pinia
 * sass 减少写css的复杂性
 * vue-router
 * naive-ui ui的一个框架
 * wangeditor 富文本
 */

const app = createApp(App);
//provide进行一个全局提供
app.provide("axios", axios);
app.provide("message", message);
app.provide("notification", notification);
app.provide("dialog", dialog);
app.provide("server_url", axios.defaults.baseURL);

app.use(naive);
app.use(createPinia());
app.use(router);

//拦截器 为每个需要token的提供头？header  要在app.use(createPinia());后面
//每次任何请求都会先执行这个 为headers添加了一个token
const adminStore = AdminStore();
axios.interceptors.request.use((config) => {
  config.headers.token = adminStore.token;
  return config;
});

app.mount("#app");
