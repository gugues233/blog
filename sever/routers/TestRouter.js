const express = require("express")
const router = express.Router()
const {db, genid} = require("../db/DbUtils")


router.get("/test", async (req, res) => {
    // db.all("select * from `admin`",[],(err, rows) => {
    //     console.log(rows)
    // })

    // db.async.all("select * from `admin`",[]).then((res) => {
    //     console.log(res)
    // })这两段加起来和下面的out一样？

    let out = await db.async.all("select * from `admin`", []);

    res.send({
        id:genid.NextId(),
        out //相当于out:out
    })
})


module.exports = router