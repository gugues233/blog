import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

let routes = [
  //路由的配置
  { path: "/test", component: () => import("../views/Test.vue") }, //访问/test的时候会触发访问../views/Test.vue
  { path: "/", component: () => import("../views/HomePage.vue") },
  { path: "/detail", component: () => import("../views/Detail.vue") },
  { path: "/login", component: () => import("../views/Login.vue") },
  {
    path: "/dashboard",
    component: () => import("../views/dashboard/Dashboard.vue"),
    children: [
      {
        path: "/dashboard/category",
        component: () => import("../views/dashboard/Category.vue"),
      },
      {
        path: "/dashboard/article",
        component: () => import("../views/dashboard/Article.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export { router, routes }; //现在这个项目不把routes抛出去也可以 主页面使用的路由只有router
