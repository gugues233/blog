<template>
    <div class="main-panel">
        <div class="menus">
            <div v-for="(menu, index) in menus" @click="toPage(menu)">
                {{ menu.name }}
            </div>
        </div>
        <div style="padding: 20px; width : 100%">
            <router-view></router-view>
        </div>
    </div>
    <div class="title">后台管理系统</div>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")

const adminStore = AdminStore()

let menus = [
    { name: "文章管理", href: "/dashboard/article" },
    { name: "分类管理", href: "/dashboard/category" },
    { name: "退出", href: "logout" },
];

const toPage = (menu) => { //接收一个参数 知道点的是哪一个 要跳转到哪里
    if (menu.href == 'logout') {
        router.push("/login") //点击登出后跳转回到登陆页面
    } else {
        router.push(menu.href)
    }
}


</script>

<style lang="scss" scoped>
.main-panel {
    display: flex;
    color: #64676a;
    max-width: 1500px;
    margin: 0 auto;
}

.menus {
    padding: 20px 0;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 180px;
    height: 95vh;
    border-right: 1px solid #dadada;

    //menus里的div
    div {
        cursor: pointer; //cursor鼠标变成一个指针 

        &:hover {
            color: #fd760e; //划过去后变成橙色
        }
    }
}

.title {
    font-size: 65px;
    font-weight: bold;
    //width: 500px;
    text-align: right;
    position: fixed;
    color: raba(0, 0, 0, 20%);
    right: calc((100vw - 1500px) / 2);
    bottom: 20px;
}
</style>