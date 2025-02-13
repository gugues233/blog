<template>
    <div class="login-panel">
        <n-card title="管理后台登录">
            <n-form :rules="rules" :model="admin">
                <n-form-item path="account" label="账号">
                    <n-input v-model:value="admin.account" placeholder="请输入账号" />
                </n-form-item>
                <n-form-item path="password" label="密码">
                    <n-input v-model:value="admin.password" type="password" placeholder="请输入密码" />
                </n-form-item>
            </n-form>
            <template #footer>
                <n-checkbox v-model:checked="admin.rember" label="记住我" />
                <n-button @click="toLogin">登录</n-button>
                <n-button @click="toRegister" style="margin-left: 10px;">注册</n-button>
            </template>
        </n-card>
    </div>

</template>

<script setup>

//导入？
import { ref, reactive, inject } from 'vue'
import { AdminStore } from '../stores/AdminStore'

import { useRouter, useRoute } from 'vue-router'
//进行实例化
const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")
const adminStore = AdminStore()


let rules = { //规则
    account: [ //account有两条规则
        { required: true, message: "请输入账号", trigger: "blur" }, //required必填 如果
        { min: 3, max: 12, message: "账号长度在3到12个字符", trigger: "blur" }, //如果不满足3-12 则会显示message
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "密码长度在6到18个字符", trigger: "blur" },
    ],
};

const admin = reactive({
    account: localStorage.getItem("account") || "", //有可能读不到 即为空
    password: localStorage.getItem("password") || "",
    rember: localStorage.getItem("rember") == 1 || false
})

const toLogin = async () => { //将数据传给服务端
    let result = await axios.post("/admin/login", {
        account: admin.account,
        password: admin.password
    });

    //登录成功之后进行一个判断
    if (result.data.code == 200) { //如果登录成功 把这三个值记录在adminStore中
        adminStore.token = result.data.data.token
        adminStore.account = result.data.data.account
        adminStore.id = result.data.data.id

        if (admin.rember) {
            localStorage.setItem("account", admin.account)
            localStorage.setItem("password", admin.password)
            localStorage.setItem("rember", admin.rember ? 1 : 0)
        }
        router.push("/dashboard")
        message.info("登录成功")
    } else {
        message.error("登录失败")
    }
    console.log(result)
}

// 添加跳转注册页面的方法
const toRegister = () => {
  router.push("/register"); // 注册页面的路由是 /register
}

</script>

<style lang="scss" scoped>
.login-panel {
    width: 500px;
    margin: 0 auto;
    margin-top: 130px;
}
</style>