var router = require('koa-router')();
var fs = require('fs');
router.get('/', async function (ctx, next)
{

    // 读取文件
    var readFiles = async function ()
    {
        return new Promise(function (resolve, reject)
        {
            var mds = [];
            fs.readdir("./docs/" + ctx.params.name, function (err, files)
            {
                if (err)
                {
                    return console.error(err);
                }
                files.forEach(function (file)
                {
                    mds.push({ chapter_name: file });

                });
                console.log("发送文档章节")
                resolve(mds);
            });
        });
    };

    ctx.body = JSON.stringify(await readFiles());
});

module.exports = router;
