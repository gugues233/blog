<template>
    <div class="container">

        <n-button @click="back">返回</n-button>

        <!-- 标题 -->
        <n-h1>{{ blogInfo.title }}</n-h1>
        <!-- 文章内容 -->
        <div class="blog_content">
            <!-- 解析html文件为正常格式 -->
            <div v-html="blogInfo.content"></div>
        </div>

    </div>
</template>

<script setup>

import { ref, reactive, inject, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter() //上面这个路由用于做跳转
const route = useRoute()
const blogInfo = ref({})
const axios = inject("axios")


onMounted(() => {
    loadBlog()
})

const loadBlog = async () => {
    let res = await axios.get("/blog/detail?id=" + route.query.id) //接服务端接口
    blogInfo.value = res.data.rows[0];
}

const back = () => {
    router.push("/")
}

</script>

<style>
.blog_content img {
    max-width: 100% !important;
}
</style>

<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
}
</style>