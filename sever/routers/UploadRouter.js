const express = require("express")
const router = express.Router()
const fs = require("fs")
const {db, genid} = require("../db/DbUtils")


router.post("/rich_editor_upload", async (req, res) => {
    
    if(!req.files) {//express4开始 req.files被弃用 应改用multer
        res.send({
            "errno": 1, // 只要不等于 0 就行
            "message": "失败信息"
        })
        return;
    }

    let files = req.files; //每次上传只能传一张图片 但该接口可以同时接收多个 故以多个的形式去解析  ?默认拿过来是多个
    let ret_files = [];

    for(let file of files){//默认拿过来是多个 用for处理？
        //获取文件名字后缀 例如aa.jpg
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)//以最后一个点的位置截断
        //随机文件名字 用雪花算法生成
        let file_name = genid.NextId() + "." + file_ext

        //修改文件名称+移动文件 ？修改的同时移动文件
        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + file.filename,
            process.cwd() + "/public/upload/" + file_name
        )//这里换了个行
        //process.cwd()程序所运行的目录的路径 把临时（temp）这个文件移到upload这个位置来 其实是往后退了一个目录
        //移到这个位置的同时，名字要变成刚才用雪花ID新起的名
        ret_files.push("/upload/" + file_name)//把文件名字保存起来，""中是访问的路径
    }


    //将文件返还回去
    res.send({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url": ret_files[0], //图片src，必须（图片路径）
                                //第零个，每次只有一张图片 每次返还一个

            // //非必须，所以不填了
            // "alt": "yyy", // 图片描述文字，非必须
            // "href": "zzz" // 图片的链接，非必须
        }
    })
})


module.exports = router