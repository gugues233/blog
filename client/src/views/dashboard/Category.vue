<template>
    <div>
        <n-button @click="showAddModel = true">添加</n-button>
        <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>编号</th>
                    <th>名称</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(category, index) in categoryList">
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>
                        <n-space>
                            <n-button @click="toUpdate(category)">修改</n-button>
                            <n-button @click="deleteCategory(category)">删除</n-button>
                        </n-space>
                    </td>
                </tr>
            </tbody>
        </n-table>

        <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">
            <template #header>
                <div>添加分类</div>
            </template>
            <div>
                <n-input v-model:value="addCategory.name" type="text" placehoder="请输入名称" />
            </div>
            <template #action>
                <div>
                    <n-button @click="add">提交</n-button>
                </div>
            </template>
        </n-modal>

        <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
            <template #header>
                <div>修改分类</div>
            </template>
            <div>
                <n-input v-model:value="updateCategory.name" type="text" placehoder="请输入名称" />
            </div>
            <template #action>
                <div>
                    <n-button @click="update">提交</n-button>
                </div>
            </template>
        </n-modal>


    </div>
</template>

<script setup>

import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

//在main.js已经用provide提供了 即可在其他页面直接注入使用
const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")

const adminStore = AdminStore()

const showAddModel = ref(false)
const showUpdateModel = ref(false)

const categoryList = ref([])
const addCategory = reactive({
    name: ""
})

const updateCategory = reactive({
    id: 0,
    name: ""
})

onMounted(() => {
    loadDatas() //一开始就调用这个方法
})

const loadDatas = async () => { //获取数据
    let res = await axios.get("/category/list") //接服务端接口
    categoryList.value = res.data.rows
}

const add = async () => {
    let res = await axios.post("/category/_token/add", { name: addCategory.name }) //接服务端接口
    if (res.data.code == 200) { //服务端传回来的消息表示添加成功了
        loadDatas() // 重新调用这个方法，相当于让页面“刷新”一下 但这个不会丢失登录状态
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showAddModel.value = false;
}

const toUpdate = async (category) => {
    showUpdateModel.value = true
    updateCategory.id = category.id
    updateCategory.name = category.name
}

const update = async () => {
    let res = await axios.put("/category/_token/update", { id: updateCategory.id, name: updateCategory.name }) //接服务端接口
    if (res.data.code == 200) { //服务端传回来的消息表示添加成功了
        loadDatas() // 重新调用这个方法，相当于让页面“刷新”一下 但这个不会丢失登录状态
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showUpdateModel.value = false;
}

const deleteCategory = async (category) => {

    dialog.warning({
        title: "警告",
        content: "是否要删除？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => { //点击确定之后才会执行
            let res = await axios.delete(`/category/_token/delete?id=${category.id}`) //接服务端接口
            if (res.data.code == 200) {
                loadDatas() // 重新调用这个方法，相当于让页面“刷新”一下 但这个不会丢失登录状态
                message.info(res.data.msg)
            } else {
                message.error(res.data.msg)
            }
        },
        onNegativeClick: () => { }
    });

}

</script>

<style lang="scss" scoped></style>