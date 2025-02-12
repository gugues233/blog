const express = require("express")
const router = express.Router()
const {db, genid} = require("../db/DbUtils")

// 列表接口（全查，不做分类）
router.get("/list", async (req, res) => {
    const search_sql = "SELECT * FROM `category`"

    let {err, rows} = await db.async.all(search_sql, [])

    if (err == null) {
        res.send({
            code : 200,
            msg : "查询成功",
            rows //相当于rows : rows
        })
    } else {
        res.send({
            code : 500,
            msg : "查询失败"
        })
    }
})


// 修改接口
router.put("/_token/update", async (req, res) => {
    
    //这样一个一个加token验证太麻烦了 使用中间件来解决这个问题
    // let {token} = req.headers; //拿到token 验证是否登录 若未登录则不能修改
    // //console.log(token)//输出 看看到底有没有拿到token

    // let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?" //有点问题
    // let adminResult = await db.async.all(admin_token_sql, [token])
    // if (adminResult.err != null || adminResult.rows.length == 0){
    //     res.send({
    //         code:403,
    //         msg:"请先登录"
    //     })
    //     return
    // }

    let {id, name} = req.body
    const update_sql = "UPDATE `category` SET `name` = ? WHERE `id` = ?"
    let {err, rows} = await db.async.run(update_sql, [name, id])

    if (err == null) {
        res.send({
            code : 200,
            msg : "修改成功"
        })
    } else {
        res.send({
            code : 500,///这应该要改
            msg : "修改失败"
        })
    }
})

// 删除接口
router.delete("/_token/delete", async (req, res) => {
    
    let id = req.query.id //query是相当于/category/delete?id=xxx 这样吗????
    const delete_sql = "DELETE FROM `category` WHERE `id` = ?"
    let {err, rows} = await db.async.run(delete_sql, [id])

    if (err == null) {
        res.send({
            code : 200,
            msg : "删除成功"
        })
    } else {
        res.send({
            code : 500,///这应该要改
            msg : "删除失败"
        })
    }
})

// 添加接口
router.post("/_token/add", async (req, res) => {
    
    let {name} = req.body
    const insert_sql = "INSERT INTO `category` (`id`, `name`) VALUES (?, ?)"
    let {err, rows} = await db.async.run(insert_sql, [genid.NextId(), name])

    if (err == null) {
        res.send({
            code : 200,
            msg : "添加成功"
        })
    } else {
        res.send({
            code : 500,///这应该要改
            msg : "添加失败"
        })
    }
})


module.exports = router