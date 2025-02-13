const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");
//const bcrypt = require("bcrypt"); // 用于密码加密

// 注册接口
router.post("/register", async (req, res) => {
    let { account, password } = req.body;

    // 检查账号是否已存在
    const checkSql = "SELECT * FROM `admin` WHERE `account` = ?";
    let checkResult = await db.async.all(checkSql, [account]);
    if (checkResult.err != null) {
        res.send({
            code: 500,
            msg: "数据库查询出错",
        });
        return;
    }
    if (checkResult.rows.length > 0) {
        res.send({
            code: 400,
            msg: "账号已存在",
        });
        return;
    }

    // 对密码进行加密
   // const hashedPassword = await bcrypt.hash(password, 10);

    // 生成新的用户ID
    let id = genid.NextId();
    let create_time = new Date().getTime();

    // 插入新用户数据
    const insertSql = "INSERT INTO `admin` (`id`, `account`, `password`, `create_time`) VALUES (?, ?, ?, ?)";
    let params = [id, account, password, create_time];
    let insertResult = await db.async.run(insertSql, params);

    if (insertResult.err == null) {
        res.send({
            code: 200,
            msg: "注册成功",
        });
    } else {
        res.send({
            code: 500,
            msg: "注册失败",
        });
    }
});

module.exports = router;
