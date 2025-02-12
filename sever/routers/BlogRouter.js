const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");

//添加博客
router.post("/_token/add", async (req, res) => {
  let { title, categoryId, content } = req.body;
  let id = genid.NextId();
  let create_time = new Date().getTime();

  const insert_sql =
    "INSERT INTO `blog` (`id`, `title`, `category_id`, `content`, `create_time`) VALUES (?, ?, ?, ?, ?)";
  let params = [id, title, categoryId, content, create_time];

  let { err, rows } = await db.async.run(insert_sql, params);

  if (err == null) {
    res.send({
      code: 200,
      msg: "添加成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "添加失败",
    });
  }
});

//修改博客
router.put("/_token/update", async (req, res) => {
  //需要前端传输过来的
  let { id, title, categoryId, content } = req.body;
  let create_time = new Date().getTime();

  const update_sql =
    "UPDATE `blog` SET `title` = ?, `content` = ?, `category_id` = ? where `id` = ?";
  let params = [title, content, categoryId, id];

  let { err, rows } = await db.async.run(update_sql, params);

  if (err == null) {
    res.send({
      code: 200,
      msg: "修改成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "修改失败",
    });
  }
});

//删除博客
router.delete("/_token/delete", async (req, res) => {
  let id = req.query.id; //query是相当于/blog/delete?id=xxx 这样吗????
  const delete_sql = "DELETE FROM `blog` WHERE `id` = ?";
  let { err, rows } = await db.async.run(delete_sql, [id]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "删除成功",
    });
  } else {
    res.send({
      code: 500, ///这应该要改
      msg: "删除失败",
    });
  }
});

router.get("/detail", async (req, res) => {
  let { id } = req.query;
  let detail_sql = "SELECT * FROM `blog` WHERE `id` = ? ";
  let { err, rows } = await db.async.all(detail_sql, [id]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "获取成功",
      rows,
    });
  } else {
    res.send({
      code: 500,
      msg: "获取失败",
    });
  }
});

//查询博客
router.get("/search", async (req, res) => {
  /**
   * keyword 关键字 作用于标题和内容
   * categoryId 分类编号
   *
   * 分页：
   * page 页码
   * pageSize 分页大小
   */

  let { keyword, categoryId, page, pageSize } = req.query;

  //如果不加这些判断，前端必须把这四个内容都传过来
  page = page == null ? 1 : page;
  pageSize = pageSize == null ? 10 : pageSize;
  categoryId = categoryId == null ? 0 : categoryId;
  keyword = keyword == null ? "" : keyword;

  let params = [];
  let whereSqls = [];
  //分类
  if (categoryId != 0) {
    whereSqls.push(" `category_id` = ?");
    params.push(categoryId);
  }
  //关键字
  if (keyword != "") {
    whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?)");
    params.push("%" + keyword + "%"); //两个问号 要push两遍
    params.push("%" + keyword + "%");
  }

  let whereSqlStr = "";
  if (whereSqls.length > 0) {
    whereSqlStr = " WHERE " + whereSqls.join(" AND "); //会把有的拼接起来
  }
  //["`category_id` = ?", "`title` LIKE ? OR `content` LIKE ?"]
  //WHERE `category_id` = ? AND `title` LIKE ? OR `content` LIKE ?
  //上面那个逻辑不对 应该是WHERE `category_id` = ? AND (`title` LIKE ? OR `content` LIKE ?)

  //分页 查分页数据
  let searchSql =
    "SELECT `id`,`category_id`,`title`,substr(`content`,0,50) AS `content`,`create_time` FROM `blog` " +
    whereSqlStr +
    "ORDER BY `create_time` DESC LIMIT ?, ?";
  //参数1，上一行最后第一个问号，(page - 1) * pageSize  参数2，第二个问号，pageSize ，表示从第几个开始传几个
  //例如参数 2，10 第二页，每页十条记录
  //经过计算得 （2-1）*10，10 即10，10 表示从第十条开始 一共传十条记录
  let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize]);

  // 总数 总共201条数据 即要分201/10=20...1 共21页
  //查询数据总数
  let searchCountSql = " SELECT count(*) AS `count` FROM `blog` " + whereSqlStr;
  let searchCountParams = params;

  //分页数据
  let searchResult = await db.async.all(searchSql, searchSqlParams);
  //总数数据
  let countResult = await db.async.all(searchCountSql, searchCountParams);

  console.log(countResult);

  //返还给前端
  if (searchResult.err == null && countResult.err == null) {
    res.send({
      code: 200,
      msg: "查询成功",
      data: {
        keyword,
        categoryId, //虽然是前端传过来的，但以防万一（校验和显示），再给他传过去，要不要是前端的事
        page,
        pageSize,
        rows: searchResult.rows, //查到的数据
        count: countResult.rows[0].count, //如果不知道传过来的数据是怎么样的 可以先打印 再根据这个写格式
        //用count不太对 要给上面这个值取别名 或者count:countResult.rows[0]["count(*)"]
      },
    });
  } else {
    res.send({
      code: 500,
      msg: "查询失败",
    });
  }
});

module.exports = router;
