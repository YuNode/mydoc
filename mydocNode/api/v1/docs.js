var router = require('koa-router')();
var fs = require('fs');

// var mongoose = require('mongoose');

router.get('/', async function (ctx, next)
{

    // 读取文件列表
    var readFiles = async function ()
    {
        return new Promise(function (resolve, reject)
        {
            var docs = [];
            fs.readdir("./docs/", function (err, files)
            {
                if (err)
                {
                    return console.error(err);
                }
                files.forEach(function (file)
                {
                    docs.push({ doc_name: file });
                });
                console.log("发送文档列表")
                resolve(docs);
            });
        });
    };
    ctx.body = JSON.stringify(await readFiles());
});
module.exports = router;
