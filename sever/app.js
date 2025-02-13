const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const { db, genid } = require("./db/DbUtils"); //在同一目录 ../是后退一个目录 ./是当前目录
const port = 8080;

//开放跨域请求
app.use(function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "*");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, POST, GET, OPTIONS");
  if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
  else next();
});

app.use(express.json());
const update = multer({
  dest: "./public/upload/temp",
});
app.use(update.any());
//指定静态资源路径
app.use(express.static(path.join(__dirname, "public")));

//在路由的前面写token验证的中间件
const ADMIN_TOKEN_PATH = "/_token"; //例如/category/add希望这个接口加一个token验证
//则/category/_token/add只要路径里含有_token都进行token校验
app.all("*", async (req, res, next) => {
  //每一个接口访问之前先来这里判断
  const ADMIN_TOKEN_PATH = "/_token"; //例如/category/add希望这个接口加一个token验证
  if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    //如果找到了ADMIN_TOKEN_PATH（/_tolen）这一小段路径 则校验

    let { token } = req.headers; //拿到token 验证是否登录 若未登录则不能修改

    let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"; //有点问题
    let adminResult = await db.async.all(admin_token_sql, [token]);
    if (adminResult.err != null || adminResult.rows.length == 0) {
      res.send({
        code: 403,
        msg: "请先登录",
      });
      return;
    } else {
      //如果通过了就下一步
      next();
    }
  } else {
    //否则不校验 直接下一步
    next();
  }
});

app.use("/test", require("./routers/TestRouter"));
app.use("/admin", require("./routers/AdminRouter"));
app.use("/register", require("./routers/RegisterRouter"));
app.use("/category", require("./routers/CategoryRouter"));
app.use("/blog", require("./routers/BlogRouter"));
app.use("/upload", require("./routers/UploadRouter"));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`启动成功 : http://localhost:${port}/`);
});
