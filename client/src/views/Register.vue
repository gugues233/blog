<template>
  <div class="register-panel">
    <n-card title="管理后台注册">
      <n-form :rules="rules" :model="user">
        <n-form-item path="account" label="账号">
          <n-input v-model:value="user.account" placeholder="请输入账号" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input v-model:value="user.password" type="password" placeholder="请输入密码" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button @click="register">注册</n-button>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'naive-ui';
import axios from 'axios';

const router = useRouter();

const user = reactive({
  account: '',
  password: '',
});

const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 12, message: '账号长度在3到12个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' },
  ],
};

const register = async () => {
  try {
    const response = await axios.post('/register/register', user);
    if (response.data.code === 200) {
      message.success('注册成功');
      router.push('/login'); // 注册成功后跳转到登录页面
    } else {
      message.error(response.data.msg);
    }
  } catch (error) {
    message.error('注册失败，请稍后重试');
  }
};
</script>
