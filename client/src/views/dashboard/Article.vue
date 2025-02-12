<template>
    <n-tabs v-model:value="tabValue" justify-content="start" type="line">
        <n-tab-pane name="list" tab="文章列表">
            <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px">
                <n-card :title="blog.title">
                    {{ blog.content }}

                    <template #footer>
                        <n-space align="center">
                            <div>发布时间：{{ blog.create_time }}</div>
                            <n-button @click="toUpdate(blog)">修改</n-button>
                            <n-button @click="toDelete(blog)">删除</n-button>
                        </n-space>
                    </template>
                </n-card>
            </div>

            <n-space>
                <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount">
                    <div :style="'color:' + (pageNum == pageInfo.page ? 'red' : '')">
                        {{ pageNum }}
                    </div>
                </div>
            </n-space>

        </n-tab-pane>
        <n-tab-pane name="add" tab="添加文章">

            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="addArticle.categoryId" :options="categoryOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="addArticle.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="add">提交</n-button>
                </n-form-item>
            </n-form>

        </n-tab-pane>
        <n-tab-pane name="update" tab="修改文章">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="updateArticle.title" placeholder="请输入标题" />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="updateArticle.categoryId" :options="categoryOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="updateArticle.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="update">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup>

import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import RichTextEditor from '../../components/RichTextEditor.vue';
const router = useRouter()
const route = useRoute()

//在main.js已经用provide提供了 即可在其他页面直接注入使用
const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")

const adminStore = AdminStore()

//添加文章时需要传的东西
const addArticle = reactive({
    categoryId: 0,
    title: "",
    content: "",
})

//修改文章时需要传的东西
const updateArticle = reactive({
    id: 0,
    categoryId: 0,
    title: "",
    content: "",
})

const categoryOptions = ref([])
const blogListInfo = ref([])
const tabValue = ref("list")

const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    pageCount: 0,
    count: 0,
})

//在一进入这个页面的时候从服务端读取的数据
onMounted(() => {
    loadBlogs() //文章列表
    loadCategorys() //分类标签
})

const loadBlogs = async () => {
    let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`) //接服务端接口
    let temp_rows = res.data.data.rows;
    for (let row of temp_rows) {
        row.content += "..."
        let d = new Date(row.create_time)
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    blogListInfo.value = temp_rows;
    pageInfo.count = res.data.data.count;
    pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize) //向上取整 3.14返回4
    console.log(res)
}

const loadCategorys = async () => {
    let res = await axios.get("/category/list") //接服务端接口
    categoryOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
    console.log(categoryOptions.value)
}

const add = async () => {
    let res = await axios.post("/blog/_token/add", addArticle) //接服务端接口
    if (res.data.code == 200) { //服务端传回来的消息表示添加成功了
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
}

const toPage = async (pageNum) => {
    console.log('点击了页码：', pageNum);
    pageInfo.page = pageNum; //向后端传的时候就会把pageInfo.page第几页传过去 只要把用户点击的赋值给pageInfo.page就好
    loadBlogs() //页面变化 重新读取一下Blogs
}

const toUpdate = async (blog) => {
    tabValue.value = "update"
    let res = await axios.get("/blog/detail?id=" + blog.id) //接服务端接口
    //console.log(res)
    updateArticle.id = blog.id
    updateArticle.title = res.data.rows[0].title
    updateArticle.content = res.data.rows[0].content
    updateArticle.categoryId = res.data.rows[0].category_id
}

const update = async () => {
    let res = await axios.put("/blog/_token/update", updateArticle) //接服务端接口
    if (res.data.code == 200) { //服务端传回来的消息表示添加成功了
        message.info(res.data.msg)
        loadBlogs() //重新读取一下博客数据
        tabValue.value = "list"
    } else {
        message.error(res.data.msg)
    }
}

const toDelete = async (blog) => {
    let res = await axios.delete("/blog/_token/delete?id=" + blog.id) //接服务端接口
    if (res.data.code == 200) { //服务端传回来的消息表示添加成功了
        message.info(res.data.msg)
        loadBlogs() //重新读取一下博客数据
    } else {
        message.error(res.data.msg)
    }
}

</script>

<style lang="scss" scoped></style>