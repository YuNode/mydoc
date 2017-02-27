var router = require('koa-router')();
var Bookmarks = require('../../models/bookmarks.js');

router.post('/', async function (ctx, next)
{
    console.log(ctx.request.body);
    var saveBookmark = async function ()
    {
        return new Promise(function (resolve, reject)
        {
            var newBookmarks = new Bookmarks({
                userId: ctx.request.body.userId
            })
            newBookmarks.add(ctx.request.body.docname, ctx.request.body.docchapter, function (err)
            {
                if (err)
                {
                    console.log("添加书签失败")
                    resolve({ "status": 20, "message": "添加书签失败" })
                } else
                {
                    console.log("添加书签成功")
                    resolve({ "status": 0, "message": "添加书签失败成功" })
                }
            })

        });
    }
    ctx.body = await saveBookmark()

});

router.get('/', async function (ctx, next)
{
    console.log(ctx.query);

    var getBookmarks = async function ()
    {
        return new Promise(function (resolve, reject)
        {
            var newBookmarks = new Bookmarks({
                userId: ctx.query.userId
            })
            newBookmarks.get(function (err, userBookmarks)
            {
                if (err)
                {
                    console.log("获取书签失败")
                    resolve({ "status": 30, "message": "添加书签失败" })
                } else
                {
                    var successObj = { "status": 0, "message": "登录成功" }
                    successObj.userBookmarks = userBookmarks;
                    resolve(successObj)
                }
            })
        });
    }
    ctx.body = await getBookmarks()

});
router.put('/', async function (ctx, next)
{
    //console.log(ctx.query);
    
    var delBookmarks = async function ()
    {
        return new Promise(function (resolve, reject)
        {
            var newBookmarks = new Bookmarks({
                userId: ctx.query.userId
            })
            newBookmarks.del(ctx.query.bookmarkid, function (err)
            {
                if (err)
                {
                    console.log("删除书签失败");
                    resolve({ "status": 40, "message": "删除书签失败" });
                } else
                {
                    console.log("删除书签成功");
                    
                    resolve({ "status": 0, "message": "删除书签成功" });
                }
            })
        });
    }
    ctx.body = await delBookmarks()

});
module.exports = router;
