<template>
    <div>
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
            style="border-bottom: 1px solid #ccc" />
        <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, reactive, inject, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const server_url = inject("server_url")
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const toolbarConfig = { excludeKeys: ["uploadVideo"] };
const editorConfig = { placeholder: '请输入内容...' };
editorConfig.MENU_CONF = {} //初始化
editorConfig.MENU_CONF['uploadImage'] = {
    // 小于该值就插入 base64 格式（而不上传），默认为 0
    base64LimitSize: 10 * 1024, // 10kb
    server: server_url + '/upload/rich_editor_upload', //上传地址的配置
}
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src) => { //插入图片之前执行的一个函数
        if (src.indexOf("http") != 0) {
            return `${server_url}${src}`
        }
        return src
    }
}
const mode = ref("default")

const valueHtml = ref("")

const props = defineProps({
    modelValue: {
        type: String,
        default: ""
    }
})

const emit = defineEmits(["update:model-value"])
let initFinished = false;

onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.modelValue; //隔了十毫秒之后把modelValue赋值给valueHtml.value
        initFinished = true;
    }, 10); //加了一个延迟事件 延迟时间为10ms 
});

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;

    editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
    console.log('created', editor);
    editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
    if (initFinished) {//只有被初始化的时候才抛
        emit("update:model-value", valueHtml.value)
        //当富文本编辑器里的值发生变化时，就会往外抛一个事件update:model-value，值为valueHtml.value
    }
};



</script>

<style lang="scss" scoped></style>